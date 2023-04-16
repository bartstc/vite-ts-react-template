import { type PropsWithChildren, useRef } from "react";

import { type AuthStore, initializeAuthStore, Provider } from "./authStore";

const AuthProvider = ({ children, ...props }: PropsWithChildren) => {
  const storeRef = useRef<AuthStore>();

  if (!storeRef.current) {
    storeRef.current = initializeAuthStore(props);
  }

  return <Provider value={storeRef.current}>{children}</Provider>;
};

export { AuthProvider };
