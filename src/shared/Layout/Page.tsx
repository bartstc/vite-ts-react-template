import {
  VStack,
  StackProps,
  Container,
  ContainerProps,
} from "@chakra-ui/react";

interface IProps {
  children: StackProps["children"];
  spacing?: StackProps["spacing"];
  maxW?: ContainerProps["maxW"];
}

const Page = ({ children, maxW = "container.lg", ...props }: IProps) => {
  return (
    <VStack
      as={Container}
      display="stretch"
      spacing={10}
      px={{ base: 3, md: 4 }}
      maxW={maxW}
      m="0 auto"
      {...props}
    >
      {children}
    </VStack>
  );
};

export { Page };
