import {
  Stack,
  VStack,
  Heading,
  Text,
  ButtonGroup,
  type HeadingProps,
} from "@chakra-ui/react";
import type { ReactNode } from "react";

import { useSecondaryTextColor } from "@/lib/theme/use-secondary-text-color";

interface IProps {
  title: string | ReactNode;
  description?: string | ReactNode;
  size?: HeadingProps["size"];
  children?: ReactNode;
}

const PageHeader = ({
  title,
  description,
  size = { base: "md", md: "lg" },
  children,
}: IProps) => {
  const descriptionColor = useSecondaryTextColor();

  return (
    <Stack
      direction={{ base: "column", lg: "row" }}
      w="100%"
      gap={3}
      justify="space-between"
      align={{ base: "start", lg: "center" }}
    >
      <VStack align="start" gap={1}>
        <Heading size={size}>{title}</Heading>
        {description && <Text color={descriptionColor}>{description}</Text>}
      </VStack>
      <ButtonGroup>{children}</ButtonGroup>
    </Stack>
  );
};

export { PageHeader };
