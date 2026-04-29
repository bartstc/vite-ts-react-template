import { Input } from "@chakra-ui/react";
import { useController } from "react-hook-form";

import { toKebabCase } from "@/lib/to-kebab-case";

import { useConfigurationValue, useFormContextSelector } from "../form-context";
import { FormField, type FormFieldProps } from "../presentation/FormField";

import { type BasicFieldProps } from "./types";
import { useErrorMessage } from "./use-error-message";

export interface TextInputProps extends BasicFieldProps, FormFieldProps {
  placeholder?: string;
  isDisabled?: boolean;
  type?: string;
  autofocus?: boolean;
}

const TextInput = ({
  register: registerProp,
  placeholder,
  isDisabled,
  type,
  autofocus,
  ...props
}: TextInputProps) => {
  const control = useFormContextSelector((state) => state.control);
  const error = useErrorMessage(props.name);
  const size = useConfigurationValue("size");
  const variant = useConfigurationValue("variant");
  const autoValidation = useConfigurationValue("autoValidation");

  const { field } = useController({
    name: props.name,
    control,
    rules: {
      required: {
        value: (autoValidation && props.isRequired) ?? false,
        message: "Field is required",
      },
      ...registerProp,
    },
  });

  return (
    <FormField
      {...props}
      size={size}
      label={props.children ?? props.label}
      isInvalid={!!error}
      errorMessage={error}
    >
      <Input
        value={field.value as string}
        id={String(toKebabCase(props.name))}
        onChange={field.onChange}
        onBlur={field.onBlur}
        type={type}
        placeholder={placeholder}
        size={size}
        variant={variant}
        fontSize="sm"
        disabled={isDisabled}
        autoFocus={autofocus}
        _placeholder={{ color: "gray.500" }}
      />
    </FormField>
  );
};

export { TextInput };
