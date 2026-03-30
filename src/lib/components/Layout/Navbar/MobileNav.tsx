import {
  Collapsible,
  Flex,
  Icon,
  Link as ChLink,
  Stack,
  Text,
} from "@chakra-ui/react";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { Link } from "@/lib/router";
import { useColorModeValue } from "@/lib/theme/use-color-mode";

import type { NavItem } from "./nav-item";
import { useNavItems } from "./use-nav-items";

export const MobileNav = () => {
  const bg = useColorModeValue("white", "gray.800");
  const navItems = useNavItems();

  return (
    <Stack
      p={4}
      display={{ md: "none" }}
      bg={bg}
      borderBottom={1}
      borderStyle="solid"
      borderColor={useColorModeValue("gray.200", "gray.900")}
    >
      {navItems.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

// todo: navigation: Link
const MobileNavItem = ({ label, children, href }: NavItem) => {
  const [isOpen, setIsOpen] = useState(false);
  const onToggle = () => setIsOpen((v) => !v);

  return (
    <Stack gap={4} onClick={children && onToggle}>
      <Flex
        asChild
        py={2}
        justify="space-between"
        align="center"
        _hover={{
          textDecoration: "none",
        }}
      >
        <Link to={href ?? ""}>
          <Text
            fontWeight="bold"
            color={useColorModeValue("gray.600", "gray.200")}
          >
            {label}
          </Text>
        </Link>
        <Text
          fontWeight="bold"
          color={useColorModeValue("gray.600", "gray.200")}
        >
          {label}
        </Text>
        {children && (
          <Icon
            transition="all .25s ease-in-out"
            transform={isOpen ? "rotate(180deg)" : ""}
            boxSize={6}
          >
            <ChevronDown />
          </Icon>
        )}
      </Flex>
      <Collapsible.Root open={isOpen}>
        <Collapsible.Content>
          <Stack
            pl={4}
            borderLeft={1}
            borderStyle="solid"
            borderColor={useColorModeValue("gray.200", "gray.700")}
            align="start"
          >
            {children?.map((child) => (
              <ChLink
                key={child.label}
                py={2}
                href={child.href}
                target="_blank"
                rel="noreferrer noopener"
              >
                {child.label}
              </ChLink>
            ))}
          </Stack>
        </Collapsible.Content>
      </Collapsible.Root>
    </Stack>
  );
};
