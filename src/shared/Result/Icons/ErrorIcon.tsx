import { WarningIcon } from "@chakra-ui/icons";
import { useColorModeValue } from "@chakra-ui/react";

const ErrorIcon = () => {
  const color = useColorModeValue("red.500", "red.300");

  return <WarningIcon boxSize={16} color={color} />;
};

export { ErrorIcon };
