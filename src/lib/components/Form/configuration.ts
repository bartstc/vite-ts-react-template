import { useCallback, useMemo, useState } from "react";

export type ConfigurationSelector = (
  configuration: Configuration
) => Partial<Configuration>;

export interface Configuration {
  size: "sm" | "md";
  variant: "outline" | "flushed" | "subtle";
  autoValidation: boolean;
  keepHiddenFieldValue?: boolean;
}

export const useConfiguration = (configuration?: Partial<Configuration>) => {
  const [store, setStore] = useState<Configuration>({
    size: configuration?.size ?? "md",
    variant: configuration?.variant ?? "outline",
    autoValidation: configuration?.autoValidation ?? true,
    keepHiddenFieldValue: configuration?.keepHiddenFieldValue ?? true,
  });
  const setConfiguration = useCallback(
    (configuration: ConfigurationSelector | Partial<Configuration>) => {
      if (typeof configuration === "function") {
        return setStore((state) => {
          return { ...state, ...configuration(state) };
        });
      }

      return setStore((state) => {
        return { ...state, ...configuration };
      });
    },
    []
  );

  return useMemo(
    () => [store, setConfiguration] as const,
    [setConfiguration, store]
  );
};
