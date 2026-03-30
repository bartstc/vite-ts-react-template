import { Box } from "@chakra-ui/react";
import { AlertCircle } from "lucide-react";

import { useColorModeValue } from "@/lib/theme/use-color-mode";

const WarningIcon = () => {
  const color = useColorModeValue("orange.400", "orange.300");

  return (
    <Box color={color}>
      <AlertCircle size={64} />
    </Box>
  );
};

export { WarningIcon };
