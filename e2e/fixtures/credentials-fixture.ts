import type { IUser } from "@/features/auth/types/IUser";
import { UserFixture } from "@/test-lib/fixtures/UserFixture";

// AIDEV-NOTE: Reuses UserFixture from @/test-lib for domain data, adds E2E-specific password field
export interface TestCredentials {
  user: IUser;
  password: string;
}

export const ValidUserCredentials: TestCredentials = {
  user: UserFixture.createPermutation({ username: "mor_2314" }),
  password: "83r5^_",
};

export const InvalidUserCredentials: TestCredentials = {
  user: UserFixture.createPermutation({ username: "wronguser" }),
  password: "wrongpassword",
};
