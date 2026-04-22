import { defineConfig } from "vitest/config";

export default defineConfig({
  server: {
    fs: {
      allow: ["/app", "."],
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./setup.ts",
    include: ["unit/**/*.spec.ts"],
    css: false,
  },
});
