import type { User } from "@/features/auth/models/user";
import { UserFixture } from "@/test-lib/fixtures/user-fixture";

export interface TestCredentials {
  user: User;
  password: string;
}

export const ValidUserCredentials: TestCredentials = {
  user: UserFixture.createPermutation({ username: "bob" }),
  password: "Pa$$w0rd",
};

export const InvalidUserCredentials: TestCredentials = {
  user: UserFixture.createPermutation({ username: "wronguser" }),
  password: "wrongpassword",
};
