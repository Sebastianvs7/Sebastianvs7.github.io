import { defineConfig } from "vite";
import { resolve } from "path";
import { createHtmlPlugin } from "vite-plugin-html";
import fs from "fs";
import { fileURLToPath, URL } from "node:url";

// Helper function to read HTML files
const readHtmlFile = (path) => {
  try {
    return fs.readFileSync(
      resolve(fileURLToPath(new URL(".", import.meta.url)), path),
      "utf-8"
    );
  } catch (error) {
    console.warn(`Could not read file: ${path}`);
    return "";
  }
};

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
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "sass:math";`,
      },
    },
  },
  plugins: [
    createHtmlPlugin({
      minify: false, // Disable minify for development
      inject: {
        data: {
          header: readHtmlFile("src/components/header.html"),
          intro: readHtmlFile("src/components/intro.html"),
          projects: readHtmlFile("src/components/projects.html"),
          experiences: readHtmlFile("src/components/experiences.html"),
          contact: readHtmlFile("src/components/contact.html"),
        },
      },
    }),
  ],
  server: {
    open: true,
    port: 3000,
  },
  base: "./", // Important for GitHub Pages
});
