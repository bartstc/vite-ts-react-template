import { useColorModeValue } from "@chakra-ui/react";

export const useBrandColor = () => {
  return useColorModeValue("orange.400", "orange.300");
};
