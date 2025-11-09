/* eslint-disable import/no-restricted-paths */
import { useAuthorizedContextSelector } from "@/features/authv2/application/use-authorized-context-selector";
import type { Permission } from "@/features/authv2/types/UserRoles";

export const useHasPermission = (permission: Permission | Permission[]) => {
  const availablePermissions = useAuthorizedContextSelector(
    (context) => context.roles.permissions
  );

  if (Array.isArray(permission)) {
    return permission.some((perm) =>
      availablePermissions?.some((p) => p === perm)
    );
  }

  return !!availablePermissions?.find((p) => p === permission);
};
