import { Progress } from "@chakra-ui/react";

import { useNavigation } from "@/lib/router";

const LoaderBar = () => {
  const { state } = useNavigation();

  if (state === "loading") {
    return (
      <Progress.Root size="xs" colorPalette="orange" value={null}>
        <Progress.Track>
          <Progress.Range />
        </Progress.Track>
      </Progress.Root>
    );
  }

  return null;
};

export { LoaderBar };
