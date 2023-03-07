import { CheckCircleIcon } from "@chakra-ui/icons";
import { useColorModeValue } from "@chakra-ui/react";

const SuccessIcon = () => {
  const color = useColorModeValue("green.500", "green.300");

  return <CheckCircleIcon boxSize={16} color={color} />;
};

export { SuccessIcon };
