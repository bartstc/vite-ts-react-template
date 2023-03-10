import { Outlet } from "react-router-dom";

import { chakra } from "@chakra-ui/react";

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
