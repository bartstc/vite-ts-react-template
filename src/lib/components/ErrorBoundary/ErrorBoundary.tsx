import type { ComponentType, ErrorInfo, PropsWithChildren } from "react";
import type {
  FallbackProps as BoundaryFallbackProps,
  ErrorBoundaryPropsWithComponent,
} from "react-error-boundary";
import { ErrorBoundary as Boundary } from "react-error-boundary";

import { ErrorPageStrategy } from "@/lib/components/Result/ErrorPageStrategy";
import type { AjaxError } from "@/lib/http/AjaxError";
import { Logger } from "@/lib/logger";

export interface FallbackProps<ErrorType> {
  error: ErrorType | Error;
  resetErrorBoundary: BoundaryFallbackProps["resetErrorBoundary"];
}

export type ErrorFallback<ErrorType> = ComponentType<FallbackProps<ErrorType>>;

interface BoundaryProps<ErrorType> {
  onReset?: ErrorBoundaryPropsWithComponent["onReset"];
  onError?: (error: ErrorType | Error, info: ErrorInfo) => void;
  resetKeys?: ErrorBoundaryPropsWithComponent["resetKeys"];
  fallback?: ErrorFallback<ErrorType>;
}

export type ErrorBoundaryProps<ErrorType> = PropsWithChildren<
  BoundaryProps<ErrorType>
>;

// todo: story
export function ErrorBoundary<ErrorType extends AjaxError | Error = AjaxError>({
  fallback,
  children,
  ...props
}: ErrorBoundaryProps<ErrorType>) {
  return (
    <Boundary
      FallbackComponent={fallback ?? ErrorPageStrategy}
      onError={(error) => {
        Logger.error(error.message, {
          type: "error-boundary",
          message: error.message,
        });
      }}
      {...props}
    >
      {children}
    </Boundary>
  );
}
