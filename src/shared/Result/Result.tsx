import { ReactNode } from "react";

import { Center, VStack, Heading, Text } from "@chakra-ui/react";
import { useSecondaryTextColor } from "theme";

interface IProps {
  image: ReactNode;
  heading: string;
  subheading: string;
  children: ReactNode;
}

const Result = ({ children, heading, image, subheading }: IProps) => {
  const secondaryColor = useSecondaryTextColor();

  return (
    <Center minH="75vh" as={VStack} textAlign="center" spacing={6}>
      {image}
      <VStack maxW="2xl">
        <Heading as="h2" size={{ base: "lg", md: "xl" }}>
          {heading}
        </Heading>
        <Text size={{ base: "md", md: "lg" }} color={secondaryColor}>
          {subheading}
        </Text>
      </VStack>
      {children}
    </Center>
  );
};

export { Result };
