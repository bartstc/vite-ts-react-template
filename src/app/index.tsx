import "@fontsource/inter/400.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/900.css";

import { Demo } from "modules/demo/presentation";

import { Providers } from "./Providers";

function App() {
  return (
    <Providers>
      <Demo />
    </Providers>
  );
}

export default App;
