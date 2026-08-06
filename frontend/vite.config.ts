import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig(({ command }) => ({
  plugins: [react()],
  // Only apply the GitHub Pages subpath during production builds
  // (`vite build`). Local dev (`vite dev` / `npm run dev`) always
  // serves from root "/", matching how the dev server actually works.
  base: command === "build" ? "/troubleshoot-assistant/" : "/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));