import { memo } from "react";
import { useController } from "react-hook-form";

import { toKebabCase } from "@/lib/to-kebab-case";

import { useConfigurationValue, useFormContextSelector } from "../form-context";
import { FormField, type FormFieldProps } from "../presentation/FormField";
import {
  SelectInput as PresentationSelect,
  type SelectProps as PresentationSelectProps,
  type OptionType,
} from "../presentation/SelectInput";

import { type BasicFieldProps } from "./types";
import { useErrorMessage } from "./use-error-message";
import { propsAreEqual } from "./utils";

export type { OptionType };

export interface SelectInputProps<Value = string>
  extends BasicFieldProps, Omit<FormFieldProps, "defaultValue"> {
  options: OptionType<Value>[];
  placeholder?: string;
  isMulti?: boolean;
  isClearable?: boolean;
  isLoading?: boolean;
  defaultValue?: Value;
  isDisabled?: boolean;
  noOptionsMessage?: PresentationSelectProps<Value>["noOptionsMessage"];
  loadingMessage?: PresentationSelectProps<Value>["loadingMessage"];
}

function SelectInput<Value extends string | number = string>({
  register,
  placeholder,
  options,
  isMulti,
  isClearable,
  isLoading,
  defaultValue,
  isDisabled,
  noOptionsMessage,
  loadingMessage,
  ...props
}: SelectInputProps<Value>) {
  const autoValidation = useConfigurationValue("autoValidation");
  const control = useFormContextSelector((state) => state.control);
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

  return (
    <FormField
      {...props}
      label={props.children ?? props.label}
      isInvalid={!!error}
      errorMessage={error}
    >
      <PresentationSelect<Value>
        name={props.name}
        inputId={String(toKebabCase(props.name))}
        options={options}
        isMulti={isMulti}
        isInvalid={!!error}
        value={field.value as Value | Value[] | null}
        onChange={(val) => field.onChange(val)}
        isClearable={isClearable ?? !props.isRequired}
        onBlur={field.onBlur}
        placeholder={placeholder}
        isLoading={isLoading}
        inputRef={field.ref}
        isDisabled={isDisabled}
        noOptionsMessage={noOptionsMessage}
        loadingMessage={loadingMessage}
      />
    </FormField>
  );
}

const MemoSelectInput = memo(SelectInput, propsAreEqual) as typeof SelectInput;

export { MemoSelectInput as SelectInput };
