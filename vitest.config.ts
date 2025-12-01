import process from "node:process"
import react from "@vitejs/plugin-react"
import { configDefaults, defineConfig } from "vitest/config"

import { WxtVitest } from "wxt/testing"

const isWindows = process.platform === "win32"

export default defineConfig({
  plugins: [...await WxtVitest(), react()],
  test: {
    exclude: [...configDefaults.exclude, "**/.claude/**", "**/repos/**"],
    ...(isWindows ? { pool: "threads", testTimeout: 15000 } : {}),
    environment: "node",
    globals: true,
    setupFiles: "vitest.setup.ts",
    watch: false,
    coverage: {
      provider: "istanbul",
      reporter: ["text", "html", "lcov"],
      // include: ['src/**/*.{ts,tsx}'],
      // exclude: ['src/**/*.spec.ts']
    },
  },
})
