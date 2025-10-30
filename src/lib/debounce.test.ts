import { describe, it, expect, vi, beforeEach } from "vitest";

import { debounce, debounceImmediate } from "./debounce";

describe("debounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("should debounce a function", () => {
    const func = vi.fn();
    const debouncedFunc = debounce(100, func)();

    debouncedFunc();
    debouncedFunc();
    debouncedFunc();

    expect(func).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);

    expect(func).toHaveBeenCalledTimes(1);
  });

  it("should pass arguments to the debounced function", () => {
    const func = vi.fn();
    const debouncedFunc = debounce(100, func)();

    debouncedFunc("arg1", "arg2");

    vi.advanceTimersByTime(100);

    expect(func).toHaveBeenCalledWith("arg1", "arg2");
  });

  it("should handle multiple calls correctly", () => {
    const func = vi.fn();
    const debouncedFunc = debounce(100, func)();

    debouncedFunc();
    vi.advanceTimersByTime(50);
    debouncedFunc();
    vi.advanceTimersByTime(50);
    debouncedFunc();

    vi.advanceTimersByTime(100);

    expect(func).toHaveBeenCalledTimes(1);
  });

  it("should call the function immediately if immediate is true", () => {
    const func = vi.fn();
    const debouncedFunc = debounceImmediate(100, func)();

    debouncedFunc();

    expect(func).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(100);

    expect(func).toHaveBeenCalledTimes(1);
  });

  it("should reset the timer if called again before timeout", () => {
    const func = vi.fn();
    const debouncedFunc = debounce(100, func)();

    debouncedFunc();
    vi.advanceTimersByTime(50);
    debouncedFunc();
    vi.advanceTimersByTime(50);
    debouncedFunc();

    vi.advanceTimersByTime(100);

    expect(func).toHaveBeenCalledTimes(1);
  });

  it("should handle immediate calls correctly", () => {
    const func = vi.fn();
    const debouncedFunc = debounceImmediate(100, func)();

    debouncedFunc();
    debouncedFunc();
    debouncedFunc();

    expect(func).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(100);

    expect(func).toHaveBeenCalledTimes(1);
  });
});
