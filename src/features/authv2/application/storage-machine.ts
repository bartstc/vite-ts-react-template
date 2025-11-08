import { assign, fromPromise, setup } from "xstate";

const AUTH_KEY = "fake_store_is_authenticated";

interface StorageMachineContext {
  isAuthenticated: boolean;
}

type StorageMachineEvents =
  | { type: "SET_AUTHENTICATED"; value: boolean }
  | { type: "CLEAR" };

export type StorageMachineType = typeof storageMachine;

const checkAuthStatus = fromPromise(() => {
  return Promise.resolve(localStorage.getItem(AUTH_KEY) === "true");
});

export const storageMachine = setup({
  types: {} as {
    context: StorageMachineContext;
    events: StorageMachineEvents;
  },
  actors: {
    checkAuthStatus,
  },
  actions: {
    setAuthStorage: ({ event }) => {
      if (event.type === "SET_AUTHENTICATED") {
        localStorage.setItem(AUTH_KEY, String(event.value));
      }
    },
    clearAuthStorage: () => {
      localStorage.setItem(AUTH_KEY, "false");
    },
  },
}).createMachine({
  id: "storage",
  initial: "checking",
  context: {
    isAuthenticated: false,
  },
  states: {
    checking: {
      invoke: {
        src: "checkAuthStatus",
        onDone: {
          target: "ready",
          actions: assign({
            isAuthenticated: ({ event }) => event.output,
          }),
        },
        onError: {
          target: "ready",
          actions: assign({
            isAuthenticated: false,
          }),
        },
      },
    },
    ready: {
      on: {
        SET_AUTHENTICATED: {
          actions: [
            "setAuthStorage",
            assign({
              isAuthenticated: ({ event }) => event.value,
            }),
          ],
        },
        CLEAR: {
          actions: [
            "clearAuthStorage",
            assign({
              isAuthenticated: false,
            }),
          ],
        },
      },
    },
  },
});
