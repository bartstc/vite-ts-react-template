import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { DesignProvider } from "@/app/design/DesignProvider";
import { AuthProvider } from "@/features/auth/application/AuthProvider";
import { queryClient } from "@/lib/query";

interface IProps {
  children: ReactNode;
}

const Providers = ({ children }: IProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <DesignProvider>
        <AuthProvider>{children}</AuthProvider>
      </DesignProvider>
    </QueryClientProvider>
  );
};

export { Providers };
