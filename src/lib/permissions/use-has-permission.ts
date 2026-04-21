/* eslint-disable boundaries/dependencies */
import { useAuthorizedContextSelector } from "@/features/authv2/application/use-authorized-context-selector";
import type { Permission } from "@/features/authv2/models/permissions";

type PermissionQuery =
  | Permission
  | { permissions: Permission[]; match?: "all" | "oneOf" };

export const useHasPermission = (query: PermissionQuery): boolean => {
  const availablePermissions = useAuthorizedContextSelector(
    (context) => context.roles.permissions
  );

  if (typeof query === "string") {
    return !!availablePermissions?.some((p) => p === query);
  }

  const { permissions, match = "all" } = query;

  if (!permissions.length) return false;

  if (match === "oneOf") {
    return permissions.some((perm) =>
      availablePermissions?.some((p) => p === perm)
    );
  }

  return permissions.every((perm) =>
    availablePermissions?.some((p) => p === perm)
  );
};
