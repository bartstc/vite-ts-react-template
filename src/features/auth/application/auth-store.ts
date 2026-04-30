import { createContext, useContext } from "react";
import { createStore, useStore } from "zustand";

import { IS_AUTHENTICATED_STORAGE } from "@/features/auth/models/storage-keys";
import type { User } from "@/features/auth/models/user";
import { getUser } from "@/features/auth/providers/get-user";
import { AUTH_TOKEN_KEY } from "@/lib/http/ky-client";

import { loginUser, type ICredentials } from "../providers/login-user";

// could be also https://www.npmjs.com/package/zustand-persist lib for advanced use cases
const isLoggedIn = () =>
  localStorage.getItem(IS_AUTHENTICATED_STORAGE) === "true";

interface IStore {
  isAuthenticated: boolean;
  isError: boolean;
  state: "idle" | "loading" | "finished";
  user: User;
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
      user: undefined as unknown as User,
      ...preloadedState,
      login: async (credentials: ICredentials) => {
        set({ state: "loading" });

        try {
          const token = await loginUser(credentials);
          localStorage.setItem(AUTH_TOKEN_KEY, token);
          const user = await getUser();

          localStorage.setItem(IS_AUTHENTICATED_STORAGE, "true");

          set({
            isAuthenticated: true,
            state: "finished",
            user,
          });
        } catch (e) {
          localStorage.setItem(IS_AUTHENTICATED_STORAGE, "false");

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
          localStorage.setItem(IS_AUTHENTICATED_STORAGE, "false");
          localStorage.removeItem(AUTH_TOKEN_KEY);
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
