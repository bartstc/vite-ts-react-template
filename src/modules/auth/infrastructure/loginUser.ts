import { httpService } from "utils";

export interface ICredentials {
  username: string;
  password: string;
}

export const loginUser = (body: ICredentials) => {
  return httpService.post<string>("auth/login", body);
};
