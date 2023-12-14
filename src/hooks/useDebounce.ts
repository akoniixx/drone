import React, {useEffect} from 'react';

export const useDebounce = (value: any, delay: number) => {
  const [debounceValue, setDebounceValue] = React.useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debounceValue;
};
