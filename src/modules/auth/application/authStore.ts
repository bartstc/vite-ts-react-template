import { create } from "zustand";

import { getUser, loginUser } from "../infrastructure";
import { ICredentials } from "../infrastructure/loginUser";
import { IUser } from "../types";

const AUTH_KEY = "fake_store_is_authenticated";

// could be also https://www.npmjs.com/package/zustand-persist lib for advanced use cases
const isLoggedIn = () => localStorage.getItem(AUTH_KEY) === "true";

interface IStore {
  isAuthenticated: boolean;
  isLoading: boolean;
  isError: boolean;
  user: IUser;
  login: (credentials: ICredentials) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<IStore>((set) => {
  //   const auth = JSON.parse(localStorage.getItem("auth"))

  if (isLoggedIn()) {
    getUser()
      .then((user) => {
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      })
      .catch(() => {
        set({
          isError: true,
          isLoading: false,
        });
      });
  } else {
    set({
      isLoading: false,
    });
  }

  return {
    isAuthenticated: false,
    isLoading: true,
    isError: false,
    user: null as unknown as IUser,
    login: async (credentials: ICredentials) => {
      set({
        isLoading: true,
      });

      return loginUser(credentials).then(() => {
        localStorage.setItem(AUTH_KEY, "true");
        set({
          isAuthenticated: true,
          isLoading: false,
        });
      });
    },
    logout: async () => {
      set({
        isLoading: true,
      });

      return Promise.resolve().then(() => {
        localStorage.setItem(AUTH_KEY, "false");
        set({
          isAuthenticated: false,
          isLoading: false,
        });
      });
    },
  };
});
