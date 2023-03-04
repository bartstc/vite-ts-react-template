import { IUser } from "modules/auth/types";

export interface IUserDto extends IUser {
  password: string;
}
