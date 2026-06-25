import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    extensions: [".js", ".mjs", ".ts", ".jsx", ".tsx", ".json"],
  },
  server: {
    port: 5173,
    strictPort: true,
    cors: true,
    open: true,
  },
});
