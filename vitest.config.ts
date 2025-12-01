import process from 'node:process'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

import { WxtVitest } from 'wxt/testing'

const isWindows = process.platform === 'win32'

export default defineConfig({
  // TODO: remove any
  plugins: [WxtVitest() as any, react()],
  test: {
    ...(isWindows ? { pool: 'threads' } : {}),
    environment: 'node',
    globals: true,
    setupFiles: 'vitest.setup.ts',
    watch: false,
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'html', 'lcov'],
      // include: ['src/**/*.{ts,tsx}'],
      // exclude: ['src/**/*.spec.ts']
    },
  },
})
