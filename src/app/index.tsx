import { RouterProvider } from "react-router-dom";

import "@fontsource/inter/400.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/900.css";
import { router } from "pages/router";

import { Providers } from "./Providers";

function App() {
  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  );
}

export default App;
