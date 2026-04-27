import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen } from "storybook/test";
import { withRouter } from "storybook-addon-remix-react-router";

import { ProductFixture } from "@/test-lib/fixtures/product-fixture";
import { deleteRemoveCartProductHandler } from "@/test-lib/handlers/delete-remove-cart-product-handler";
import { putAddToCartHandler } from "@/test-lib/handlers/put-add-to-cart-handler";

import { CartItem } from "./CartItem";
import { ConfirmRemoveProductDialog } from "./CartItem/ConfirmRemoveProductDialog";
import { useConfirmRemoveProductDialogStore } from "./CartItem/use-confirm-remove-product-dialog-store";

const meta = {
  title: "modules/Carts/CartItem",
  component: CartItem,
  decorators: [
    (story) => (
      <>
        {story()}
        <ConfirmRemoveProductDialog />
      </>
    ),
    withRouter,
  ],
  parameters: {
    layout: "centered",
  },
  beforeEach: () => {
    useConfirmRemoveProductDialogStore.setState({
      isOpen: false,
      selectedItem: null,
    });
  },
} satisfies Meta<typeof CartItem>;

const product = ProductFixture.toStructure();

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: product.id,
    name: product.name,
    category: product.category,
    price: product.price,
    imageUrl: product.imageUrl,
    quantity: 4,
  },
};

export const DecrementAboveOne: Story = {
  args: {
    ...Default.args,
    quantity: 4,
  },
  parameters: {
    msw: {
      handlers: [deleteRemoveCartProductHandler(), putAddToCartHandler()],
    },
  },
  play: async ({ step }) => {
    await step("Click decrease quantity button", () => {
      screen.getByRole("button", { name: "Decrease quantity" }).click();
    });

    await step("Toast confirms quantity decreased", async () => {
      await expect(
        await screen.findByText("Product removed.")
      ).toBeInTheDocument();
    });
  },
};

export const DecrementLastUnit: Story = {
  args: {
    ...Default.args,
    quantity: 1,
  },
  parameters: {
    msw: {
      handlers: [deleteRemoveCartProductHandler(), putAddToCartHandler()],
    },
  },
  play: async ({ step }) => {
    await step("Click decrease quantity button", () => {
      screen.getByRole("button", { name: "Decrease quantity" }).click();
    });

    await step("Decrement confirmation dialog appears", async () => {
      await expect(await screen.findByRole("alertdialog")).toBeInTheDocument();
      await expect(screen.getByText("Remove last item")).toBeInTheDocument();
      await expect(
        screen.getByRole("button", { name: "Yes, remove" })
      ).toBeInTheDocument();
    });
  },
};

export const RemoveAllOpensDialog: Story = {
  args: {
    ...Default.args,
    quantity: 4,
  },
  parameters: {
    msw: {
      handlers: [deleteRemoveCartProductHandler(), putAddToCartHandler()],
    },
  },
  play: async ({ step }) => {
    await step("Click Remove button", () => {
      screen.getByRole("button", { name: "Remove" }).click();
    });

    await step("Remove-all confirmation dialog appears", async () => {
      await expect(await screen.findByRole("alertdialog")).toBeInTheDocument();
      await expect(screen.getByText("Remove product")).toBeInTheDocument();
      await expect(
        screen.getByRole("button", { name: "Yes, remove all" })
      ).toBeInTheDocument();
    });
  },
};
