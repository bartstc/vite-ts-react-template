// eslint-disable-next-line no-restricted-imports
import { createBrowserRouter } from "react-router-dom";

import { Layout } from "shared/Layout";
import { ErrorPageStrategy } from "shared/Result";

import { RequireAuth, RequirePub } from "modules/auth/application";

// todo: code-splitting
import { CartPage, cartPageLoader } from "./Cart";
import { HomePage, HomePageError, homePageLoader } from "./Home";
import { ProductPage, ProductPageError, productPageLoader } from "./Product";
import { ProductsPage, productsPageLoader } from "./Products";
import { SignInPage } from "./SignIn";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
        loader: homePageLoader,
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
        loader: productsPageLoader,
        errorElement: <ErrorPageStrategy />,
      },
      {
        path: "/products/:productId",
        element: <ProductPage />,
        loader: ({ params }) =>
          productPageLoader((params as { productId: string }).productId),
        errorElement: <ProductPageError />,
      },
      {
        path: "/cart/:cartId",
        element: (
          <RequireAuth to="/sign-in">
            <CartPage />
          </RequireAuth>
        ),
        loader: ({ params }) =>
          cartPageLoader((params as { cartId: string }).cartId),
        errorElement: <ErrorPageStrategy />,
      },
    ],
  },
]);
