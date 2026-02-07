import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useFormatDate } from "./use-format-date";

describe("useFormatDate", () => {
  it("should format date in default short format", () => {
    const date = new Date("2023-10-17T07:13:04.28+00:00");

    const { result } = renderHook(() => useFormatDate());
    const format = result.current;

    expect(format(date)).toBe("17/10/2023");
  });

  it("should format date in long format", () => {
    const date = new Date("2023-10-17T07:13:04.28+00:00");

    const { result } = renderHook(() => useFormatDate());
    const format = result.current;

    expect(format(date, { format: "long" })).toBe("17 October 2023");
  });

  it("should format date in longWithoutDay format", () => {
    const date = new Date("2023-10-17T07:13:04.28+00:00");

    const { result } = renderHook(() => useFormatDate());
    const format = result.current;

    expect(format(date, { format: "longWithoutDay" })).toBe("October 2023");
  });

  it("should format date when string date is provided", () => {
    const stringDate = "2023-10-17T07:13:04.28+00:00";

    const { result } = renderHook(() => useFormatDate());
    const format = result.current;

    expect(format(stringDate)).toBe("17/10/2023");
  });

  it("should display a fallback value when an invalid date value is provided", () => {
    const { result } = renderHook(() => useFormatDate());
    const format = result.current;

    expect(format("")).toBe("---");
  });
});
