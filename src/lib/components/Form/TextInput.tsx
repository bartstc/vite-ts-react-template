import { Field, Input, type InputProps } from "@chakra-ui/react";
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
    <Field.Root required={isRequired} invalid={isInvalid} w="100%">
      <Field.Label htmlFor={id}>{children}</Field.Label>
      <Input id={id} {...props} />
      {isInvalid && <Field.ErrorText>{t("required")}</Field.ErrorText>}
    </Field.Root>
  );
};

export { TextInput };
