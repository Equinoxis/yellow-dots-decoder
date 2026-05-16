import path from "node:path";
import { fileURLToPath } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

import { cloudflare } from "@cloudflare/vite-plugin";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    nodePolyfills({
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
    tailwindcss(),
    cloudflare(),
  ],
  resolve: {
    alias: {
      // `jimp`'s package "browser" entry is a stub (`export {}`); use the real ESM build.
      jimp: path.resolve(__dirname, "node_modules/jimp/dist/esm/index.js"),
    },
  },
});