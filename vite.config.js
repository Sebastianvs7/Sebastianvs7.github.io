import { defineConfig } from "vite";
import { resolve } from "path";
import fs from "fs";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  root: "src",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(
          fileURLToPath(new URL(".", import.meta.url)),
          "src/index.html"
        ),
      },
    },
    copyPublicDir: true,
    assetsDir: "assets",
  },
  publicDir: false, // Disable default public dir
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "sass:math";`,
      },
    },
  },
  plugins: [
    {
      name: "copy-locales",
      generateBundle() {
        // Copy locales files to build output
        const localesDir = resolve(
          fileURLToPath(new URL(".", import.meta.url)),
          "src/locales"
        );
        const enContent = fs.readFileSync(
          resolve(localesDir, "en.json"),
          "utf-8"
        );
        const csContent = fs.readFileSync(
          resolve(localesDir, "cs.json"),
          "utf-8"
        );

        this.emitFile({
          type: "asset",
          fileName: "locales/en.json",
          source: enContent,
        });

        this.emitFile({
          type: "asset",
          fileName: "locales/cs.json",
          source: csContent,
        });
      },
    },
  ],
  server: {
    open: true,
    port: 3000,
  },
  base: "./", // Important for GitHub Pages
});
