import { VStack, StackProps } from "@chakra-ui/react";

interface IProps extends Pick<StackProps, "spacing" | "maxW" | "children"> {}

const Page = ({ children, maxW = "1000px", ...props }: IProps) => {
  return (
    <VStack
      display="stretch"
      spacing={10}
      px={{ base: 3, md: 4 }}
      maxW={maxW}
      m="0 auto"
      pt={{ base: 20, md: 24 }}
      pb={{ base: 4, md: 6 }}
      {...props}
    >
      {children}
    </VStack>
  );
};

export { Page };
