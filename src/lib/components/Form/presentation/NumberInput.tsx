import { Input, type InputProps } from "@chakra-ui/react";
import { forwardRef } from "react";

// AIDEV-NOTE: Install react-number-format v5 (NumericFormat) if live formatting is needed.
export type NumberInputProps = Omit<InputProps, "type">;

const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  function NumberInput(props, ref) {
    return (
      <Input
        type="number"
        step="any"
        min={0}
        placeholder="0"
        fontSize="sm"
        ref={ref}
        {...props}
      />
    );
  }
);

export { NumberInput };
