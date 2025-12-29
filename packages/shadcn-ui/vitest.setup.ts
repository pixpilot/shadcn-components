/* eslint-disable ts/no-unsafe-member-access */
/* eslint-disable ts/no-empty-function */
// Vitest + JSDOM doesn't provide ResizeObserver by default.
// Some Radix components (e.g. Slider) rely on it.

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

(globalThis as any).ResizeObserver ??= ResizeObserver;
