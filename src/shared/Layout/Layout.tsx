import { chakra } from "@chakra-ui/react";

import { Outlet } from "shared/Router";

import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

export const Layout = () => {
  return (
    <chakra.main>
      <Navbar />
      <Outlet />
      <Footer />
    </chakra.main>
  );
};
