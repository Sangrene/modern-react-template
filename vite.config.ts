/// <reference types="vitest" />
import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  server: {
    port: 3000,
  },
  esbuild: {
    supported: {
      decorators: false,
    },
  },
  // @ts-ignore
  test: {
    environment: "happy-dom",
  },
});
