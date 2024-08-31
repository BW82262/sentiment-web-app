import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/sentiment-web-app/",
  plugins: [react()],
});
