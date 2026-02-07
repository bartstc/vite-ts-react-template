import { act, renderHook } from "@testing-library/react";
import { expect, it } from "vitest";

import { useCounter } from "./use-counter";

it("should increment the count", () => {
  const { result } = renderHook(() => useCounter());

  act(() => {
    result.current.increment();
    result.current.increment();
  });

  expect(result.current.count).toBe(2);
});
