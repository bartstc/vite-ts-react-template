import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useFormatDateTime } from "./use-format-date-time";

describe("useFormatDateTime", () => {
  it("should format date and time", () => {
    const date = new Date("2023-10-17T07:13:04.28+00:00");

    const { result } = renderHook(() => useFormatDateTime());
    const format = result.current;

    expect(format(date)).toBe("17 October 2023 at 08:13 am");
  });

  it("should format date and time when string date is provided", () => {
    const stringDate = "2023-10-17T07:13:04.28+00:00";

    const { result } = renderHook(() => useFormatDateTime());
    const format = result.current;

    expect(format(stringDate)).toBe("17 October 2023 at 08:13 am");
  });

  it("should display a fallback value when an invalid date value is provided", () => {
    const { result } = renderHook(() => useFormatDateTime());
    const format = result.current;

    expect(format("")).toBe("---");
  });
});
