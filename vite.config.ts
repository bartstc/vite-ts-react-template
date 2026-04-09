/// <reference types="vitest" />
import fs from "node:fs";
import path from "node:path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    react(),
    mode !== "test" &&
      checker({
        typescript: true,
        eslint: {
          useFlatConfig: true,
          lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
        },
      }),
    {
      name: "remove-msw-service-worker",
      closeBundle: () => {
        if (process.env.NODE_ENV === "production") {
          const mswFile: string = path.join(
            __dirname,
            "dist",
            "mockServiceWorker.js"
          );

          if (fs.existsSync(mswFile)) {
            fs.unlinkSync(mswFile);
          }
        }
      },
    },
    {
      name: "i18n-hot-reload",
      handleHotUpdate: ({ file, server }) => {
        if (file.includes("locales") && file.endsWith(".json")) {
          server.hot.send({
            data: file,
            type: "custom",
            event: "locales-update",
          });
        }
      },
    },
  ],
  assetsInclude: ["/sb-preview/runtime.js"],
  server: {
    port: 5173,
    host: "127.0.0.1",
    strictPort: true,
  },
}));
