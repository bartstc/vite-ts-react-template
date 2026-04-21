import {
  Box,
  Collapsible,
  Flex,
  HStack,
  IconButton,
  Button,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Menu, X } from "lucide-react";
import { useState } from "react";

// eslint-disable-next-line boundaries/dependencies
import { useAuthStore } from "@/features/auth/application/auth-store";
import { useNotImplementedYetToast } from "@/lib/components/Toast/use-not-implemented-yet-toast";
import { Link, useNavigate } from "@/lib/router";
import { useColorModeValue } from "@/lib/theme/use-color-mode";

import { ToggleModeButton } from "../ToggleModeButton";

import { DesktopNav } from "./DesktopNav";
import { LoaderBar } from "./LoaderBar";
import { MobileNav } from "./MobileNav";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const onToggle = () => setIsOpen((v) => !v);
  const bg = useColorModeValue("white", "gray.800");

  return (
    <Box w="100%" position="fixed" zIndex="10">
      <Flex
        w="100%"
        minH="60px"
        py={2}
        px={4}
        borderBottom={1}
        borderStyle="solid"
        borderColor={useColorModeValue("gray.200", "gray.900")}
        align="center"
        bg={bg}
      >
        <Flex
          flex={{ base: 1, md: "auto" }}
          display={{ base: "flex", md: "none" }}
        >
          <IconButton
            onClick={onToggle}
            variant="ghost"
            aria-label="Toggle Navigation"
          >
            {isOpen ? <X size={12} /> : <Menu size={20} />}
          </IconButton>
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }}>
          <Text
            asChild
            textAlign={useBreakpointValue({ base: "center", md: "left" })}
            fontWeight="extrabold"
          >
            <Link to="/">{"Vite TS React Template"}</Link>
          </Text>
          <Flex display={{ base: "none", md: "flex" }} ml={10}>
            <DesktopNav />
          </Flex>
        </Flex>
        <HStack gap={4}>
          <SignInButton />
          <SignUpButton />
          <LogoutButton />
          <ToggleModeButton />
        </HStack>
      </Flex>
      <LoaderBar />
      <Collapsible.Root open={isOpen}>
        <Collapsible.Content>
          <MobileNav />
        </Collapsible.Content>
      </Collapsible.Root>
    </Box>
  );
};

const SignInButton = () => {
  const isAuthenticated = useAuthStore((store) => store.isAuthenticated);

  if (isAuthenticated) {
    return null;
  }

  return (
    <Button asChild fontWeight={400} variant="plain">
      <Link to="/sign-in">{"Sign In"}</Link>
    </Button>
  );
};

const SignUpButton = () => {
  const notImplemented = useNotImplementedYetToast();
  const isAuthenticated = useAuthStore((store) => store.isAuthenticated);

  if (isAuthenticated) {
    return null;
  }

  return (
    <Button
      display={{ base: "none", md: "inline-flex" }}
      colorPalette="orange"
      onClick={notImplemented}
    >
      {"Sign Up"}
    </Button>
  );
};

const LogoutButton = () => {
  const navigate = useNavigate();

  const isAuthenticated = useAuthStore((store) => store.isAuthenticated);
  const logout = useAuthStore((store) => store.logout);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Button
      fontWeight={400}
      variant="plain"
      onClick={() => logout().then(() => navigate("/"))}
    >
      <Link to="/sign-in">{"Logout"}</Link>
    </Button>
  );
};
