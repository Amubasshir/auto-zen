import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "@/hooks/useDebounce";

jest.useFakeTimers();

describe("useDebounce", () => {
  afterEach(() => jest.clearAllTimers());

  it("returns the initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("hello", 500));
    expect(result.current).toBe("hello");
  });

  it("does not update before the delay elapses", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: "initial" } },
    );
    rerender({ value: "updated" });
    act(() => jest.advanceTimersByTime(300));
    expect(result.current).toBe("initial");
  });

  it("updates after the delay elapses", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: "initial" } },
    );
    rerender({ value: "updated" });
    act(() => jest.advanceTimersByTime(500));
    expect(result.current).toBe("updated");
  });

  it("resets the timer on each value change", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: "a" } },
    );
    rerender({ value: "b" });
    act(() => jest.advanceTimersByTime(300));
    rerender({ value: "c" });
    act(() => jest.advanceTimersByTime(300));
    // 600ms total but timer was reset at 300ms, so only 300ms since last change
    expect(result.current).toBe("a");
    act(() => jest.advanceTimersByTime(200));
    expect(result.current).toBe("c");
  });

  it("works with number values", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 200),
      { initialProps: { value: 1 } },
    );
    rerender({ value: 42 });
    act(() => jest.advanceTimersByTime(200));
    expect(result.current).toBe(42);
  });
});
