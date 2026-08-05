import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  base: '/troubleshoot-assistant/', // must match repo name exactly
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
