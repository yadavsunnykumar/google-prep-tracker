import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5002",
        changeOrigin: true,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-tiptap": [
            "@tiptap/react",
            "@tiptap/starter-kit",
            "@tiptap/extension-underline",
            "@tiptap/extension-code-block-lowlight",
            "@tiptap/extension-placeholder",
            "lowlight",
          ],
          "vendor-monaco": ["@monaco-editor/react"],
          "vendor-react": ["react", "react-dom"],
        },
      },
    },
  },
});
