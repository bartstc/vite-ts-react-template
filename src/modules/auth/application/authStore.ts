import { create } from "zustand";

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

export const useAuthStore = create<IStore>((set, get) => {
  if (isLoggedIn()) {
    if (process.env.STORYBOOK) return get();

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
    user: null as unknown as IUser,
    login: async (credentials: ICredentials) => {
      set({ state: "loading" });

      return loginUser(credentials)
        .then(() => {
          localStorage.setItem(AUTH_KEY, "true");
          set({
            isAuthenticated: true,
            state: "finished",
          });
        })
        .catch((e) => {
          localStorage.setItem(AUTH_KEY, "false");
          set({
            isAuthenticated: false,
            state: "finished",
          });
          throw e;
        });
    },
    logout: async () => {
      set({
        state: "loading",
      });

      return Promise.resolve().then(() => {
        localStorage.setItem(AUTH_KEY, "false");
        set({
          isAuthenticated: false,
          state: "finished",
        });
      });
    },
  };
});
