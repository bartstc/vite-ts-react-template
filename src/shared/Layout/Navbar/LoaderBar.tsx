import { useNavigation } from "react-router-dom";

import { Progress } from "@chakra-ui/react";

const LoaderBar = () => {
  const { state } = useNavigation();

  if (state === "loading") {
    return <Progress size="xs" colorScheme="orange" isIndeterminate />;
  }

  return null;
};

export { LoaderBar };
