import { omit } from "ramda";

import { httpService } from "@/lib/http";

import type { UserDto } from "./user-dto";

export type User = Omit<UserDto, "password">;

export const getUser = () => {
  return httpService
    .get<UserDto>("users/1")
    .then((res) => omit(["password"], res) as User);
};
