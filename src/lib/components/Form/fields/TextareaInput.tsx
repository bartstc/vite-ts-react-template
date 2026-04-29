import { Textarea } from "@chakra-ui/react";
import { useController } from "react-hook-form";

import { toKebabCase } from "@/lib/to-kebab-case";

import { useConfigurationValue, useFormContextSelector } from "../form-context";
import { FormField } from "../presentation/FormField";

import { type TextInputProps } from "./TextInput";
import { useErrorMessage } from "./use-error-message";

export type TextareaInputProps = TextInputProps;

const TextareaInput = ({
  register: registerProp,
  placeholder,
  defaultValue,
  ...props
}: TextareaInputProps) => {
  const autoValidation = useConfigurationValue("autoValidation");
  const control = useFormContextSelector((state) => state.control);
  const error = useErrorMessage(props.name);

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
      label={props.children ?? props.label}
      isInvalid={!!error}
      errorMessage={error}
    >
      <Textarea
        value={field.value as string}
        id={String(toKebabCase(props.name))}
        onChange={field.onChange}
        onBlur={field.onBlur}
        placeholder={placeholder}
        fontSize="sm"
        defaultValue={defaultValue ?? undefined}
        _placeholder={{ color: "gray.500" }}
      />
    </FormField>
  );
};

export { TextareaInput };
