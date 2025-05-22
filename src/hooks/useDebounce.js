import { useState, useEffect } from 'react';

/**
 * A custom hook to debounce a value, delaying updates until after a specified time has passed.
 * @param {string} value - The value to debounce
 * @param {number} delay - The debounce delay in milliseconds
 * @returns {string} The debounced value
 */
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set up a timer to update the debounced value after the specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timer if the value or delay changes before the delay completes
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}