const tsconfigPaths = require("vite-tsconfig-paths");

module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "storybook-dark-mode",
  ],
  framework: "@storybook/react",
  core: {
    builder: "@storybook/builder-vite",
  },
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
};
