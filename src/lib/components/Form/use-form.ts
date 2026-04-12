import { useRef } from "react";
import {
  useForm as useRHForm,
  type FieldValues,
  type UseFormReturn as UseRHFormReturn,
  type UseFormProps as UseRHFormProps,
} from "react-hook-form";

import {
  type Configuration,
  type ConfigurationSelector,
  useConfiguration,
} from "./configuration";

export interface UseFormOptions<
  TFieldValues extends FieldValues = FieldValues,
  TContext = unknown,
> extends UseRHFormProps<TFieldValues, TContext> {
  configuration?: Partial<Configuration>;
}

export interface UseFormMethods<
  TFieldValues extends FieldValues = FieldValues,
> extends UseRHFormReturn<TFieldValues> {
  id: string;
  configuration: Configuration;

  setConfiguration(
    configuration: ConfigurationSelector | Partial<Configuration>
  ): void;
}

export const useForm = <
  TFieldValues extends FieldValues = FieldValues,
  TContext = unknown,
>(
  options?: UseFormOptions<TFieldValues, TContext>
): UseFormMethods<TFieldValues> => {
  const id = useRef(generateId());
  const form = useRHForm({
    mode: "onChange",
    ...options,
  });
  const [configuration, setConfiguration] = useConfiguration(
    options?.configuration
  );

  return {
    id: id.current,
    ...form,
    configuration,
    setConfiguration,
  };
};

const generateId = (): string => {
  return "_" + Math.random().toString(36).substr(2, 9);
};
