/* eslint-disable @typescript-eslint/no-explicit-any */
import { curry, apply } from "ramda";

type DebounceFunction = (...args: any[]) => void;

/**
 * Debounce
 *
 * @param {Boolean} immediate If true run `fn` at the start of the timeout
 * @param  timeMs {Number} Debounce timeout
 * @param  fn {Function} Function to debounce
 *
 * @return {Number} timeout
 * @example
 *
 *		const say = (x) => console.log(x)
 *		const debouncedSay = debounce_(false, 1000, say)();
 *
 *		debouncedSay("1")
 *		debouncedSay("2")
 *		debouncedSay("3")
 *
 */

const debounce_ = curry(
  (immediate: boolean, timeMs: number, fn: DebounceFunction) => () => {
    let timeout: NodeJS.Timeout | null;

    return (...args: any[]) => {
      const later = () => {
        timeout = null;

        if (!immediate) {
          apply(fn, args);
        }
      };

      const callNow = immediate && !timeout;

      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(later, timeMs);

      if (callNow) {
        apply(fn, args);
      }

      return timeout;
    };
  }
);

export const debounceImmediate = debounce_(true);
export const debounce = debounce_(false);
