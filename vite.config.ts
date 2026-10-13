/// <reference types="vitest/config" />
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import { API_PREFIX } from "./src/apiConfig.ts";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiKey = env.CURRENCYBEACON_API_KEY;

  if (!apiKey && mode !== "test") {
    console.warn("CURRENCYBEACON_API_KEY is not set.");
  }

  return {
    plugins: [react()],
    server: {
      proxy: {
        [API_PREFIX]: {
          target: "https://api.currencybeacon.com",
          changeOrigin: true,
          rewrite: (path) => path.replace(API_PREFIX, "/v1"),
          headers: { Authorization: `Bearer ${apiKey}` },
        },
      },
    },
    test: {
      environment: "jsdom",
      setupFiles: "./src/test/setup.ts",
      restoreMocks: true,
    },
  };
});
