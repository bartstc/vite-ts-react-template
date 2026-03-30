import { Box } from "@chakra-ui/react";
import { TriangleAlert } from "lucide-react";

import { useColorModeValue } from "@/lib/theme/use-color-mode";

const ErrorIcon = () => {
  const color = useColorModeValue("red.500", "red.300");

  return (
    <Box color={color}>
      <TriangleAlert size={64} />
    </Box>
  );
};

export { ErrorIcon };
