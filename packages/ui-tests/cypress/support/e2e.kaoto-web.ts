// Support file for the kaoto-web Cypress project.
// Intentionally minimal — the kaoto-web app uses a Carbon shell, not the
// PatternFly shell used by @kaoto/kaoto, so the heavy command set in
// next-commands/* (cy.openHomePage, cy.waitSchemasLoading, etc.) is not
// loaded here to avoid misleading autocompletion and accidental misuse.

import { register as registerCypressGrep } from '@cypress/grep';

registerCypressGrep();

// Swallow uncaught exceptions so a background error in the app does not
// abort the test unexpectedly (matches the behaviour of the main suite).
Cypress.on('uncaught:exception', (_err, _runnable) => {
  return false;
});
