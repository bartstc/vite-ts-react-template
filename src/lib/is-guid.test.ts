import { describe, it, expect } from "vitest";

import { isGuid } from "@/lib/is-guid";

describe("isGuid", () => {
  it("returns true when matches", () => {
    const validGuids = [
      "47db975c-8199-4b1e-9861-e8cd266694f8",
      "8e000140-51ad-4334-8960-b61dc53d46ef",
      "e9cc8e5e-1286-4eeb-b941-055940c189b2",
    ];

    const results = validGuids.map((guid) => isGuid(guid));
    expect(results.every((result) => result === true)).toBeTruthy();
  });

  it(`returns false when doesn't match`, () => {
    const invalidGuids = [
      "not-a-guid",
      "12345678-1234-5678-9abc-def012345678",
      "aabbccdd-1234-5678-9abc-def0123456789",
      "deadbeef-1a2b-3c4d-5e6f-7a8b9c0d0e0g",
    ];

    const results = invalidGuids.map((guid) => isGuid(guid));
    expect(results.every((result) => result === true)).toBeFalsy();
  });
});
