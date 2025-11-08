import { useSelector } from "@xstate/react";
import { createContext, useContext } from "react";
import type { ActorRefFrom, SnapshotFrom } from "xstate";

import type { AuthMachineType } from "@/features/authv2/application/auth-machine";

export const AuthContext = createContext<ActorRefFrom<AuthMachineType>>(
  {} as ActorRefFrom<AuthMachineType>
);

export function useAuthSelector<T>(
  selector: (snapshot: SnapshotFrom<AuthMachineType>) => T
) {
  const actor = useContext(AuthContext);

  if (!actor) throw new Error("AuthContext is missing the provider");

  return useSelector(actor, selector);
}

export function useAuthSend() {
  const actor = useContext(AuthContext);

  if (!actor) throw new Error("AuthContext is missing the provider");

  return actor.send;
}

export function useAuthContext() {
  const actor = useContext(AuthContext);

  if (!actor) throw new Error("AuthContext is missing the provider");

  return actor;
}
