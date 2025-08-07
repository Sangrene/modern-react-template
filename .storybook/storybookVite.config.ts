/// <reference types="vitest" />
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), tsconfigPaths()],
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
