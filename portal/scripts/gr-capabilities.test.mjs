import { test } from "node:test";
import assert from "node:assert/strict";
import { extractGrCapabilities, GR_CAPABILITIES } from "./gr-capabilities.mjs";

test("vocabulary is the frozen list", () => {
  assert.deepEqual(GR_CAPABILITIES, ["gr:edge-intf-mh"]);
});

test("a defined GR-EDGE-INTF-MH group publishes the capability", () => {
  const body = `groups {
    GR-EDGE-INTF-MH {
        interfaces {
            <*> {
                mtu 9102;
            }
        }
    }
}`;
  assert.deepEqual(extractGrCapabilities(body), ["gr:edge-intf-mh"]);
});

test("a different group publishes nothing", () => {
  const body = `groups {
    GR-EDGE-INTF {
        interfaces {
            <*> {
                mtu 9102;
            }
        }
    }
}`;
  assert.deepEqual(extractGrCapabilities(body), []);
});

test("an empty group block publishes nothing", () => {
  assert.deepEqual(extractGrCapabilities("groups {\n    GR-EDGE-INTF-MH {\n    }\n}"), []);
});

test("applying a group is not defining it", () => {
  const body = `interfaces {
    ae11 {
        apply-groups GR-EDGE-INTF-MH;
    }
}`;
  assert.deepEqual(extractGrCapabilities(body), []);
});

test("a group named only in a comment or string is not structure", () => {
  const body = `/* groups { GR-EDGE-INTF-MH { mtu 1; } } */
interfaces {
    ae11 {
        description "groups { GR-EDGE-INTF-MH {";
    }
}`;
  assert.deepEqual(extractGrCapabilities(body), []);
});

test("empty and non-string bodies are safe", () => {
  assert.deepEqual(extractGrCapabilities(""), []);
  assert.deepEqual(extractGrCapabilities(null), []);
  assert.deepEqual(extractGrCapabilities(undefined), []);
});
