import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  base: process.env.BASE_URL || "/",
  plugins: [vue()],
  resolve: {
    alias: {
      src: resolve(__dirname, "./src"),
      // "@composables": resolve(__dirname, "./src/composables"),
    },
  },
});
