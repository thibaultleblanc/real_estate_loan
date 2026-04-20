import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

function getGithubPagesBase() {
  const repositorySlug = process.env.GITHUB_REPOSITORY;
  if (!repositorySlug) {
    return "/";
  }

  const [, repositoryName] = repositorySlug.split("/");
  if (!repositoryName || repositoryName.endsWith(".github.io")) {
    return "/";
  }

  return `/${repositoryName}/`;
}

// https://vite.dev/config/
export default defineConfig({
  base:
    process.env.GITHUB_ACTIONS === "true" ? getGithubPagesBase() : "/",
  plugins: [react()],
  server: {
    hmr: {
      host: process.env.VITE_HMR_HOST || "localhost",
      port: parseInt(process.env.VITE_HMR_PORT || "5173"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
    include: ["src/**/*.test.{js,jsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
    },
  },
});
