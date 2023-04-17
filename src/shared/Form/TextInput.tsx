import { ReactNode } from "react";

import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  InputProps,
} from "@chakra-ui/react";

import { t } from "utils";

interface IProps extends InputProps {
  id: string;
  children: string | ReactNode;
  isRequired?: boolean;
}

const TextInput = ({ id, children, isRequired = true, ...props }: IProps) => {
  const isInvalid = props.value === "";

  return (
    <FormControl id={id} isRequired={isRequired} isInvalid={isInvalid}>
      <FormLabel>{children}</FormLabel>
      <Input {...props} />
      {isInvalid && (
        <FormErrorMessage>{t("Field is required.")}</FormErrorMessage>
      )}
    </FormControl>
  );
};

export { TextInput };
