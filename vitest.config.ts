// ABOUTME: Vitest configuration file for testing Vue components and TypeScript code
// ABOUTME: Sets up test environment with Vue support and JSDOM for browser simulation
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts']
  }
})