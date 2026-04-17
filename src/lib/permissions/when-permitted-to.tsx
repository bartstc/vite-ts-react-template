import type { ComponentType } from "react";

// eslint-disable-next-line import/no-restricted-paths
import type { Permission } from "@/features/authv2/models/permissions";
import { useHasPermission } from "@/lib/permissions/use-has-permission";

interface WhenPermittedToFn {
  <P extends object>(
    permission: Permission,
    Fallback?: ComponentType
  ): (Component: ComponentType<P>) => ComponentType<P>;
  oneOf: <P extends object>(
    permissions: Permission[],
    Fallback?: ComponentType
  ) => (Component: ComponentType<P>) => ComponentType<P>;
  all: <P extends object>(
    permissions: Permission[],
    Fallback?: ComponentType
  ) => (Component: ComponentType<P>) => ComponentType<P>;
}

const whenPermittedToBase = <P extends object>(
  permission: Permission,
  Fallback?: ComponentType
) => {
  return (Component: ComponentType<P>): ComponentType<P> => {
    const WrapperComponent = (props: P) => {
      const hasPermission = useHasPermission(permission);

      if (!hasPermission) {
        return Fallback ? <Fallback /> : null;
      }

      return <Component {...props} />;
    };
    return WrapperComponent;
  };
};

const whenPermittedToOneOf = <P extends object>(
  permissions: Permission[],
  Fallback?: ComponentType
) => {
  return (Component: ComponentType<P>): ComponentType<P> => {
    const WrapperComponent = (props: P) => {
      const hasPermission = useHasPermission({ permissions, match: "oneOf" });

      if (!hasPermission) {
        return Fallback ? <Fallback /> : null;
      }

      return <Component {...props} />;
    };
    return WrapperComponent;
  };
};

const whenPermittedToAll = <P extends object>(
  permissions: Permission[],
  Fallback?: ComponentType
) => {
  return (Component: ComponentType<P>): ComponentType<P> => {
    const WrapperComponent = (props: P) => {
      const hasPermission = useHasPermission({ permissions, match: "all" });

      if (!hasPermission) {
        return Fallback ? <Fallback /> : null;
      }

      return <Component {...props} />;
    };
    return WrapperComponent;
  };
};

export const whenPermittedTo = Object.assign(whenPermittedToBase, {
  oneOf: whenPermittedToOneOf,
  all: whenPermittedToAll,
}) satisfies WhenPermittedToFn;
