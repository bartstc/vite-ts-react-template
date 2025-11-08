/* eslint-disable no-console */
import { useActorRef, useSelector } from "@xstate/react";
import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import { fromPromise } from "xstate";

import { getUser } from "@/features/auth/infrastructure/getUser";
import { loginUser } from "@/features/auth/infrastructure/loginUser";
import { AuthContext } from "@/features/authv2/application/auth-context";
import {
  authMachine,
  type AuthMachineActors,
  type AuthMachineEmittedEvents,
} from "@/features/authv2/application/auth-machine";
import { getRoles } from "@/features/authv2/infrastructure/getRoles";
import { sleep } from "@/lib/sleep";

const AUTH_KEY = "fake_store_is_authenticated";

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const checkAuthStatus = () => {
    return Promise.resolve(localStorage.getItem(AUTH_KEY) === "true");
  };

  const logout = async () => {
    await sleep(500);
    localStorage.setItem(AUTH_KEY, "false");
  };

  const authActor = useActorRef(
    authMachine.provide({
      actors: {
        checkAuthStatus: fromPromise(checkAuthStatus),
        getUser: fromPromise(getUser),
        loginUser: fromPromise(async ({ input }) => {
          await loginUser(input);
          localStorage.setItem(AUTH_KEY, "true");
        }),
        getRoles: fromPromise(getRoles),
        logout: fromPromise(logout),
      } satisfies AuthMachineActors,
    })
  );

  const isLoading = useSelector(authActor, (state) => state.hasTag("loading"));

  // Subscribe to emitted events for logging/observability
  useEffect(() => {
    const subscription = authActor.on("*", (event) => {
      const emittedEvent = event as AuthMachineEmittedEvents;

      switch (emittedEvent.type) {
        case "USER_LOGGED_IN":
          console.info("🎉 User logged in:", emittedEvent.user);
          break;
        case "USER_LOGGED_OUT":
          console.info("👋 User logged out");
          break;
        case "ROLES_FETCHED":
          console.info("🔐 Roles fetched:", emittedEvent.roles);
          break;
      }
    });

    return subscription.unsubscribe;
  }, [authActor]);

  if (isLoading) {
    return <div>{"Loading authentication..."}</div>;
  }

  return (
    <AuthContext.Provider value={authActor}>{children}</AuthContext.Provider>
  );
};
