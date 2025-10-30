import { type ComponentType } from "react";

import {
  ErrorBoundary,
  type ErrorBoundaryProps,
  type ErrorFallback,
} from "@/lib/components/ErrorBoundary/ErrorBoundary";
import type { AjaxError } from "@/lib/http/AjaxError";

export const withErrorBoundary =
  <TProps extends object>(
    fallback?: ErrorFallback<AjaxError>,
    errorBoundaryProps?: Omit<
      ErrorBoundaryProps<AjaxError>,
      "children" | "fallback"
    >
  ) =>
  (Component: ComponentType<TProps>) => {
    // eslint-disable-next-line react/display-name
    return (props: TProps) => (
      <ErrorBoundary fallback={fallback} {...errorBoundaryProps}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
