// eslint-disable-next-line no-restricted-imports
import { RouterProvider } from "react-router-dom";

import { Center, Spinner } from "@chakra-ui/react";
import "@fontsource/inter/400.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/900.css";
import { router } from "pages/router";

import { useAuthStore } from "modules/auth/application";

function App() {
  const state = useAuthStore((store) => store.state);

  if (state === "finished") {
    return <RouterProvider router={router} />;
  }

  return (
    <Center h="95vh">
      <Spinner color="orange.400" size="xl" />
    </Center>
  );
}

export { App };
