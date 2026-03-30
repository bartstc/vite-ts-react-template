import { ChakraProvider } from "@chakra-ui/react";
import type { ReactNode } from "react";

import { Toaster } from "@/lib/components/Toast/Toaster";
import { system } from "@/lib/theme/theme";

import { ColorModeProvider } from "./ColorModeProvider";
import type { ColorModeProviderProps } from "./ColorModeProvider";

interface ProviderProps extends Pick<ColorModeProviderProps, "forcedTheme"> {
  children: ReactNode;
}

export function DesignProvider({ children, ...props }: ProviderProps) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider {...props}>
        <Toaster />
        {children}
      </ColorModeProvider>
    </ChakraProvider>
  );
}
