// Re-export the UI form components from their implementation location.
// This file exists so the package can provide a stable subpath
// import (e.g. `@pixpilot/shadcn/form`) that builds to
// `dist/form/index.js` during `tsdown` compilation.
export * from '../components/ui/form';
