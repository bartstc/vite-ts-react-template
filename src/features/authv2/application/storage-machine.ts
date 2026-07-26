/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { assign, fromPromise, setup } from "xstate";

import { IS_AUTHENTICATED_STORAGE } from "@/features/auth/models/storage-keys";

interface StorageMachineContext {
  isAuthenticated: boolean;
}

type StorageMachineEvents =
  { type: "SET_AUTHENTICATED"; value: boolean } | { type: "CLEAR" };

export type StorageMachineType = typeof storageMachine;

const checkAuthStatus = fromPromise(() => {
  return Promise.resolve(
    localStorage.getItem(IS_AUTHENTICATED_STORAGE) === "true"
  );
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
        localStorage.setItem(IS_AUTHENTICATED_STORAGE, String(event.value));
      }
    },
    clearAuthStorage: () => {
      localStorage.setItem(IS_AUTHENTICATED_STORAGE, "false");
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
