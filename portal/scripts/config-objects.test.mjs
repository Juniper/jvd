import { test } from "node:test";
import assert from "node:assert/strict";
import {
  parseConfig,
  canonicalize,
  canonicalizeObject,
  findObjects,
  findPolicerReferences,
  normalizeNewlines,
} from "./config-objects.mjs";

const FILTER_PATH = [["firewall"], ["family", "any"], ["filter", "*"]];
const POLICER_PATH = [["firewall"], ["policer", "*"]];

test("balanced braces parse and round-trip through canonicalize", () => {
  const text = `firewall {
    policer p {
        if-exceeding {
            bandwidth-limit 50m;
        }
        then discard;
    }
}`;
  const { nodes, ok } = parseConfig(text);
  assert.equal(ok, true);
  assert.equal(
    canonicalize(nodes),
    ["firewall {", "  policer p {", "    if-exceeding {", "      bandwidth-limit 50m;", "    }", "    then discard;", "  }", "}"].join("\n"),
  );
});

test("comments are ignored but the statements around them survive", () => {
  const a = `firewall {
    /* leading note */
    policer p {
        bandwidth-limit 50m; ## annotation
        # hash comment
        burst-size-limit 2m;
    }
}`;
  const b = `firewall {
    policer p {
        bandwidth-limit 50m;
        burst-size-limit 2m;
    }
}`;
  assert.equal(canonicalize(parseConfig(a).nodes), canonicalize(parseConfig(b).nodes));
  assert.match(canonicalize(parseConfig(a).nodes), /burst-size-limit 2m;/);
});

test("braces and semicolons inside quoted strings are not structure", () => {
  const text = `firewall {
    policer p {
        description "a { b ; c }";
    }
}`;
  const { nodes, ok } = parseConfig(text);
  assert.equal(ok, true);
  assert.equal(canonicalize(nodes), 'firewall {\n  policer p {\n    description "a { b ; c }";\n  }\n}');
});

test("quoted content is preserved verbatim, not discarded", () => {
  const one = parseConfig('system { host-name "router one"; }');
  const two = parseConfig('system { host-name "router two"; }');
  assert.notEqual(canonicalize(one.nodes), canonicalize(two.nodes));
});

test("no configuration statement is dropped", () => {
  const text = `firewall {
    family any {
        filter f {
            interface-specific;
            term t1 {
                from { source-address { 10.0.0.0/8; } }
                then policer p;
            }
        }
    }
}`;
  const canon = canonicalize(parseConfig(text).nodes);
  for (const stmt of ["interface-specific;", "10.0.0.0/8;", "then policer p;"]) {
    assert.ok(canon.includes(stmt), `missing ${stmt}`);
  }
});

test("a deactivated statement is marked, never silently kept or dropped", () => {
  const { nodes } = parseConfig("firewall { inactive: policer p { then discard; } }");
  assert.equal(canonicalize(nodes), "firewall {\n  inactive: policer p {\n    then discard;\n  }\n}");
  assert.deepEqual(findObjects(nodes, POLICER_PATH), []);
});

test("malformed input fails closed rather than parsing partially", () => {
  assert.equal(parseConfig("firewall { policer p { then discard; }").ok, false); // missing close
  assert.equal(parseConfig("firewall { } }").ok, false); // stray close
  assert.equal(parseConfig("firewall { dangling }").ok, false); // no terminator
  assert.equal(parseConfig('firewall { description "unterminated; }').ok, false);
  assert.equal(parseConfig("firewall { /* unterminated }").ok, false);
});

test("a block closed with `};` parses and defines nothing extra", () => {
  const { nodes, ok } = parseConfig("firewall { family inet { filter test { /* OMITTED */ }; } }");
  assert.equal(ok, true);
  assert.equal(canonicalize(nodes), "firewall {\n  family inet {\n    filter test {\n    }\n  }\n}");
});

