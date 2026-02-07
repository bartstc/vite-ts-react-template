import type { ReactNode } from "react";

import { Navigate } from "@/lib/router";

import { useAuthStore } from "./auth-store";

export interface RequireAuthProps {
  children: ReactNode;
  to?: string;
}

const RequireAuth = ({ children, to }: RequireAuthProps) => {
  const isAuthenticated = useAuthStore((store) => store.isAuthenticated);

  return isAuthenticated ? <>{children}</> : <Navigate to={to ?? "/"} />;
};

export { RequireAuth };
