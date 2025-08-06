import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

const config: StorybookConfig = {
  stories: [
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../app/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  async viteFinal(config) {
    const { mergeConfig } = await import("vite");

    return mergeConfig(config, {
      plugins: [tailwindcss(), tsconfigPaths()],
    });
  },
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
};
export default config;
