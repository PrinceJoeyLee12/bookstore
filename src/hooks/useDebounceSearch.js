import { useCallback } from 'react';

export const useDebounceSearch = () => {
  let timeoutId;
  const debounceSearch = useCallback((func, value, delay = 1200) => {
    return function () {
      clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        func(value);
      }, delay);
    };
  }, []);

  const clearTimeoutFunc = () => clearTimeout(timeoutId);

  return {
    timeoutId,
    debounceSearch,
    clearTimeoutFunc,
  };
};
