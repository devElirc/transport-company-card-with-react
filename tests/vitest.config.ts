import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
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
