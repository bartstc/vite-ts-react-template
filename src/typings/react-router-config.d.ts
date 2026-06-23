// eslint-disable-next-line no-restricted-imports
import type {
  NavigateOptions as RRNavigateOptions,
  Location as RRLocation,
  To,
} from "react-router";

declare module "react-router" {
  interface NavigateState {
    [key: string]: unknown;
    from?: string;
  }

  interface LocationWithState extends Omit<RRLocation, "state"> {
    state?: NavigateState;
  }

  interface NavigateOptions extends Omit<RRNavigateOptions, "state"> {
    state?: NavigateState;
  }

  interface NavigateFunction {
    (to: To, options?: NavigateOptions): void | Promise<void>;
    (delta: number): void | Promise<void>;
  }

  function useLocation(): LocationWithState;
  function useNavigate(): NavigateFunction;
}
