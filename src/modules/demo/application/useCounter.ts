import { useState, useCallback } from "react";

import { Logger } from "utils/logger";

const useCounter = () => {
  const [count, setCount] = useState(0);

  const increment = useCallback(() => {
    Logger.info("Debugging useCounter hook", { value: count });
    setCount((x) => x + 1);
  }, [count]);

  return { count, increment };
};

export { useCounter };
