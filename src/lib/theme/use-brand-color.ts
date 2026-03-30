import { useColorModeValue } from "@/lib/theme/use-color-mode";

export const useBrandColor = () => {
  return useColorModeValue("orange.400", "orange.300");
};
