import { ReactNode } from "react";

import {
  RadioGroup as ChakraRadioGroup,
  Stack,
  RadioGroupProps,
  StackProps,
} from "@chakra-ui/react";

interface IProps extends RadioGroupProps {
  children: ReactNode;
  direction?: StackProps["direction"];
}

const RadioGroup = ({ direction = "column", children, ...props }: IProps) => {
  return (
    <ChakraRadioGroup {...props}>
      <Stack direction={direction}>{children}</Stack>
    </ChakraRadioGroup>
  );
};

export { RadioGroup };
