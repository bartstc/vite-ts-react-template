/* eslint-disable import/no-restricted-paths */
import { useAuthorizedContextSelector } from "@/features/authv2/application/use-authorized-context-selector";
import type { Permission } from "@/features/authv2/types/UserRoles";

export const useHasAllPermissions = (permissions: Permission[]) => {
  const availablePermissions = useAuthorizedContextSelector(
    (context) => context.roles.permissions
  );

  if (!permissions.length) return false;

  return permissions.every((permission) =>
    availablePermissions?.some((p) => p === permission)
  );
};
