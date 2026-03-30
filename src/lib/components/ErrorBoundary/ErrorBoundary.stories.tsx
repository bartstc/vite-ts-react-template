import { Button, VStack } from "@chakra-ui/react";
import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
// eslint-disable-next-line no-restricted-imports
import { createMemoryRouter, RouterProvider } from "react-router";

import { ErrorBoundary } from "@/lib/components/ErrorBoundary/ErrorBoundary";
import { ErrorPageStrategy } from "@/lib/components/Result/ErrorPageStrategy";
import { InternalServerErrorResult } from "@/lib/components/Result/InternalServerErrorResult";
import { AjaxError } from "@/lib/http/ajax-error";

const withRouter: Decorator = (story) => {
  const router = createMemoryRouter(
    [
      {
        path: "/",
        element: story(),
      },
    ],
    {
      initialEntries: ["/"],
      initialIndex: 1,
    }
  );

  return <RouterProvider router={router} />;
};

const Throw500Error = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
  throw new AjaxError<any, any>(500, {}, {}, {} as any);
};

const TestableErrorBoundary = ({
  withRecovery,
}: {
  withRecovery?: boolean;
}) => {
  const [throwError, setError] = useState(false);
  const [resetKey, setResetKey] = useState(false);

  return (
    <ErrorBoundary<AjaxError>
      resetKeys={[resetKey]}
      fallback={({ error }) => {
        if (withRecovery) {
          return (
            <InternalServerErrorResult>
              <Button onClick={() => setResetKey((state) => !state)}>
                {"Try again"}
              </Button>
            </InternalServerErrorResult>
          );
        }

        return <ErrorPageStrategy error={error} />;
      }}
    >
      <VStack>
        <Button id="test" onClick={() => setError(true)} colorPalette="red">
          {"Throw an error"}
        </Button>
        {throwError ? (
          <Throw500Error />
        ) : (
          <div>{'"Everything is fine... at least now"'}</div>
        )}
      </VStack>
    </ErrorBoundary>
  );
};

const meta = {
  title: "shared/ErrorBoundary",
  component: TestableErrorBoundary,
  decorators: [withRouter],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof TestableErrorBoundary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithRecovery: Story = {
  args: { withRecovery: true },
};
