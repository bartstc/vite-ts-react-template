import { InfoIcon as ChInfoIcon } from "@chakra-ui/icons";
import { useColorModeValue } from "@chakra-ui/react";

const InfoIcon = () => {
  const color = useColorModeValue("blue.500", "blue.300");

  return <ChInfoIcon boxSize={16} color={color} />;
};

export { InfoIcon };
