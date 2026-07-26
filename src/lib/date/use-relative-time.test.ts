import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useRelativeTime } from "./use-relative-time";

describe("useRelativeTime", () => {
  // Mock current date to ensure consistent test results
  const NOW = new Date("2025-07-18T12:00:00.000Z");

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should format seconds ago", () => {
    const date = new Date("2025-07-18T11:59:30.000Z"); // 30 seconds ago

    const { result } = renderHook(() => useRelativeTime());
    const format = result.current;

    expect(format(date)).toBe("30 seconds ago");
  });

  it("should format minutes ago", () => {
    const date = new Date("2025-07-18T11:55:00.000Z"); // 5 minutes ago

    const { result } = renderHook(() => useRelativeTime());
    const format = result.current;

    expect(format(date)).toBe("5 minutes ago");
  });

  it("should format hours ago", () => {
    const date = new Date("2025-07-18T09:00:00.000Z"); // 3 hours ago

    const { result } = renderHook(() => useRelativeTime());
    const format = result.current;

    expect(format(date)).toBe("3 hours ago");
  });

  it("should format days ago", () => {
    const date = new Date("2025-07-16T12:00:00.000Z"); // 2 days ago

    const { result } = renderHook(() => useRelativeTime());
    const format = result.current;

    expect(format(date)).toBe("2 days ago");
  });

  it("should format weeks ago", () => {
    const date = new Date("2025-07-04T12:00:00.000Z"); // 2 weeks ago

    const { result } = renderHook(() => useRelativeTime());
    const format = result.current;

    expect(format(date)).toBe("2 weeks ago");
  });

  it("should format months ago", () => {
    const date = new Date("2025-05-20T12:00:00.000Z"); // 2 months ago

    const { result } = renderHook(() => useRelativeTime());
    const format = result.current;

    expect(format(date)).toBe("2 months ago");
  });

  it("should format years ago", () => {
    const date = new Date("2024-07-18T12:00:00.000Z"); // 1 year ago

    const { result } = renderHook(() => useRelativeTime());
    const format = result.current;

    expect(format(date)).toBe("last year");
  });

  it("should format future dates", () => {
    const date = new Date("2025-07-19T12:00:00.000Z"); // 1 day in future

    const { result } = renderHook(() => useRelativeTime());
    const format = result.current;

    expect(format(date)).toBe("tomorrow");
  });

  it("should handle string date input", () => {
    const date = "2025-07-17T12:00:00.000Z"; // 1 day ago

    const { result } = renderHook(() => useRelativeTime());
    const format = result.current;

    expect(format(date)).toBe("yesterday");
  });
});
