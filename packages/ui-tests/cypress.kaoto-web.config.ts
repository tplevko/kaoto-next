import { defineConfig } from 'cypress';

export default defineConfig({
  video: true,

  e2e: {
    // Only pick up specs written for the kaoto-web Carbon shell.
    specPattern: 'cypress/e2e/kaoto-web/**/*.{js,jsx,ts,tsx}',

    // Lean support file — does not import the PF-specific command set.
    supportFile: 'cypress/support/e2e.kaoto-web.ts',

    // kaoto-web runs on port 5174 by default (vite dev) and 4174 (vite preview).
    // Override at runtime with --config baseUrl=<url>.
    baseUrl: 'http://localhost:5174',

    viewportWidth: 1920,
    viewportHeight: 1080,
    chromeWebSecurity: false,
    defaultCommandTimeout: 8000,
  },
});
