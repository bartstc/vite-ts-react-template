import { omit } from "lodash-es";

import { httpService } from "utils";

import { IUser } from "../types";
import { IUserDto } from "./types/IUserDto";

export const getUser = () => {
  // mocking current user and its cartId by passing id=1
  return httpService
    .get<IUserDto>("users/1")
    .then((res) => ({ ...(omit(res, "password") as IUser), cartId: 1 }));
};
