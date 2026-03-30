import { VStack, NativeSelect, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";

interface IProps {
  id: string;
  children: ReactNode;
  options: { label: string; value: string }[];
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Select = ({ children, options, id, value, onChange }: IProps) => {
  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <VStack as="label" htmlFor={id} w="100%" align="start" gap={2}>
      <Text fontWeight="500">{children}</Text>
      <NativeSelect.Root w="100%">
        <NativeSelect.Field id={id} value={value} onChange={onChange}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </NativeSelect.Field>
        <NativeSelect.Indicator />
      </NativeSelect.Root>
    </VStack>
  );
};

export { Select };
