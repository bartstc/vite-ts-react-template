import type { Permission } from "@/features/authv2/models/permissions";

export enum Role {
  Reader = "reader",
  Editor = "editor",
  Manager = "manager",
}

export interface UserRoles {
  role: Role;
  permissions: Permission[];
}
