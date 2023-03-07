import { WarningTwoIcon } from "@chakra-ui/icons";
import { useColorModeValue } from "@chakra-ui/react";

const WarningIcon = () => {
  const color = useColorModeValue("orange.400", "orange.300");

  return <WarningTwoIcon boxSize={16} color={color} />;
};

export { WarningIcon };
