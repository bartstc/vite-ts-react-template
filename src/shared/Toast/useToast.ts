import { useToast as chUseToast, UseToastOptions } from "@chakra-ui/react";

const defaultOptions: UseToastOptions = {
  duration: 5000,
  isClosable: true,
};

export const useToast = () => {
  const toast = chUseToast();

  return (options: UseToastOptions) => {
    toast({
      ...defaultOptions,
      ...options,
    });
  };
};
