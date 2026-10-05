/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base moet overeenkomen met de repo-naam voor GitHub Pages.
export default defineConfig({
  base: '/Onboardingapp-Kyocera/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    css: false,
  },
})
