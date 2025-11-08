import {
  Permission,
  Role,
  type UserRoles,
} from "@/features/authv2/types/UserRoles";
import { sleep } from "@/lib/sleep";

export async function getRoles(): Promise<UserRoles> {
  await sleep(500);

  return {
    role: Role.Manager,
    permissions: [Permission.Read, Permission.Write, Permission.Edit],
  };
}
