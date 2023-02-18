import React from "react";

import { SunIcon, MoonIcon } from "@chakra-ui/icons";
import { IconButton, useColorMode, IconButtonProps } from "@chakra-ui/react";

const ToggleModeButton = (
  props: Omit<IconButtonProps, "aria-label" | "onClick" | "variant" | "icon">
) => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <IconButton
      aria-label="Switch mode"
      onClick={toggleColorMode}
      variant="ghost"
      icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
      {...props}
    />
  );
};

export { ToggleModeButton };
