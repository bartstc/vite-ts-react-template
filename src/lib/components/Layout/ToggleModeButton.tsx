import { IconButton, type IconButtonProps } from "@chakra-ui/react";
import { Moon, Sun } from "lucide-react";

import { useColorMode } from "@/lib/theme/use-color-mode";

const ToggleModeButton = (
  props: Omit<IconButtonProps, "aria-label" | "onClick" | "variant">
) => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <IconButton
      aria-label="Switch mode"
      onClick={toggleColorMode}
      variant="ghost"
      {...props}
    >
      {colorMode === "light" ? <Moon /> : <Sun />}
    </IconButton>
  );
};

export { ToggleModeButton };
