import { type ChangeEvent } from "react";
import { useController } from "react-hook-form";

import { toKebabCase } from "@/lib/to-kebab-case";

import { useConfigurationValue } from "../configuration";
import { useFormContextSelector } from "../form-context";
import { CurrencyInput as CurrencyInputPresentation } from "../presentation/CurrencyInput";
import { FormField, type FormFieldProps } from "../presentation/FormField";

import { type BasicFieldProps } from "./types";
import { useErrorMessage } from "./use-error-message";

export interface MoneyInputProps extends BasicFieldProps, FormFieldProps {
  isDisabled?: boolean;
  symbol?: string;
}

const MoneyInput = ({
  register,
  defaultValue,
  isDisabled,
  symbol,
  ...props
}: MoneyInputProps) => {
  const control = useFormContextSelector((state) => state.control);
  const autoValidation = useConfigurationValue("autoValidation");
  const error = useErrorMessage(props.name);

  const { field } = useController({
    name: props.name,
    control,
    defaultValue,
    rules: {
      required: {
        value: (autoValidation && props.isRequired) ?? false,
        message: "Field is required",
      },
      ...register,
    },
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    field.onChange(raw === "" ? null : Number(raw));
  };

  return (
    <FormField
      label={props.children ?? props.label}
      isInvalid={!!error}
      errorMessage={error}
      {...props}
    >
      <CurrencyInputPresentation
        value={(field.value as number | string | null | undefined) ?? ""}
        id={String(toKebabCase(props.name))}
        onChange={handleChange}
        onBlur={field.onBlur}
        ref={field.ref}
        disabled={isDisabled}
        symbol={symbol}
      />
    </FormField>
  );
};

export { MoneyInput };
