import { type ComponentType, Suspense, type SuspenseProps } from "react";

export const withSuspense =
  <TProps extends object>(fallback?: SuspenseProps["fallback"]) =>
  (Component: ComponentType<TProps>) => {
    // eslint-disable-next-line react/display-name
    return (props: TProps) => (
      <Suspense fallback={fallback}>
        <Component {...props} />
      </Suspense>
    );
  };
