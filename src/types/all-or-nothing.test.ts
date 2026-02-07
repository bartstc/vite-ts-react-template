/* eslint-disable @typescript-eslint/no-empty-function */
import type { ReactNode } from "react";
import { describe, it, expectTypeOf } from "vitest";

import type { AllOrNothing } from "./all-or-nothing";

type ChangeFn = () => void;

type ControllableValue<TValue> = AllOrNothing<{
  value: TValue;
  onValueChange: ChangeFn;
}>;

type Props = ControllableValue<string> & { children: ReactNode };

describe("AllOrNothing", () => {
  it("matches the type when only required properties defined", () => {
    expectTypeOf({
      children: "child",
    }).toMatchTypeOf<Props>();
  });

  it(`doesn't match the type when only value defined`, () => {
    expectTypeOf({
      children: "child",
      value: "value",
    }).not.toMatchTypeOf<Props>();
  });

  it(`doesn't match the type when only onValueChange defined`, () => {
    expectTypeOf({
      children: "child",
      onValueChange: () => {},
    }).not.toMatchTypeOf<Props>();
  });

  it("matches the type when all properties defined", () => {
    expectTypeOf({
      children: "child",
      value: "value",
      onValueChange: () => {},
    }).toMatchTypeOf<Props>();
  });
});
