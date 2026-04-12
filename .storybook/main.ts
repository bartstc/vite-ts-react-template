import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],

  addons: [
    "@storybook/addon-links",
    "storybook-addon-remix-react-router",
    "@storybook/addon-docs",
    "@storybook/addon-vitest",
    "@storybook/addon-mcp",
  ],

  framework: {
    name: "@storybook/react-vite",
    options: {},
  },

  typescript: {
    reactDocgen: "react-docgen-typescript",
  },

  build: {
    test: {
      disabledAddons: ["@storybook/addon-docs"],
    },
  },
};

export default config;
