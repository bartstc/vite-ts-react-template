import { type FieldValues } from "react-hook-form";
import { createContext, useContextSelector } from "use-context-selector";

import { type Configuration } from "./configuration";
import { type UseFormMethods } from "./use-form";

export type Selector<Fields extends FieldValues, Selected> = (
  state: UseFormMethods<Fields>
) => Selected;

type FormContextValue = UseFormMethods<FieldValues>;

export const FormContext = createContext<FormContextValue | null>(null);

export const useFormContextSelector = <
  Selected,
  Fields extends FieldValues = FieldValues,
>(
  selector: Selector<Fields, Selected>
): Selected =>
  useContextSelector(FormContext, (ctx) => {
    if (!ctx)
      throw new Error(
        "useFormContextSelector must be used within FormProvider"
      );
    return selector(ctx as UseFormMethods<Fields>);
  });

export const useConfigurationValue = <K extends keyof Configuration>(
  name: K
): Configuration[K] => {
  return useFormContextSelector((state) => state.configuration[name]);
};

export const useConfigurationSetter = () => {
  return useFormContextSelector((state) => state.setConfiguration);
};
