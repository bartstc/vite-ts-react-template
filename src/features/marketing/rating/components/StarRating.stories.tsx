import type { Meta, StoryObj } from "@storybook/react-vite";
import { HttpResponse } from "msw";
import { userEvent, screen, expect } from "storybook/test";

import { patchRateProductHandler } from "@/test-lib/handlers/patch-rate-product-handler";
import { withAuth } from "@/test-lib/storybook/with-auth";
import { withoutAuth } from "@/test-lib/storybook/without-auth";

import { StarRating } from "./StarRating";

const meta = {
  title: "modules/Marketing/Rating/StarRating",
  component: StarRating,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof StarRating>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultArgs = { rating: 3.7, productId: "1" };

export const Default: Story = {
  args: defaultArgs,
};

export const SubmitRating: Story = {
  args: defaultArgs,
  decorators: [withAuth],
  parameters: {
    msw: { handlers: [patchRateProductHandler()] },
  },
  play: async ({ canvasElement, step }) => {
    await step("Hover over the 4th star", async () => {
      const stars = canvasElement.querySelectorAll("svg");
      await userEvent.hover(stars[3]);
    });

    await step("Click the 4th star to submit rating", async () => {
      const stars = canvasElement.querySelectorAll("svg");
      await userEvent.click(stars[3]);
    });

    await step("Success notification is shown", async () => {
      await expect(
        await screen.findByText("Thank you! Your rating has been submitted.")
      ).toBeInTheDocument();
    });
  },
};

export const SubmitRatingFailure: Story = {
  args: defaultArgs,
  decorators: [withAuth],
  parameters: {
    msw: {
      handlers: [
        patchRateProductHandler(() => HttpResponse.json({}, { status: 500 })),
      ],
    },
  },
  play: async ({ canvasElement, step }) => {
    await step("Click the 3rd star", async () => {
      const stars = canvasElement.querySelectorAll("svg");
      await userEvent.click(stars[2]);
    });

    await step("Error notification is shown", async () => {
      await expect(
        await screen.findByText(
          "Something went wrong with submitting your rating. Please try again or contact us."
        )
      ).toBeInTheDocument();
    });
  },
};

export const RatingWhileUnauthenticated: Story = {
  args: defaultArgs,
  decorators: [withoutAuth],
  play: async ({ canvasElement, step }) => {
    await step("Click a star while not logged in", async () => {
      const stars = canvasElement.querySelectorAll("svg");
      await userEvent.click(stars[2]);
    });

    await step("Not-authenticated notification is shown", async () => {
      await expect(
        await screen.findByText("You have to log in to rate the product")
      ).toBeInTheDocument();
    });
  },
};
