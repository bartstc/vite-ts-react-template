import { useColorModeValue } from "@chakra-ui/react";

export const useSecondaryTextColor = () => {
  return useColorModeValue("gray.500", "gray.300");
};
