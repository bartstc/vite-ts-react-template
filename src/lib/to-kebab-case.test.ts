import { describe, expect, it } from "vitest";

import { toKebabCase } from "./to-kebab-case";

describe("toKebabCase", () => {
  it("keeps existing kebab case", () => {
    const result = toKebabCase("already-kebab-case");
    expect(result).toBe("already-kebab-case");
  });

  it("converts string with spaces to kebab case", () => {
    const result = toKebabCase("Hello World");
    expect(result).toBe("hello-world");
  });

  it("converts string with special characters to kebab case", () => {
    const result = toKebabCase("Hello@World");
    expect(result).toBe("hello-world");
  });

  it("converts string with dots to kebab case", () => {
    const result = toKebabCase("hello.world");
    expect(result).toBe("hello-world");
  });
});
