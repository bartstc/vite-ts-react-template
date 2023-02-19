import { ReactNode } from "react";

import { CheckIcon } from "@chakra-ui/icons";
import {
  Box,
  Text,
  Stack,
  VStack,
  GridItem,
  Flex,
  SimpleGrid,
  chakra,
  CardBody,
  Card,
} from "@chakra-ui/react";
import { useBrandColor, useSecondaryTextColor } from "theme";

const FeatureSection = () => {
  const brandColor = useBrandColor();
  const textColor = useSecondaryTextColor();

  return (
    <Card>
      <CardBody px={{ base: 4, lg: 10 }} py={{ base: 6, lg: 10 }}>
        <SimpleGrid
          alignItems="center"
          columns={{
            base: 1,
            lg: 3,
          }}
          spacingY={{
            base: 12,
            lg: 32,
          }}
          spacingX={{
            base: 0,
            lg: 24,
          }}
        >
          <GridItem
            colSpan={{ base: 1, lg: 1 }}
            as={VStack}
            spacing={0}
            alignSelf="start"
            alignItems={{ base: "center", lg: "start" }}
          >
            <chakra.h2
              fontWeight="semibold"
              textTransform="uppercase"
              letterSpacing="wide"
            >
              Everything you need
            </chakra.h2>
            <chakra.h2
              color={brandColor}
              fontSize={{
                base: "2xl",
                md: "4xl",
              }}
              fontWeight="extrabold"
              lineHeight="shorter"
              letterSpacing="tight"
              textAlign={{ base: "center", lg: "start" }}
            >
              All-in-one platform
            </chakra.h2>
            <Text
              color={textColor}
              textAlign={{ base: "center", lg: "start" }}
              pt={2}
            >
              Lorem ipsum dolor sit amet consect adipisicing elit. Possimus
              magnam voluptatum cupiditate veritatis in accusamus quisquam.
            </Text>
          </GridItem>
          <GridItem colSpan={2}>
            <Stack
              spacing={{
                base: 10,
                md: 0,
              }}
              display={{
                md: "grid",
              }}
              gridTemplateColumns={{
                md: "repeat(2,1fr)",
              }}
              gridColumnGap={{
                md: 8,
              }}
              gridRowGap={{
                md: 10,
              }}
            >
              <Feature title="Invite team members">
                Improve your conversion rates by monitoring exactly what’s going
                on while your customers are in trial.
              </Feature>
              <Feature title="Unify your payments stack">
                Manage all your online and offline sales in one place with a
                single integration, simplifying reporting and reconciliation.
              </Feature>
              <Feature title="Own your in-store experience">
                Provide a seamless customer experience across channels, like
                reserving online and picking up in store.
              </Feature>
              <Feature title="Grow your platform’s revenue">
                Add in-person payments to your platform or marketplace. Using
                Terminal with Connect.
              </Feature>
              <Feature title="Clear overview for efficient tracking">
                Handle your subscriptions and transactions efficiently with the
                clear overview in Dashboard. Fea
              </Feature>
              <Feature title="Decide how you integrate Payments">
                Love to code? Decide how you integrate Payments and build
                advanced and reliable products yourself from scratch.
              </Feature>
            </Stack>
          </GridItem>
        </SimpleGrid>
      </CardBody>
    </Card>
  );
};

interface IFeatureProps {
  title: string;
  children: ReactNode;
}

const Feature = (props: IFeatureProps) => {
  const textColor = useSecondaryTextColor();

  return (
    <Flex>
      <Flex shrink={0}>
        <CheckIcon fontSize="lg" color="green.500" />
      </Flex>
      <Box ml={4}>
        <chakra.dt fontSize="lg" fontWeight="bold" lineHeight="6">
          {props.title}
        </chakra.dt>
        <chakra.dd mt={2} color={textColor}>
          {props.children}
        </chakra.dd>
      </Box>
    </Flex>
  );
};

export { FeatureSection };
