import { describe, it, expectTypeOf } from "vitest";

import type { OneOfUnion } from "./one-of-union";

type MyUnion =
  | { type: "a"; value: number }
  | { type: "b"; value: string }
  | { type: "c"; value: boolean };

describe("OneOfUnion", () => {
  it("extracts correct type", () => {
    type ExtractedA = OneOfUnion<MyUnion, "a">;
    type ExtractedB = OneOfUnion<MyUnion, "b">;
    type ExtractedC = OneOfUnion<MyUnion, "c">;

    expectTypeOf<ExtractedA>().toEqualTypeOf<{ type: "a"; value: number }>();
    expectTypeOf<ExtractedB>().toEqualTypeOf<{ type: "b"; value: string }>();
    expectTypeOf<ExtractedC>().toEqualTypeOf<{ type: "c"; value: boolean }>();
  });
});
