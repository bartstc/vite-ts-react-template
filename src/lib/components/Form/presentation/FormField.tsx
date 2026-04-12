import { Field, type GridItemProps, HStack } from "@chakra-ui/react";
import { Info } from "lucide-react";
import { type ReactElement, type ReactNode } from "react";

import { Tooltip } from "@/lib/components/Tooltip/Tooltip";
import { toKebabCase } from "@/lib/to-kebab-case";

import { mapGridProps } from "../map-grid-props";

export interface FormFieldProps extends Omit<GridItemProps, "defaultValue"> {
  name: string;
  isRequired?: boolean;
  isInvalid?: boolean;
  label?: ReactElement | string;
  errorMessage?: ReactNode;
  helperText?: ReactNode;
  children?: ReactElement | string;
  tip?: ReactElement | string;
  size?: "sm" | "md";
  defaultValue?: string | number | null | undefined;
}

const FormField = (props: FormFieldProps) => {
  const {
    colSpan,
    colStart,
    colEnd,
    rowEnd,
    rowSpan,
    rowStart,
    size = "md",
    name,
    isRequired,
    isInvalid,
    label,
    errorMessage,
    helperText,
    children,
    tip,
  } = props;

  const gridStyles = mapGridProps({
    colSpan,
    rowStart,
    rowSpan,
    colEnd,
    colStart,
    rowEnd,
  });

  return (
    <Field.Root
      required={isRequired}
      invalid={isInvalid}
      css={gridStyles}
      width="auto"
    >
      <HStack gap={0}>
        <Field.Label htmlFor={String(toKebabCase(name))} fontSize="sm">
          {label}
        </Field.Label>
        {tip && (
          <Tooltip content={tip}>
            <Info size={size === "sm" ? 16 : 20} />
          </Tooltip>
        )}
      </HStack>
      {children}
      <Field.ErrorText fontSize="sm">{errorMessage}</Field.ErrorText>
      {helperText && (
        <Field.HelperText fontSize="sm">{helperText}</Field.HelperText>
      )}
    </Field.Root>
  );
};

export { FormField };