test("list bracket spacing is regularized without losing members", () => {
  const spaced = parseConfig("protocols { x { import [ A B ]; } }");
  const tight = parseConfig("protocols { x { import [A B]; } }");
  assert.equal(canonicalize(spaced.nodes), canonicalize(tight.nodes));
  assert.match(canonicalize(tight.nodes), /import \[ A B \];/);
});

test("CRLF and lone CR are equivalent to LF", () => {
  const lf = "firewall {\n  policer p {\n    then discard;\n  }\n}";
  const crlf = lf.replace(/\n/g, "\r\n");
  const cr = lf.replace(/\n/g, "\r");
  assert.equal(normalizeNewlines(crlf), lf);
  assert.equal(canonicalize(parseConfig(crlf).nodes), canonicalize(parseConfig(lf).nodes));
  assert.equal(canonicalize(parseConfig(cr).nodes), canonicalize(parseConfig(lf).nodes));
});

test("indentation and blank lines are structurally irrelevant", () => {
  const pretty = "firewall {\n        policer p {\n\n            then discard;   \n        }\n}";
  const flat = "firewall{policer p{then discard;}}";
  assert.equal(canonicalize(parseConfig(pretty).nodes), canonicalize(parseConfig(flat).nodes));
});

test("statement order is significant", () => {
  const a = parseConfig("firewall { policer p { bandwidth-limit 50m; burst-size-limit 2m; } }");
  const b = parseConfig("firewall { policer p { burst-size-limit 2m; bandwidth-limit 50m; } }");
  assert.notEqual(canonicalize(a.nodes), canonicalize(b.nodes));
});

test("findObjects extracts each named object independently", () => {
  const text = `firewall {
    family any {
        filter A { interface-specific; }
        filter B { term t1 { then policer p2; } }
    }
    policer p1 { then discard; }
}`;
  const { nodes } = parseConfig(text);
  const filters = findObjects(nodes, FILTER_PATH);
  assert.deepEqual(filters.map((f) => f.name), ["A", "B"]);
  assert.equal(filters[0].path, "firewall family any filter A");
  assert.equal(canonicalizeObject(filters[0].node), "filter A {\n  interface-specific;\n}");
  assert.deepEqual(findObjects(nodes, POLICER_PATH).map((p) => p.name), ["p1"]);
});

test("zero, one and multiple definitions are each distinguishable", () => {
  const none = parseConfig("firewall { policer other { then discard; } }");
  assert.equal(findObjects(none.nodes, POLICER_PATH).filter((p) => p.name === "p").length, 0);

  const one = parseConfig("firewall { policer p { then discard; } }");
  assert.equal(findObjects(one.nodes, POLICER_PATH).filter((p) => p.name === "p").length, 1);

  const twice = parseConfig("firewall { policer p { then discard; } policer p { then accept; } }");
  const hits = findObjects(twice.nodes, POLICER_PATH).filter((p) => p.name === "p");
  assert.equal(hits.length, 2);
  assert.notEqual(hits[0].canonical, hits[1].canonical);
});

test("a filter's policer references are detected in both Junos spellings", () => {
  const flat = parseConfig("firewall { family any { filter f { term t1 { then policer P1; } } } }");
  assert.deepEqual(findPolicerReferences(findObjects(flat.nodes, FILTER_PATH)[0].node), ["P1"]);

  const blocked = parseConfig("firewall { family any { filter f { term t1 { then { policer P2; accept; } } } } }");
  assert.deepEqual(findPolicerReferences(findObjects(blocked.nodes, FILTER_PATH)[0].node), ["P2"]);
});

test("a deactivated action references nothing", () => {
  const off = parseConfig("firewall { family any { filter f { term t1 { inactive: then policer P1; } } } }");
  assert.deepEqual(findPolicerReferences(findObjects(off.nodes, FILTER_PATH)[0].node), []);
});

test("an object outside the selector path is not extracted", () => {
  const { nodes } = parseConfig("firewall { family inet { filter F { interface-specific; } } }");
  assert.deepEqual(findObjects(nodes, FILTER_PATH), []);
});
