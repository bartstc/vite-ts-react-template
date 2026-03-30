import {
  VStack,
  type StackProps,
  Container,
  type ContainerProps,
} from "@chakra-ui/react";

interface IProps {
  children: StackProps["children"];
  gap?: StackProps["gap"];
  maxW?: ContainerProps["maxW"];
}

const Page = ({ children, maxW = "container.lg", ...props }: IProps) => {
  return (
    <Container maxW={maxW} p={0}>
      <VStack gapY={10} px={{ base: 3, md: 4 }} m="0 auto" {...props}>
        {children}
      </VStack>
    </Container>
  );
};

export { Page };
