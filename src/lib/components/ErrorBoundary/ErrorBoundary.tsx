import type { ComponentType, ErrorInfo, PropsWithChildren } from "react";
import type { ErrorBoundaryPropsWithComponent } from "react-error-boundary";
import { ErrorBoundary as Boundary } from "react-error-boundary";

import { ErrorPageStrategy } from "@/lib/components/Result/ErrorPageStrategy";
import { AjaxError } from "@/lib/http/ajax-error";
import { Logger } from "@/lib/logger";

export interface FallbackProps<ErrorType = Error | AjaxError> {
  error: ErrorType;
  resetErrorBoundary: () => void;
}

export type ErrorFallback<ErrorType = Error | AjaxError> = ComponentType<
  FallbackProps<ErrorType>
>;

interface BoundaryProps<ErrorType = Error | AjaxError> {
  onReset?: ErrorBoundaryPropsWithComponent["onReset"];
  onError?: (error: ErrorType, info: ErrorInfo) => void;
  resetKeys?: ErrorBoundaryPropsWithComponent["resetKeys"];
  fallback?: ErrorFallback<ErrorType>;
}

export type ErrorBoundaryProps<ErrorType = Error | AjaxError> =
  PropsWithChildren<BoundaryProps<ErrorType>>;

export function ErrorBoundary<
  ErrorType extends Error | AjaxError = Error | AjaxError,
>({ fallback, children, onError, ...props }: ErrorBoundaryProps<ErrorType>) {
  const FallbackComponent = (fallback ?? ErrorPageStrategy) as ComponentType<{
    error: unknown;
    resetErrorBoundary: () => void;
  }>;

  return (
    <Boundary
      FallbackComponent={FallbackComponent}
      onError={(error, info) => {
        if (error instanceof Error || error instanceof AjaxError) {
          onError?.(error as ErrorType, info);

          Logger.error(error.message, {
            type: "error-boundary",
            message: error.message,
          });
        }
      }}
      {...props}
    >
      {children}
    </Boundary>
  );
}
