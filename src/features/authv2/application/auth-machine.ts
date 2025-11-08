import { assign, emit, setup, type PromiseActorLogic } from "xstate";

import type { ICredentials } from "@/features/auth/infrastructure/loginUser";
import type { IUser } from "@/features/auth/types/IUser";
import type { UserRoles } from "@/features/authv2/types/UserRoles";
import type { OneOfUnion } from "@/lib/types/one-of-union";

export type AuthMachineContext =
  | {
      type: "UNAUTHORIZED";
    }
  | {
      type: "AUTHENTICATED";
      user: IUser;
    }
  | {
      type: "ROLES_ASSIGNED";
      user: IUser;
      roles: UserRoles;
    }
  | {
      type: "AUTHORIZED";
      user: IUser;
      roles: UserRoles;
    };

export type AuthenticatedContext = OneOfUnion<
  AuthMachineContext,
  "AUTHENTICATED"
>;
export type RolesAssignedContext = OneOfUnion<
  AuthMachineContext,
  "ROLES_ASSIGNED"
>;
export type AuthorizedContext = OneOfUnion<AuthMachineContext, "AUTHORIZED">;

type AuthMachineEvents =
  | { type: "LOGGED_IN"; credentials: ICredentials }
  | { type: "LOGGED_OUT" };

export type AuthMachineEmittedEvents =
  | {
      type: "USER_LOGGED_IN";
      user: IUser;
    }
  | {
      type: "USER_LOGGED_OUT";
    }
  | {
      type: "ROLES_FETCHED";
      roles: UserRoles;
    };

export interface AuthMachineActors {
  checkAuthStatus: PromiseActorLogic<boolean, void>;
  getUser: PromiseActorLogic<IUser, void>;
  loginUser: PromiseActorLogic<void, ICredentials>;
  getRoles: PromiseActorLogic<UserRoles, void>;
  logout: PromiseActorLogic<void, void>;
}

export type AuthMachineType = typeof authMachine;

export const authMachine = setup({
  types: {} as {
    context: AuthMachineContext;
    events: AuthMachineEvents;
    emitted: AuthMachineEmittedEvents;
  },
  actors: { ...({} as AuthMachineActors) },
}).createMachine({
  id: "auth",
  initial: "checkingIfUserIsLoggedIn",
  context: {
    type: "UNAUTHORIZED",
  },
  states: {
    checkingIfUserIsLoggedIn: {
      tags: ["loading"],
      invoke: {
        src: "checkAuthStatus",
        onDone: [
          {
            guard: ({ event }) => event.output === true,
            target: "fetchingUser",
          },
          {
            target: "unauthenticated",
          },
        ],
        onError: {
          target: "unauthenticated",
        },
      },
    },
    fetchingUser: {
      tags: ["loading"],
      invoke: {
        src: "getUser",
        onDone: {
          target: "fetchingRoles",
          actions: [
            assign(({ event }) => ({
              type: "AUTHENTICATED",
              user: event.output,
            })),
            emit(({ event }) => ({
              type: "USER_LOGGED_IN",
              user: event.output,
            })),
          ],
        },
        onError: {
          target: "unauthenticated",
        },
      },
    },
    fetchingRoles: {
      tags: ["loading"],
      invoke: {
        src: "getRoles",
        onDone: {
          target: "authorized",
          actions: [
            assign(({ event }) => ({
              type: "ROLES_ASSIGNED",
              roles: event.output,
            })),
            emit(({ event }) => ({
              type: "ROLES_FETCHED",
              roles: event.output,
            })),
          ],
        },
        onError: {
          target: "unauthenticated",
        },
      },
    },
    authorized: {
      tags: ["authorized"],
      entry: [
        assign({
          type: "AUTHORIZED",
        }),
      ],
      on: {
        LOGGED_OUT: {
          target: "loggingOut",
        },
      },
    },
    unauthenticated: {
      entry: assign({
        type: "UNAUTHORIZED",
      }),
      on: {
        LOGGED_IN: {
          target: "loggingIn",
        },
      },
    },
    loggingIn: {
      tags: ["loading"],
      invoke: {
        src: "loginUser",
        input: ({ event }) => {
          if (event.type === "LOGGED_IN") {
            return event.credentials;
          }
          throw new Error("Invalid event type");
        },
        onDone: {
          target: "fetchingUser",
        },
        onError: {
          target: "unauthenticated",
        },
      },
    },
    loggingOut: {
      tags: ["loading"],
      invoke: {
        src: "logout",
        onDone: {
          target: "unauthenticated",
          actions: emit({
            type: "USER_LOGGED_OUT",
          }),
        },
        onError: {
          target: "unauthenticated",
        },
      },
    },
  },
});
