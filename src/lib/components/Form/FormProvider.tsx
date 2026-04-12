import { type ReactNode } from "react";
import { type FieldValues } from "react-hook-form";

import { FormContext } from "./form-context";
import { type UseFormMethods } from "./use-form";

type FormContextValue = UseFormMethods<FieldValues>;

type FormProviderProps<TFieldValues extends FieldValues> =
  UseFormMethods<TFieldValues> & { children: ReactNode };

export const FormProvider = <TFieldValues extends FieldValues>({
  children,
  ...props
}: FormProviderProps<TFieldValues>) => (
  <FormContext.Provider value={props as FormContextValue}>
    {children}
  </FormContext.Provider>
);
