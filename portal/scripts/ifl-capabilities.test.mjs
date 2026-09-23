import { test } from "node:test";
import assert from "node:assert/strict";
import { extractIflCapabilities, IFL_CAPABILITIES } from "./ifl-capabilities.mjs";

test("vocabulary is the frozen list", () => {
  assert.deepEqual(IFL_CAPABILITIES, ["ifl:irb"]);
});

test("an irb unit publishes ifl:irb", () => {
  const body = `interfaces {
    irb {
        unit $UNIT {
            family inet {
                address $IRB_ADDR;
            }
        }
    }
}`;
  assert.deepEqual(extractIflCapabilities(body), ["ifl:irb"]);
});

test("a virtual-gateway irb unit publishes ifl:irb", () => {
  const body = `interfaces {
    irb {
        unit $UNIT {
            virtual-gateway-accept-data;
            family inet {
                address $IRB_ADDR {
                    virtual-gateway-address $VGA;
                }
            }
            virtual-gateway-v4-mac $VG_MAC;
        }
    }
}`;
  assert.deepEqual(extractIflCapabilities(body), ["ifl:irb"]);
});

test("an irb device with no logical unit publishes nothing", () => {
  assert.deepEqual(extractIflCapabilities("interfaces {\n    irb {\n    }\n}"), []);
});

test("a non-irb interface publishes nothing", () => {
  const body = `interfaces {
    ae11 {
        unit 0 {
            family inet {
                address 10.0.0.1/31;
            }
        }
    }
}`;
  assert.deepEqual(extractIflCapabilities(body), []);
});

test("an irb unit named only inside a comment or string is not structure", () => {
  const commented = `/* interfaces { irb { unit 0 { } } } */
interfaces {
    ae11 {
        unit 0 {
            description "interfaces irb unit 0 {";
        }
    }
}`;
  assert.deepEqual(extractIflCapabilities(commented), []);
});

test("a routing-instance irb reference is not a definition", () => {
  const body = `routing-instances {
    METRO_L3VPN_4000 {
        instance-type vrf;
        interface irb.4000;
    }
}`;
  assert.deepEqual(extractIflCapabilities(body), []);
});

test("empty and non-string bodies are safe", () => {
  assert.deepEqual(extractIflCapabilities(""), []);
  assert.deepEqual(extractIflCapabilities(null), []);
  assert.deepEqual(extractIflCapabilities(undefined), []);
});
