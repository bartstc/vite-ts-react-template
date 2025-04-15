import type { TestRunnerConfig } from "@storybook/test-runner";
import { getStoryContext } from "@storybook/test-runner";
import { injectAxe, checkA11y } from "axe-playwright";

const config: TestRunnerConfig = {
  async preRender(page) {
    await injectAxe(page);
  },
  async postRender(page, context) {
    const storyContext = await getStoryContext(page, context);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!storyContext.parameters.a11y?.disable) {
      await checkA11y(page, "#storybook-root", {
        detailedReport: true,
        detailedReportOptions: {
          html: true,
        },
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        axeOptions: storyContext.parameters?.a11y?.options,
      });
    }
  },
};

export default config;
