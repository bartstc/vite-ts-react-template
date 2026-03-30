import { HStack, Icon, Text } from "@chakra-ui/react";
import { ArrowRight } from "lucide-react";

import { useBrandColor } from "@/lib/theme/use-brand-color";

export const Logo = () => {
  const color = useBrandColor();

  return (
    <HStack>
      <Icon color={color}>
        <ArrowRight />
      </Icon>
      <Text color={color} fontSize="lg" fontWeight="extrabold" m={0}>
        {"Logoipsum"}
      </Text>
    </HStack>
  );
};
