const { mergeConfig } = require("vite");
const tsconfigPaths = require("vite-tsconfig-paths");
module.exports = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-a11y",
    "storybook-addon-react-router-v6",
    "storybook-dark-mode",
    "@storybook/addon-mdx-gfm",
    "@storybook/addon-styling",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  // core: {
  //   builder: "@storybook/builder-vite",
  // },
  features: {
    storyStoreV7: true,
    interactionsDebugger: true,
  },
  async viteFinal(config) {
    return {
      ...config,
      plugins: [...config.plugins, tsconfigPaths.default()],
    };
  },
  docs: {
    autodocs: "tag",
  },
};
