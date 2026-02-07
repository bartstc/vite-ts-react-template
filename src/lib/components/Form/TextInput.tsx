import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  type InputProps,
} from "@chakra-ui/react";
import type { ReactNode } from "react";

import { useTranslations } from "@/lib/i18n/use-transations";

interface IProps extends InputProps {
  id: string;
  children: string | ReactNode;
  isRequired?: boolean;
}

const TextInput = ({ id, children, isRequired = true, ...props }: IProps) => {
  const t = useTranslations("shared.form");
  const isInvalid = props.value === "";

  return (
    <FormControl id={id} isRequired={isRequired} isInvalid={isInvalid}>
      <FormLabel>{children}</FormLabel>
      <Input {...props} />
      {isInvalid && <FormErrorMessage>{t("required")}</FormErrorMessage>}
    </FormControl>
  );
};

export { TextInput };
