import { createContext, useContext } from "react";

import { createStore, useStore } from "zustand";

import { getUser, loginUser } from "../infrastructure";
import { ICredentials } from "../infrastructure/loginUser";
import { IUser } from "../types";

const AUTH_KEY = "fake_store_is_authenticated";

// could be also https://www.npmjs.com/package/zustand-persist lib for advanced use cases
const isLoggedIn = () => localStorage.getItem(AUTH_KEY) === "true";

interface IStore {
  isAuthenticated: boolean;
  isError: boolean;
  state: "idle" | "loading" | "finished";
  user: IUser;
  login: (credentials: ICredentials) => Promise<void>;
  logout: () => Promise<void>;
}

export type AuthStore = ReturnType<typeof initializeAuthStore>;

const zustandContext = createContext<AuthStore | null>(null);

export const Provider = zustandContext.Provider;

export const useAuthStore = <T>(selector: (state: IStore) => T) => {
  const store = useContext(zustandContext);

  if (!store) throw new Error("AuthStore is missing the provider");

  return useStore(store, selector);
};

export const initializeAuthStore = (preloadedState: Partial<IStore> = {}) => {
  return createStore<IStore>((set) => {
    if (isLoggedIn()) {
      set({ state: "loading" });

      getUser()
        .then((user) => {
          set({
            user,
            isAuthenticated: true,
            state: "finished",
          });
        })
        .catch(() => {
          set({
            isError: true,
            state: "finished",
          });
        });
    } else {
      set({ state: "finished" });
    }

    return {
      isAuthenticated: false,
      isError: false,
      state: isLoggedIn() ? "idle" : "finished",
      user: undefined as unknown as IUser,
      ...preloadedState,
      login: async (credentials: ICredentials) => {
        set({ state: "loading" });

        try {
          await loginUser(credentials);
          const user = await getUser();

          localStorage.setItem(AUTH_KEY, "true");

          set({
            isAuthenticated: true,
            state: "finished",
            user,
          });
        } catch (e) {
          localStorage.setItem(AUTH_KEY, "false");

          set({
            isAuthenticated: false,
            state: "finished",
            user: undefined,
          });

          throw e;
        }
      },
      logout: async () => {
        set({
          state: "loading",
        });

        return new Promise((resolve) => setTimeout(resolve, 500)).then(() => {
          localStorage.setItem(AUTH_KEY, "false");
          set({
            isAuthenticated: false,
            state: "finished",
            user: undefined,
          });
        });
      },
    };
  });
};
