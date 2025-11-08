import { useContext } from "react";

import { AuthContext } from "@/features/authv2/application/auth-context";
import type {
  AuthMachineContext,
  AuthorizedContext,
} from "@/features/authv2/application/auth-machine";
import { useUnionContextSelector } from "@/lib/machine/union-context-selector";

export const useAuthorizedContextSelector = <T>(
  contextSelector: (emitted: AuthorizedContext) => T
) => {
  const authActor = useContext(AuthContext);

  return useUnionContextSelector<T, AuthorizedContext, AuthMachineContext>(
    authActor,
    "AUTHORIZED",
    (state) => contextSelector(state.context)
  );
};
