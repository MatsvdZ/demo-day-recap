import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Relative asset paths, so the built site works both at
  // matsvanderzwan.github.io/demo-day-recap/ and on a custom domain root.
  base: "./",
});
