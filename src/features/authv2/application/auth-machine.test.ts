import { describe, it, expect, vi } from "vitest";
import { createActor, fromPromise } from "xstate";

import { Permission, Role } from "@/features/authv2/types/UserRoles";
import { sleep } from "@/lib/sleep";
import type { OneOfUnion } from "@/lib/types/one-of-union";
import { UserFixture } from "@/test-lib/fixtures/UserFixture";

import { authMachine, type AuthMachineContext } from "./auth-machine";

const mockUser = UserFixture.toStructure();

const mockRoles = {
  role: Role.Manager,
  permissions: [Permission.Read, Permission.Write, Permission.Edit],
};

const mockCredentials = {
  username: "test@example.com",
  password: "password123",
};

describe("auth-machine", () => {
  describe("Happy path", () => {
    it("should complete full auth flow from start to finish: checkingIfUserIsLoggedIn → fetchingUser → fetchingRoles → authorized", async () => {
      const checkAuthStatusMock = vi.fn(() => Promise.resolve(true));
      const getUserMock = vi.fn(async () => {
        await sleep(0);
        return Promise.resolve(mockUser);
      });
      const getRolesMock = vi.fn(async () => {
        await sleep(50);
        return Promise.resolve(mockRoles);
      });

      const actor = createActor(
        authMachine.provide({
          actors: {
            checkAuthStatus: fromPromise(checkAuthStatusMock),
            getUser: fromPromise(getUserMock),
            getRoles: fromPromise(getRolesMock),
          },
        })
      );

      actor.start();

      await expect.poll(() => actor.getSnapshot().value).toBe("fetchingUser");
      expect(checkAuthStatusMock).toHaveBeenCalled();

      await expect.poll(() => actor.getSnapshot().value).toBe("fetchingRoles");
      expect(getUserMock).toHaveBeenCalled();

      await expect.poll(() => actor.getSnapshot().value).toBe("authorized");
      expect(getRolesMock).toHaveBeenCalled();

      const context = actor.getSnapshot().context as OneOfUnion<
        AuthMachineContext,
        "AUTHORIZED"
      >;
      expect(context.type).toBe("AUTHORIZED");
      expect(context.user).toEqual(mockUser);
      expect(context.roles).toEqual(mockRoles);
    });

    it("should start in unauthenticated state when checkAuthStatus returns false", async () => {
      const checkAuthStatusMock = vi.fn(() => Promise.resolve(false));

      const actor = createActor(
        authMachine.provide({
          actors: {
            checkAuthStatus: fromPromise(checkAuthStatusMock),
          },
        })
      );

      actor.start();

      await expect
        .poll(() => actor.getSnapshot().value)
        .toBe("unauthenticated");
      expect(checkAuthStatusMock).toHaveBeenCalled();
    });
  });

  describe("checkingIfUserIsLoggedIn errors", () => {
    it("should transition to unauthenticated on error", async () => {
      const checkAuthStatusMock = vi.fn(() =>
        Promise.reject(new Error("Storage error"))
      );

      const actor = createActor(
        authMachine.provide({
          actors: {
            // @ts-expect-error - mocking the Error
            checkAuthStatus: fromPromise(checkAuthStatusMock),
          },
        })
      );

      actor.start();

      await expect
        .poll(() => actor.getSnapshot().value)
        .toBe("unauthenticated");
    });
  });

  describe("fetchingUser errors", () => {
    it("should transition to unauthenticated on error", async () => {
      const checkAuthStatusMock = vi.fn(() => Promise.resolve(true));
      const getUserMock = vi.fn(() =>
        Promise.reject(new Error("User not found"))
      );

      const actor = createActor(
        authMachine.provide({
          actors: {
            checkAuthStatus: fromPromise(checkAuthStatusMock),
            // @ts-expect-error - mocking the Error
            getUser: fromPromise(getUserMock),
          },
        })
      );

      actor.start();

      await expect
        .poll(() => actor.getSnapshot().value)
        .toBe("unauthenticated");
    });
  });

  describe("fetchingRoles errors", () => {
    it("should transition to unauthenticated on error", async () => {
      const checkAuthStatusMock = vi.fn(() => Promise.resolve(true));
      const getUserMock = vi.fn(() => Promise.resolve(mockUser));
      const getRolesMock = vi.fn(() => Promise.reject(new Error("No roles")));

      const actor = createActor(
        authMachine.provide({
          actors: {
            checkAuthStatus: fromPromise(checkAuthStatusMock),
            getUser: fromPromise(getUserMock),
            // @ts-expect-error - mocking the Error
            getRoles: fromPromise(getRolesMock),
          },
        })
      );

      actor.start();

      await expect
        .poll(() => actor.getSnapshot().value)
        .toBe("unauthenticated");
    });
  });

  describe("Login flow", () => {
    it("should complete login flow: loggingIn → fetchingUser → fetchingRoles → authorized", async () => {
      const checkAuthStatusMock = vi.fn(() => Promise.resolve(false));
      const loginUserMock = vi.fn(async () => {
        await sleep(50);
        return Promise.resolve();
      });
      const getUserMock = vi.fn(async () => {
        await sleep(50);
        return Promise.resolve(mockUser);
      });
      const getRolesMock = vi.fn(async () => {
        await sleep(50);
        return Promise.resolve(mockRoles);
      });

      const actor = createActor(
        authMachine.provide({
          actors: {
            checkAuthStatus: fromPromise(checkAuthStatusMock),
            loginUser: fromPromise(loginUserMock),
            getUser: fromPromise(getUserMock),
            getRoles: fromPromise(getRolesMock),
          },
        })
      );

      actor.start();

      await expect
        .poll(() => actor.getSnapshot().value)
        .toBe("unauthenticated");

      actor.send({ type: "LOGGED_IN", credentials: mockCredentials });

      await expect.poll(() => actor.getSnapshot().value).toBe("loggingIn");

      await expect.poll(() => actor.getSnapshot().value).toBe("fetchingUser");
      expect(loginUserMock).toHaveBeenCalledWith(
        expect.objectContaining({ input: mockCredentials })
      );

      await expect.poll(() => actor.getSnapshot().value).toBe("fetchingRoles");

      await expect.poll(() => actor.getSnapshot().value).toBe("authorized");
    });

    it("should transition back to unauthenticated if login fails", async () => {
      const checkAuthStatusMock = vi.fn(() => Promise.resolve(false));
      const loginUserMock = vi.fn(() =>
        Promise.reject(new Error("Invalid credentials"))
      );

      const actor = createActor(
        authMachine.provide({
          actors: {
            checkAuthStatus: fromPromise(checkAuthStatusMock),
            // @ts-expect-error - mocking the Error
            loginUser: fromPromise(loginUserMock),
          },
        })
      );

      actor.start();

      await expect
        .poll(() => actor.getSnapshot().value)
        .toBe("unauthenticated");

      actor.send({ type: "LOGGED_IN", credentials: mockCredentials });

      await expect
        .poll(() => actor.getSnapshot().value)
        .toBe("unauthenticated");
      expect(loginUserMock).toHaveBeenCalled();
    });
  });

  describe("Logout flow", () => {
    it("should transition to loggingOut then unauthenticated on LOGGED_OUT event", async () => {
      const checkAuthStatusMock = vi.fn(() => Promise.resolve(true));
      const getUserMock = vi.fn(() => Promise.resolve(mockUser));
      const getRolesMock = vi.fn(() => Promise.resolve(mockRoles));
      const logoutMock = vi.fn(async () => {
        await sleep(50);
        return Promise.resolve();
      });

      const actor = createActor(
        authMachine.provide({
          actors: {
            checkAuthStatus: fromPromise(checkAuthStatusMock),
            getUser: fromPromise(getUserMock),
            getRoles: fromPromise(getRolesMock),
            logout: fromPromise(logoutMock),
          },
        })
      );

      actor.start();

      await expect.poll(() => actor.getSnapshot().value).toBe("authorized");

      actor.send({ type: "LOGGED_OUT" });

      await expect.poll(() => actor.getSnapshot().value).toBe("loggingOut");

      await expect
        .poll(() => actor.getSnapshot().value)
        .toBe("unauthenticated");
      expect(logoutMock).toHaveBeenCalled();

      const context = actor.getSnapshot().context as OneOfUnion<
        AuthMachineContext,
        "UNAUTHORIZED"
      >;
      expect(context.type).toBe("UNAUTHORIZED");
    });

    it("should transition to unauthenticated even if logout fails", async () => {
      const checkAuthStatusMock = vi.fn(() => Promise.resolve(true));
      const getUserMock = vi.fn(() => Promise.resolve(mockUser));
      const getRolesMock = vi.fn(() => Promise.resolve(mockRoles));
      const logoutMock = vi.fn(() =>
        Promise.reject(new Error("Logout failed"))
      );

      const actor = createActor(
        authMachine.provide({
          actors: {
            checkAuthStatus: fromPromise(checkAuthStatusMock),
            getUser: fromPromise(getUserMock),
            getRoles: fromPromise(getRolesMock),
            // @ts-expect-error - mocking the Error
            logout: fromPromise(logoutMock),
          },
        })
      );

      actor.start();

      await expect.poll(() => actor.getSnapshot().value).toBe("authorized");

      actor.send({ type: "LOGGED_OUT" });

      await expect
        .poll(() => actor.getSnapshot().value)
        .toBe("unauthenticated");
    });
  });

  describe("Context transitions", () => {
    it("should update context correctly through all states", async () => {
      const checkAuthStatusMock = vi.fn(() => Promise.resolve(true));
      const getUserMock = vi.fn(async () => {
        await sleep(50);
        return Promise.resolve(mockUser);
      });
      const getRolesMock = vi.fn(async () => {
        await sleep(50);
        return Promise.resolve(mockRoles);
      });

      const actor = createActor(
        authMachine.provide({
          actors: {
            checkAuthStatus: fromPromise(checkAuthStatusMock),
            getUser: fromPromise(getUserMock),
            getRoles: fromPromise(getRolesMock),
          },
        })
      );

      actor.start();

      // Initial context
      expect(actor.getSnapshot().context.type).toBe("UNAUTHORIZED");

      await expect.poll(() => actor.getSnapshot().value).toBe("fetchingUser");

      // After fetching user
      await expect.poll(() => actor.getSnapshot().value).toBe("fetchingRoles");
      const authenticatedContext = actor.getSnapshot().context as OneOfUnion<
        AuthMachineContext,
        "AUTHENTICATED"
      >;
      expect(authenticatedContext.type).toBe("AUTHENTICATED");
      expect(authenticatedContext.user).toEqual(mockUser);

      // After fetching roles
      await expect.poll(() => actor.getSnapshot().value).toBe("authorized");
      const authorizedContext = actor.getSnapshot().context as OneOfUnion<
        AuthMachineContext,
        "AUTHORIZED"
      >;
      expect(authorizedContext.type).toBe("AUTHORIZED");
      expect(authorizedContext.user).toEqual(mockUser);
      expect(authorizedContext.roles).toEqual(mockRoles);
    });
  });
});
