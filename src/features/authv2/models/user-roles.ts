export enum Permission {
  Read = "read",
  Write = "write",
  Edit = "edit",
}

export enum Role {
  Reader = "reader",
  Editor = "editor",
  Manager = "manager",
}

export interface UserRoles {
  role: Role;
  permissions: Permission[];
}
