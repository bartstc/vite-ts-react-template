import { createBrowserRouter } from "react-router-dom";

import { Cart } from "./Cart";
import { Home } from "./Home";
import { Products } from "./Products";

// todo: code-splitting
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    // todo: error screen
    errorElement: <h1>Error (todo)</h1>,
  },
  {
    path: "products",
    element: <Products />,
    // todo: error screen
    errorElement: <h1>Error (todo)</h1>,
  },
  {
    path: "cart",
    element: <Cart />,
    // todo: error screen
    errorElement: <h1>Error (todo)</h1>,
  },
]);
