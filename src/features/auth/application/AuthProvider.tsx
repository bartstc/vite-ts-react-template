import { type PropsWithChildren, useRef } from "react";

import { type AuthStore, initializeAuthStore, Provider } from "./auth-store";

const AuthProvider = ({ children, ...props }: PropsWithChildren) => {
  const storeRef = useRef<AuthStore>(null);

  storeRef.current ??= initializeAuthStore(props);

  // AIDEV-NOTE: Lazy ref init — React's documented way to build an expensive
  // store exactly once. Reading it during render is the point of the pattern;
  // react-hooks/refs cannot distinguish it from a mutable render-time read.
  // eslint-disable-next-line react-hooks/refs
  return <Provider value={storeRef.current}>{children}</Provider>;
};

export { AuthProvider };
