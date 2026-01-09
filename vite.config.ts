/// <reference types="vitest" />
import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ command, mode }) => {
  const isTest = mode === "test" || command === "serve";
  
  return {
    plugins: [
      tailwindcss(),
      // Only use reactRouter plugin when not in test mode
      ...(isTest ? [] : [reactRouter()]),
      tsconfigPaths(),
    ],
    server: {
      port: 3000,
    },
    esbuild: {
      supported: {
        decorators: false,
      },
    },
    test: {
      environment: "happy-dom",
      globals: true,
    },
  };
});
