import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAuthStore } from "./authStore";

const RequirePub = ({ children, to }: { children: ReactNode; to: string }) => {
  const isAuthenticated = useAuthStore((store) => store.isAuthenticated);

  return isAuthenticated ? <Navigate to={to} /> : <>{children}</>;
};

export { RequirePub };
