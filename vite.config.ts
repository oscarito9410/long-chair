import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
  server: {
    host: "127.0.0.1",
    port: 4179,
    strictPort: true,
  },
  preview: {
    host: "127.0.0.1",
    port: 4179,
    strictPort: true,
  },
});
