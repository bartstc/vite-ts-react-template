import { createBrowserRouter } from "react-router-dom";

import { RequireAuth, RequirePub } from "modules/auth/application";
import { cartProductsLoader } from "modules/carts/infrastructure";
import { productLoader, productsLoader } from "modules/products/infrastructure";

// todo: code-splitting
import { Cart } from "./Cart";
import { Home } from "./Home";
import { Product } from "./Product";
import { Products } from "./Products";
import { SignIn } from "./SignIn";

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
    path: "/sign-in",
    element: (
      <RequirePub to="/products">
        <SignIn />
      </RequirePub>
    ),
    errorElement: <h1>Error (todo)</h1>,
  },
  {
    path: "/products",
    element: <Products />,
    loader: () => {
      return productsLoader();
    },
    // todo: error screen
    errorElement: <h1>Error (todo)</h1>,
  },
  {
    path: "/products/:productId",
    element: <Product />,
    loader: ({ params }) => {
      return productLoader((params as { productId: string }).productId);
    },
    // todo: error screen
    errorElement: <h1>Error (todo)</h1>,
  },
  {
    path: "/cart/:cartId",
    element: (
      <RequireAuth to="/sign-in">
        <Cart />
      </RequireAuth>
    ),
    loader: ({ params }) => {
      return cartProductsLoader((params as { cartId: string }).cartId);
    },
    // todo: error screen
    errorElement: <h1>Error (todo)</h1>,
  },
]);
