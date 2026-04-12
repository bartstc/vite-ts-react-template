import { Portal, Tooltip as ChakraTooltip } from "@chakra-ui/react";
import { type ReactNode, forwardRef } from "react";

export interface TooltipProps extends ChakraTooltip.RootProps {
  content: ReactNode;
  showArrow?: boolean;
  portalled?: boolean;
}

const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(function Tooltip(
  { content, showArrow, portalled = true, children, ...rest },
  ref
) {
  return (
    <ChakraTooltip.Root {...rest}>
      <ChakraTooltip.Trigger asChild>{children}</ChakraTooltip.Trigger>
      <Portal disabled={!portalled}>
        <ChakraTooltip.Positioner>
          <ChakraTooltip.Content ref={ref}>
            {showArrow && (
              <ChakraTooltip.Arrow>
                <ChakraTooltip.ArrowTip />
              </ChakraTooltip.Arrow>
            )}
            {content}
          </ChakraTooltip.Content>
        </ChakraTooltip.Positioner>
      </Portal>
    </ChakraTooltip.Root>
  );
});

export { Tooltip };
