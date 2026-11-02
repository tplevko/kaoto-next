// Ambient declarations (`*.scss` side-effect imports, build-time globals) this entry point needs
// when another package consumes it as TypeScript source.
/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="./vite-env.d.ts" />
/* eslint-enable @typescript-eslint/triple-slash-reference */
/// <reference types="vite/client" />

// Internal components exported for testing only (e.g. Storybook stories in @kaoto/kaoto-tests).
export { KaotoAboutModal } from './components/About/KaotoAboutModal';
export { ErrorState } from './components/ErrorState/ErrorState';
export { LoadingState } from './components/LoadingState/LoadingState';
