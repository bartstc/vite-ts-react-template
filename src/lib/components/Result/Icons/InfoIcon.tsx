import { Box } from "@chakra-ui/react";
import { Info } from "lucide-react";

import { useColorModeValue } from "@/lib/theme/use-color-mode";

const InfoIcon = () => {
  const color = useColorModeValue("blue.500", "blue.300");

  return (
    <Box color={color}>
      <Info size={64} />
    </Box>
  );
};

export { InfoIcon };
