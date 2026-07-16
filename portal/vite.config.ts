import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "node:path";
import { seoInject } from "./vite-seo-plugin";

export default defineConfig({
  base: "/jvd/portal/",
  plugins: [react(), tailwindcss(), tsconfigPaths(), seoInject()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  server: { host: "::", port: 8080, strictPort: true },
});
