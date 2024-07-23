import * as tsconfigPaths from "vite-tsconfig-paths";

export default {
  stories: ["../src/**/*.stories.@(js|jsx|ts|tsx)"],

  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-a11y",
    "storybook-dark-mode",
    "@chromatic-com/storybook",
  ],

  framework: {
    name: "@storybook/react-vite",
    options: {},
  },

  features: {
    interactionsDebugger: true,
  },

  async viteFinal(config) {
    return {
      ...config,
      plugins: [...config.plugins, tsconfigPaths.default()],
    };
  },

  docs: {},

  typescript: {
    reactDocgen: "react-docgen-typescript",
  },
};
