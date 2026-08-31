import { test } from "node:test";
import assert from "node:assert/strict";
import { extractBgpCapabilities, BGP_CAPABILITIES } from "./bgp-capabilities.mjs";

// 1. All five active capabilities present.
test("scanner: all five active capabilities", () => {
  const body = `protocols {
    bgp {
        group G {
            family inet { labeled-unicast { rib { inet.3; } } }
            family inet-vpn { unicast; }
            family inet6-vpn { unicast; }
            family l2vpn { signaling; }
            family evpn { signaling; }
            family route-target { nexthop-resolution { no-resolution; } }
        }
    }
}`;
  assert.deepEqual(extractBgpCapabilities(body), ["evpn", "l2vpn", "inet-vpn", "inet6-vpn", "labeled-unicast"]);
});

// 2. Families spread beneath multiple BGP groups are unioned.
test("scanner: families beneath multiple groups", () => {
  const body = `protocols {
    bgp {
        group TRANSPORT { family inet { labeled-unicast; } }
        group SERVICE { family inet-vpn { unicast; } family evpn { signaling; } }
    }
}`;
  assert.deepEqual(extractBgpCapabilities(body), ["evpn", "inet-vpn", "labeled-unicast"]);
});

// 3. Family hierarchy outside protocols bgp is ignored.
test("scanner: unrelated family outside protocols bgp", () => {
  const body = `protocols {
    evpn { encapsulation vxlan; }
}
routing-instances {
    RI { protocols { bgp { family l2vpn { signaling; } } } }
}`;
  assert.deepEqual(extractBgpCapabilities(body), []);
});

// 4. Matching words inside comments are ignored.
test("scanner: family words inside comments", () => {
  const body = `protocols {
    bgp {
        /* family evpn { signaling; } */
        # family l2vpn signaling
        family inet-vpn { unicast; }
    }
}`;
  assert.deepEqual(extractBgpCapabilities(body), ["inet-vpn"]);
});

// 5. Braces and family words inside quoted strings are ignored.
test("scanner: braces and family words inside strings", () => {
  const body = `protocols {
    bgp {
        group G {
            neighbor 1.1.1.1 { description "family evpn { signaling } fake"; }
            family l2vpn { signaling; }
        }
    }
}`;
  assert.deepEqual(extractBgpCapabilities(body), ["l2vpn"]);
});

// 6. Escaped quotes inside strings do not break scanning.
test("scanner: escaped quotes in strings", () => {
  const body = `protocols {
    bgp {
        group G {
            neighbor 1.1.1.1 { description "a \\" family evpn { } \\" b"; }
            family inet6-vpn { unicast; }
        }
    }
}`;
  assert.deepEqual(extractBgpCapabilities(body), ["inet6-vpn"]);
});

// 7. route-target is excluded.
test("scanner: route-target excluded", () => {
  const body = `protocols {
    bgp {
        family route-target { nexthop-resolution { no-resolution; } }
    }
}`;
  assert.deepEqual(extractBgpCapabilities(body), []);
});

// 8. labeled-unicast beneath inet.
test("scanner: labeled-unicast under inet", () => {
  const body = `protocols { bgp { group G { family inet { labeled-unicast { rib { inet.3; } } } } } }`;
  assert.deepEqual(extractBgpCapabilities(body), ["labeled-unicast"]);
});

// 9. labeled-unicast beneath inet6.
test("scanner: labeled-unicast under inet6", () => {
  const body = `protocols { bgp { group G { family inet6 { labeled-unicast; } } } }`;
  assert.deepEqual(extractBgpCapabilities(body), ["labeled-unicast"]);
});

// family inet unicast (no labeled-unicast) must NOT yield labeled-unicast.
test("scanner: family inet without labeled-unicast", () => {
  const body = `protocols { bgp { group G { family inet { unicast; } } } }`;
  assert.deepEqual(extractBgpCapabilities(body), []);
});

// 10. Inactive family is excluded.
test("scanner: inactive family excluded", () => {
  const body = `protocols {
    bgp {
        inactive: family evpn { signaling; }
        family l2vpn { signaling; }
    }
}`;
  assert.deepEqual(extractBgpCapabilities(body), ["l2vpn"]);
});

// 11. Inactive BGP group/subtree is excluded.
test("scanner: inactive group subtree excluded", () => {
  const body = `protocols {
    bgp {
        inactive: group DEAD { family evpn { signaling; } family inet-vpn { unicast; } }
        group LIVE { family l2vpn { signaling; } }
    }
}`;
  assert.deepEqual(extractBgpCapabilities(body), ["l2vpn"]);
});

// 12. Malformed / unbalanced input fails safe (returns []), never invents.
test("scanner: unbalanced input fails safe", () => {
  const missingClose = `protocols { bgp { family evpn { signaling; }`; // missing closing braces
  assert.deepEqual(extractBgpCapabilities(missingClose), []);
  const strayClose = `protocols { bgp { family evpn { signaling; } } } }`;
  assert.deepEqual(extractBgpCapabilities(strayClose), []);
});

// Empty / non-string input.
test("scanner: empty and non-string input", () => {
  assert.deepEqual(extractBgpCapabilities(""), []);
  assert.deepEqual(extractBgpCapabilities(null), []);
  assert.deepEqual(extractBgpCapabilities(undefined), []);
});

// No protocols bgp at all.
test("scanner: no bgp block", () => {
  assert.deepEqual(extractBgpCapabilities("system { host-name foo; }"), []);
});

// Vocabulary is exactly the five frozen values.
test("scanner: frozen vocabulary", () => {
  assert.deepEqual(BGP_CAPABILITIES, ["evpn", "l2vpn", "inet-vpn", "inet6-vpn", "labeled-unicast"]);
});

// Finding 3: a valid family BEFORE an unterminated comment/string or a dangling
// statement must still fail safe (return []), never leak the earlier family.
test("scanner: valid family then unterminated block comment -> []", () => {
  const body = `protocols { bgp { group G { family evpn { signaling; } } } } /* dangling comment`;
  assert.deepEqual(extractBgpCapabilities(body), []);
});

test("scanner: valid family then unterminated quoted string -> []", () => {
  const body = `protocols { bgp { group G { family evpn { signaling; } } } } foo "dangling string`;
  assert.deepEqual(extractBgpCapabilities(body), []);
});

test("scanner: valid family then dangling statement (no ; or {}) -> []", () => {
  const body = `protocols { bgp { group G { family evpn { signaling; } } } } trailing-word`;
  assert.deepEqual(extractBgpCapabilities(body), []);
});

test("scanner: dangling statement inside a block -> []", () => {
  const body = `protocols { bgp { group G { family evpn { signaling; } dangling } } }`;
  assert.deepEqual(extractBgpCapabilities(body), []);
});
