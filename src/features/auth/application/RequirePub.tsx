import type { ReactNode } from "react";

import { Navigate } from "@/lib/router";

import { useAuthStore } from "./auth-store";

export interface RequirePubProps {
  children: ReactNode;
  to?: string;
}

const RequirePub = ({ children, to }: RequirePubProps) => {
  const isAuthenticated = useAuthStore((store) => store.isAuthenticated);

  return isAuthenticated ? <Navigate to={to ?? "/"} /> : <>{children}</>;
};

export { RequirePub };
