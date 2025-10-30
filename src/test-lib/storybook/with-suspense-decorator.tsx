import type { Decorator } from "@storybook/react-vite";
import { Suspense, type SuspenseProps } from "react";

export function withSuspenseDecorator(props?: SuspenseProps) {
  const Decorator: Decorator = (Story) => (
    <Suspense fallback={<div>{"loading ..."}</div>} {...props}>
      <Story />
    </Suspense>
  );

  return Decorator;
}
