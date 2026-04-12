import { Input, InputGroup } from "@chakra-ui/react";
import { forwardRef } from "react";

import { type NumberInputProps } from "./NumberInput";

// CurrencyInput renders a number input with an optional right-side currency symbol slot.
export interface CurrencyInputProps extends NumberInputProps {
  symbol?: string;
}

const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  function CurrencyInput({ symbol, ...props }, ref) {
    return (
      <InputGroup endElement={symbol ?? undefined}>
        <Input
          type="number"
          step="any"
          min={0}
          placeholder="0"
          fontSize="sm"
          ref={ref}
          {...props}
        />
      </InputGroup>
    );
  }
);

export { CurrencyInput };
