import { useColorModeValue } from "@/lib/theme/use-color-mode";

export const useSecondaryTextColor = () => {
  return useColorModeValue("gray.500", "gray.300");
};
