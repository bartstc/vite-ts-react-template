import { ReactNode } from "react";

import { CheckIcon as ChakraCheckIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Heading,
  HStack,
  List,
  ListItem,
  Stack,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { useSecondaryTextColor } from "theme";

const PricingSection = () => {
  const sectionBg = useColorModeValue("gray.50", "gray.700");
  const textColor = useSecondaryTextColor();

  return (
    <Box py={12}>
      <VStack spacing={2} textAlign="center">
        <Heading
          as="h2"
          fontWeight="bold"
          fontSize={{ base: "3xl", sm: "4xl", md: "6xl" }}
        >
          Plans that fit your need
        </Heading>
        <Text
          fontSize={{
            base: "md",
            md: "lg",
            lg: "xl",
          }}
          color={textColor}
        >
          Start with 14-day free trial. No credit card needed. Cancel at
          anytime.
        </Text>
      </VStack>
      <Stack
        direction={{ base: "column", md: "row" }}
        textAlign="center"
        justify="center"
        spacing={10}
        py={10}
      >
        <PriceWrapper>
          <Box py={4} px={12}>
            <Text fontWeight="500" fontSize="2xl">
              Hobby
            </Text>
            <HStack justifyContent="center">
              <Text fontSize="3xl" fontWeight="600">
                $
              </Text>
              <Text fontSize="5xl" fontWeight="900">
                79
              </Text>
              <Text fontSize="3xl" color="gray.500">
                /month
              </Text>
            </HStack>
          </Box>
          <VStack bg={sectionBg} py={4} borderBottomRadius={"xl"}>
            <List spacing={3} textAlign="start" px={12}>
              <ListItem>
                <CheckIcon /> unlimited build minutes
              </ListItem>
              <ListItem>
                <CheckIcon /> Lorem, ipsum dolor.
              </ListItem>
              <ListItem>
                <CheckIcon /> 5TB Lorem, ipsum dolor.
              </ListItem>
            </List>
            <Box w="80%" pt={7}>
              <Button w="full" colorScheme="orange" variant="outline">
                Start trial
              </Button>
            </Box>
          </VStack>
        </PriceWrapper>

        <PriceWrapper>
          <Box position="relative">
            <MostPopularBadge />
            <Box py={4} px={12}>
              <Text fontWeight="500" fontSize="2xl">
                Growth
              </Text>
              <HStack justifyContent="center">
                <Text fontSize="3xl" fontWeight="600">
                  $
                </Text>
                <Text fontSize="5xl" fontWeight="900">
                  149
                </Text>
                <Text fontSize="3xl" color="gray.500">
                  /month
                </Text>
              </HStack>
            </Box>
            <VStack bg={sectionBg} py={4} borderBottomRadius={"xl"}>
              <List spacing={3} textAlign="start" px={12}>
                <ListItem>
                  <CheckIcon /> unlimited build minutes
                </ListItem>
                <ListItem>
                  <CheckIcon /> Lorem, ipsum dolor.
                </ListItem>
                <ListItem>
                  <CheckIcon /> 5TB Lorem, ipsum dolor.
                </ListItem>
                <ListItem>
                  <CheckIcon /> 5TB Lorem, ipsum dolor.
                </ListItem>
                <ListItem>
                  <CheckIcon /> 5TB Lorem, ipsum dolor.
                </ListItem>
              </List>
              <Box w="80%" pt={7}>
                <Button w="full" colorScheme="orange">
                  Start trial
                </Button>
              </Box>
            </VStack>
          </Box>
        </PriceWrapper>
        <PriceWrapper>
          <Box py={4} px={12}>
            <Text fontWeight="500" fontSize="2xl">
              Scale
            </Text>
            <HStack justifyContent="center">
              <Text fontSize="3xl" fontWeight="600">
                $
              </Text>
              <Text fontSize="5xl" fontWeight="900">
                349
              </Text>
              <Text fontSize="3xl" color="gray.500">
                /month
              </Text>
            </HStack>
          </Box>
          <VStack bg={sectionBg} py={4} borderBottomRadius="xl">
            <List spacing={3} textAlign="start" px={12}>
              <ListItem>
                <CheckIcon /> unlimited build minutes
              </ListItem>
              <ListItem>
                <CheckIcon /> Lorem, ipsum dolor.
              </ListItem>
              <ListItem>
                <CheckIcon /> 5TB Lorem, ipsum dolor.
              </ListItem>
            </List>
            <Box w="80%" pt={7}>
              <Button w="full" colorScheme="orange" variant="outline">
                Start trial
              </Button>
            </Box>
          </VStack>
        </PriceWrapper>
      </Stack>
    </Box>
  );
};

const PriceWrapper = ({ children }: { children: ReactNode }) => {
  const borderColor = useColorModeValue("gray.200", "gray.500");

  return (
    <Box
      mb={4}
      shadow="base"
      borderWidth="1px"
      alignSelf={{ base: "center", lg: "flex-start" }}
      borderColor={borderColor}
      borderRadius="xl"
    >
      {children}
    </Box>
  );
};

const MostPopularBadge = () => {
  const bg = useColorModeValue("orange.200", "orange.600");
  const color = useColorModeValue("gray.900", "gray.300");

  return (
    <Box
      position="absolute"
      top="-16px"
      left="50%"
      style={{ transform: "translate(-50%)" }}
    >
      <Text
        textTransform="uppercase"
        bg={bg}
        px={3}
        py={1}
        color={color}
        fontSize="sm"
        fontWeight="600"
        rounded="xl"
      >
        Most Popular
      </Text>
    </Box>
  );
};

const CheckIcon = () => {
  const color = useColorModeValue("green.500", "green.200");

  return <ChakraCheckIcon fontSize="sm" color={color} mr={2} />;
};

export { PricingSection };
