import { createBrowserRouter } from "react-router-dom";

import { Layout } from "shared/Layout";
import { ErrorPageStrategy } from "shared/Result";

import { RequireAuth, RequirePub } from "modules/auth/application";
import { cartProductsLoader } from "modules/carts/infrastructure";
import { productLoader, productsLoader } from "modules/products/infrastructure";

// todo: code-splitting
import { CartPage } from "./Cart";
import { HomePage, HomePageError } from "./Home";
import { ProductPage } from "./Product";
import { ProductsPage } from "./Products";
import { SignInPage } from "./SignIn";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
        loader: () => {
          return productsLoader();
        },
        errorElement: <HomePageError />,
      },
      {
        path: "/sign-in",
        element: (
          <RequirePub to="/products">
            <SignInPage />
          </RequirePub>
        ),
        errorElement: <ErrorPageStrategy />,
      },
      {
        path: "/products",
        element: <ProductsPage />,
        loader: () => {
          return productsLoader();
        },
        errorElement: <ErrorPageStrategy />,
      },
      {
        path: "/products/:productId",
        element: <ProductPage />,
        loader: ({ params }) => {
          return productLoader((params as { productId: string }).productId);
        },
        errorElement: <ErrorPageStrategy />,
      },
      {
        path: "/cart/:cartId",
        element: (
          <RequireAuth to="/sign-in">
            <CartPage />
          </RequireAuth>
        ),
        loader: ({ params }) => {
          return cartProductsLoader((params as { cartId: string }).cartId);
        },
        errorElement: <ErrorPageStrategy />,
      },
    ],
  },
]);
