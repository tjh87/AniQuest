import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  root: fileURLToPath(new URL("./local", import.meta.url)),
  publicDir: fileURLToPath(new URL("./public", import.meta.url)),
  plugins: [react()],
  resolve: { alias: { "@": fileURLToPath(new URL(".", import.meta.url)) } },
  server: { host: "127.0.0.1", port: 5173, strictPort: true, allowedHosts: ["terminal.local"] },
  preview: { host: "127.0.0.1", port: 5173, strictPort: true },
  build: { outDir: fileURLToPath(new URL("./dist-local", import.meta.url)), emptyOutDir: true },
});
