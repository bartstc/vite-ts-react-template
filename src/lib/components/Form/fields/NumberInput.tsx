import { type ChangeEvent } from "react";
import { useController } from "react-hook-form";

import { toKebabCase } from "@/lib/to-kebab-case";

import { useConfigurationValue } from "../configuration";
import { useFormContextSelector } from "../form-context";
import { FormField, type FormFieldProps } from "../presentation/FormField";
import { NumberInput as NumberInputPresentation } from "../presentation/NumberInput";

import { type BasicFieldProps } from "./types";
import { useErrorMessage } from "./use-error-message";

export interface NumberInputProps extends BasicFieldProps, FormFieldProps {
  isDisabled?: boolean;
  placeholder?: string;
}

const NumberInput = ({
  register,
  defaultValue,
  isDisabled,
  placeholder,
  ...props
}: NumberInputProps) => {
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
      <NumberInputPresentation
        value={(field.value as number | string | null | undefined) ?? ""}
        id={String(toKebabCase(props.name))}
        onChange={handleChange}
        onBlur={field.onBlur}
        ref={field.ref}
        disabled={isDisabled}
        placeholder={placeholder}
      />
    </FormField>
  );
};

export { NumberInput };
