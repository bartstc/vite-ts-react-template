import { Button, VStack } from "@chakra-ui/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { userEvent, within, screen, expect } from "storybook/test";

import { sleep } from "@/test-lib/storybook/sleep";

import { useFieldBasedCondition } from "./conditional-rendering";
import { MoneyInput } from "./fields/MoneyInput";
import { NumberInput } from "./fields/NumberInput";
import { SelectInput } from "./fields/SelectInput";
import { TextareaInput } from "./fields/TextareaInput";
import { TextInput } from "./fields/TextInput";
import { FormProvider } from "./FormProvider";
import { useForm } from "./use-form";

// ─── Form value shape ──────────────────────────────────────────────────────────

interface ProductOrderValues {
  customerName: string;
  email: string;
  product: string;
  quantity: number | null;
  hasCoupon: string;
  couponCode: string;
  totalPrice: number | null;
  notes: string;
}

// ─── Static data ───────────────────────────────────────────────────────────────

const PRODUCT_OPTIONS = [
  { label: "Electronics", value: "electronics" },
  { label: "Books", value: "books" },
  { label: "Clothing", value: "clothing" },
];

const COUPON_OPTIONS = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
];

// ─── Conditional sub-component ─────────────────────────────────────────────────
// AIDEV-NOTE: defined at module scope to avoid remounting on parent re-renders;
// uses useFieldBasedCondition to show/hide couponCode based on hasCoupon value.

const CouponCodeField = () => {
  const isVisible = useFieldBasedCondition<ProductOrderValues>("couponCode", {
    name: "hasCoupon",
    condition: (val) => (val as unknown as string) === "yes",
    defaultValue: "",
  });

  if (!isVisible) return null;

  return (
    <TextInput
      name="couponCode"
      label="Coupon Code"
      placeholder="Enter coupon code"
    />
  );
};

// ─── Form component ────────────────────────────────────────────────────────────

const ProductOrderForm = () => {
  const [submittedName, setSubmittedName] = useState<string | null>(null);

  const form = useForm<ProductOrderValues>({
    configuration: { autoValidation: true, size: "md", variant: "outline" },
  });

  const onSubmit = form.handleSubmit((values) => {
    setSubmittedName(values.customerName);
  });

  if (submittedName !== null) {
    return (
      <p>
        {"Order placed for "}
        {submittedName}
      </p>
    );
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} noValidate style={{ width: "440px" }}>
        <VStack gap={4} align="stretch">
          <TextInput
            name="customerName"
            label="Customer Name"
            isRequired
            placeholder="Jane Doe"
          />
          <TextInput
            name="email"
            label="Email Address"
            isRequired
            type="email"
            placeholder="jane@example.com"
          />
          <SelectInput
            name="product"
            label="Product Category"
            isRequired
            options={PRODUCT_OPTIONS}
            placeholder="Select a category"
          />
          <NumberInput
            name="quantity"
            label="Quantity"
            isRequired
            placeholder="1"
          />
          <SelectInput
            name="hasCoupon"
            label="Has Coupon?"
            options={COUPON_OPTIONS}
            placeholder="Select…"
          />
          <CouponCodeField />
          <MoneyInput name="totalPrice" label="Total Price" symbol="$" />
          <TextareaInput
            name="notes"
            label="Additional Notes"
            placeholder="Any special instructions…"
          />
          <Button type="submit" colorPalette="blue" w="full">
            {"Place Order"}
          </Button>
        </VStack>
      </form>
    </FormProvider>
  );
};

// ─── Storybook meta ────────────────────────────────────────────────────────────

const meta = {
  title: "lib/Form/AllFieldsForm",
  component: ProductOrderForm,
  parameters: { layout: "centered" },
} satisfies Meta<typeof ProductOrderForm>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Stories ───────────────────────────────────────────────────────────────────

export const Default: Story = {};

export const AllFields: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    // ── Step 1: Validate required fields ───────────────────────────────────────
    await step("Validate required fields", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: "Place Order" })
      );
      await sleep(100);

      // customerName, email, product, quantity are all required
      const errors = await screen.findAllByText("Field is required");
      await expect(errors).toHaveLength(4);
    });

    // ── Step 2: Fill text fields ───────────────────────────────────────────────
    await step("Fill text fields", async () => {
      await userEvent.type(
        canvas.getByLabelText("Customer Name"),
        "Alice Wonderland"
      );
      await userEvent.type(
        canvas.getByLabelText("Email Address"),
        "alice@example.com"
      );
    });

    // ── Step 3: Select product ─────────────────────────────────────────────────
    // The trigger has role="combobox" and aria-labelledby pointing to the Field.Label,
    // so getByRole('combobox', { name }) is the correct query.
    await step("Select product", async () => {
      await userEvent.click(
        canvas.getByRole("combobox", { name: "Product Category" })
      );
      await sleep(100);

      await userEvent.click(screen.getByRole("option", { name: "Books" }));
      await sleep(100);
    });

    // ── Step 4: Fill quantity ──────────────────────────────────────────────────
    await step("Fill quantity", async () => {
      await userEvent.clear(canvas.getByLabelText("Quantity"));
      await userEvent.type(canvas.getByLabelText("Quantity"), "3");
    });

    // ── Step 5: Toggle conditional field ──────────────────────────────────────
    await step("Toggle conditional field", async () => {
      await userEvent.click(
        canvas.getByRole("combobox", { name: "Has Coupon?" })
      );
      await sleep(100);
      await userEvent.click(screen.getByRole("option", { name: "Yes" }));
      await sleep(150);

      await expect(screen.getByLabelText("Coupon Code")).toBeInTheDocument();

      await userEvent.click(
        canvas.getByRole("combobox", { name: "Has Coupon?" })
      );
      await sleep(100);
      await userEvent.click(screen.getByRole("option", { name: "No" }));
      await sleep(150);

      await expect(
        screen.queryByLabelText("Coupon Code")
      ).not.toBeInTheDocument();
    });

    // ── Step 6: Fill remaining fields ─────────────────────────────────────────
    await step("Fill remaining fields", async () => {
      // Bring couponCode back by re-selecting Yes
      await userEvent.click(
        canvas.getByRole("combobox", { name: "Has Coupon?" })
      );
      await sleep(100);
      await userEvent.click(screen.getByRole("option", { name: "Yes" }));
      await sleep(150);

      await userEvent.type(screen.getByLabelText("Coupon Code"), "SAVE20");
      await userEvent.type(canvas.getByLabelText("Total Price"), "59.99");
      await userEvent.type(
        canvas.getByLabelText("Additional Notes"),
        "Please gift wrap."
      );
    });

    // ── Step 7: Submit form ────────────────────────────────────────────────────
    await step("Submit form", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: "Place Order" })
      );

      await expect(
        await screen.findByText("Order placed for Alice Wonderland")
      ).toBeInTheDocument();
    });
  },
};
