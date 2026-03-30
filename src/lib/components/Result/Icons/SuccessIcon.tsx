import { Box } from "@chakra-ui/react";
import { CheckCircle } from "lucide-react";

import { useColorModeValue } from "@/lib/theme/use-color-mode";

const SuccessIcon = () => {
  const color = useColorModeValue("green.500", "green.300");

  return (
    <Box color={color}>
      <CheckCircle size={64} />
    </Box>
  );
};

export { SuccessIcon };
