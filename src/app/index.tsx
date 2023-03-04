import { RouterProvider } from "react-router-dom";

import { Center, Spinner } from "@chakra-ui/react";
import "@fontsource/inter/400.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/900.css";
import { router } from "pages/router";

import { useAuthStore } from "modules/auth/application";

import { Providers } from "./Providers";

function App() {
  const state = useAuthStore((store) => store.state);

  if (state === "finished") {
    return (
      <Providers>
        <RouterProvider router={router} />
      </Providers>
    );
  }

  return (
    <Providers>
      <Center h="95vh">
        <Spinner color="orange.400" size="xl" />
      </Center>
    </Providers>
  );
}

export default App;
