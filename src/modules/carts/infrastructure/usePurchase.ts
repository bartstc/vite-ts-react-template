import { useState } from "react";

// todo: use msw to mock this feature
export const usePurchase = () => {
  const [isLoading, setIsLoading] = useState(false);

  const purchase = async () => {
    return new Promise<void>((resolve) => {
      setIsLoading(true);
      setTimeout(() => {
        resolve();
        setIsLoading(false);
      }, 400);
    });
  };

  return [purchase, isLoading] as const;
};
