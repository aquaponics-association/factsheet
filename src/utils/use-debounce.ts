import React, { useEffect } from "react";

/**
 * Allowing debounce of a particular input or action
 * using React Hooks
 *
 * @param {string} value The value of the input strnig
 * @param {number} delay The debounce interval
 * @return {string} The final value
 */
export default function useDebounce(
  value: string | undefined,
  delay: number
): string | undefined {
  const [debouncedValue, setDebouncedValue] = React.useState<
    string | undefined
  >(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
