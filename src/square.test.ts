import { describe, expect, test } from "vitest";

import { square } from "@/square";

describe("square", () => {
  test("should return the square of a number", () => {
    expect(square(2)).toBe(4);
    expect(square(3)).toBe(9);
    expect(square(-4)).toBe(16);
  });
});
