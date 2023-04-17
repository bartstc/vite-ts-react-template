import { expect } from "@storybook/jest";
import type { Meta, StoryObj } from "@storybook/react";
import {
  userEvent,
  within,
  screen,
  waitForElementToBeRemoved,
} from "@storybook/testing-library";
import { withRouter } from "storybook-addon-react-router-v6";

import { sleep } from "utils";
import { getAddToCartHandler } from "utils/handlers";

import { AddToCartButton } from "./AddToCartButton";
import { ProductAddedDialog } from "./ProductAddedDialog";

const meta = {
  title: "modules/Carts/AddToCartButton",
  component: AddToCartButton,
  decorators: [
    (story) => {
      return (
        <>
          {story()}
          <ProductAddedDialog />
        </>
      );
    },
    withRouter,
  ],
  parameters: {
    layout: "centered",
    msw: {
      handlers: [getAddToCartHandler()],
    },
  },
} satisfies Meta<typeof AddToCartButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    productId: 1,
  },
};

export const AddingProductToCart: Story = {
  ...Default,
  play: async ({ canvasElement, step }) => {
    within(canvasElement);

    await step("Add a new product", async () => {
      await userEvent.click(
        screen.getByRole("button", { name: /Add to cart/ })
      );

      expect(
        await screen.findByText(
          "A product has been successfully added to your cart."
        )
      ).toBeInTheDocument();
      expect(
        await screen.findByText(
          /Wonderful! You have already added a new product to your cart/
        )
      ).toBeInTheDocument();
    });

    await step("Acknowledge and continue shopping", async () => {
      await sleep(500);

      await userEvent.click(
        screen.getByRole("button", { name: /Continue shopping/ })
      );

      await waitForElementToBeRemoved(() =>
        screen.queryByText(
          /Wonderful! You have already added a new product to your cart/
        )
      );
    });
  },
};
