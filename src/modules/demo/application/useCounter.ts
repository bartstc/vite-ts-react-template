import { useState, useCallback } from "react";

const useCounter = () => {
  const [count, setCount] = useState(0);

  const increment = useCallback(() => setCount((x) => x + 1), []);

  return { count, increment };
};

export { useCounter };
