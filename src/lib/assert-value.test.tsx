import { describe, it, expect } from "vitest";

import { assertValue } from "./assert-value";

describe("assertValue", () => {
  it("should not throw for non-null single value", () => {
    expect(() => {
      assertValue("test");
    }).not.toThrow();
  });

  it("should throw for null single value", () => {
    expect(() => {
      assertValue(null);
    }).toThrow("Value must not be null or undefined");
  });

  it("should throw for undefined single value", () => {
    expect(() => {
      assertValue(undefined);
    }).toThrow("Value must not be null or undefined");
  });

  it("should throw with custom error", () => {
    const customError = new Error("Custom error");
    expect(() => {
      assertValue(null, customError);
    }).toThrow(customError);
  });
});
