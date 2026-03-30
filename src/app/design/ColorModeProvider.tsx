import { ThemeProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

export type ColorModeProviderProps = ThemeProviderProps;

export function ColorModeProvider({
  children,
  ...props
}: ColorModeProviderProps) {
  return (
    <ThemeProvider attribute="class" disableTransitionOnChange {...props}>
      {children}
    </ThemeProvider>
  );
}
