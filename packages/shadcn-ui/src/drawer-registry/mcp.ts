import type { ComponentMeta } from '@internal/mcp';
import { defineProps } from '@internal/mcp';

// The drawer-provider folder no longer ships a React `DrawerProvider` component;
// it is a drawer-named facade over the generic overlay provider. Mounting is done
// once with `<OverlayProvider>`. This MCP entry is named after the real exported
// `registerDrawer` function (not a phantom `DrawerProvider`) and documents the
// imperative drawer API (registerDrawer / showDrawer / useDrawer / the `drawer`
// registry facade). There are no props to document, so the prop set is `never`.
export const meta: ComponentMeta<never> = {
  name: 'registerDrawer',
  category: 'Overlays',
  description:
    'Imperative drawer API built on the overlay provider (there is no `DrawerProvider` component — mount `OverlayProvider`). `registerDrawer(id, Component, defaultProps?)` registers a drawer once so you can open it from anywhere with a typed `show(props)` call — no JSX trigger or local open state. The same folder also exports `showDrawer`, the `drawer` registry facade, and the `useDrawer` hook.',
  props: defineProps<never>({}),
  notes: [
    'Mount `<OverlayProvider>` once near the app root; this facade shares that single provider with the dialog imperative API (`registerDialog`). There is no separate DrawerProvider component to render.',
    '`registerDrawer(id, Component, defaultProps?)` returns a typed controller — call `controller.show(props)` (resolves when the drawer closes), `controller.hide()`, and `controller.remove()`. Props passed as `defaultProps` become optional in `show`.',
    'The registered component receives controlled `open` and `onOpenChange` props automatically (wrapped with NiceModal), so it does not manage its own open state.',
    '`showDrawer(id, props?)` opens a drawer by id when the typed controller is not in scope; prefer `registerDrawer(...).show(...)` when the component is available in the same module.',
    'The `drawer` facade groups the same operations under one import: `drawer.register`, `drawer.show`, `drawer.hide`, `drawer.remove`, `drawer.unregister`.',
    '`useDrawer()` (alias of `useOverlay`) reads drawer state from inside a component.',
  ],
  examples: [
    {
      title: 'Register and show with a typed controller',
      code: "const filtersDrawer = registerDrawer('filters-drawer', FiltersDrawer, { direction: 'right' });\nawait filtersDrawer.show({ category: 'shoes' });",
    },
    {
      title: 'Open a drawer by id from anywhere',
      code: "await showDrawer('filters-drawer', { category: 'bags' });",
    },
    {
      title: 'The `drawer` registry facade',
      code: "const filtersDrawer = drawer.register('filters-drawer', FiltersDrawer);\nawait filtersDrawer.show({ category: 'shoes' });\ndrawer.unregister('filters-drawer');",
    },
  ],
  related: ['OverlayProvider', 'registerDialog', 'Drawer', 'ConfirmationDialog'],
  keywords: [
    'drawer',
    'provider',
    'sheet',
    'imperative',
    'show-drawer',
    'register-drawer',
    'use-drawer',
    'overlay',
    'drawer-provider',
  ],
};
