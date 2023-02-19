import { createBrowserRouter } from "react-router-dom";

import { productLoader, productsLoader } from "modules/products/infrastructure";

import { Cart } from "./Cart";
import { Home } from "./Home";
import { Product } from "./Product";
import { Products } from "./Products";

// todo: code-splitting
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    loader: () => {
      return productsLoader();
    },
    // todo: error screen
    errorElement: <h1>Error (todo)</h1>,
  },
  {
    path: "products",
    element: <Products />,
    loader: () => {
      return productsLoader();
    },
    // todo: error screen
    errorElement: <h1>Error (todo)</h1>,
  },
  {
    path: "products/:productId",
    element: <Product />,
    loader: ({ params }) => {
      return productLoader((params as { productId: string }).productId);
    },
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
