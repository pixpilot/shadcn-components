import type { ComponentMeta } from '@internal/mcp';
import { defineProps } from '@internal/mcp';

// The dialog-provider folder no longer ships a React `DialogProvider` component;
// it is a dialog-named facade over the generic overlay provider. Mounting is done
// once with `<OverlayProvider>`. This MCP entry is named after the real exported
// `registerDialog` function (not a phantom `DialogProvider`) and documents the
// imperative dialog API (registerDialog / showDialog / useDialog / the `dialog`
// registry facade). There are no props to document, so the prop set is `never`.
export const meta: ComponentMeta<never> = {
  name: 'registerDialog',
  category: 'Overlays',
  description:
    'Imperative dialog API built on the overlay provider (there is no `DialogProvider` component — mount `OverlayProvider`). `registerDialog(id, Component, defaultProps?)` registers a dialog once so you can open it from anywhere with a typed `show(props)` call — no JSX trigger or local open state. The same folder also exports `showDialog`, the `dialog` registry facade, and the `useDialog` hook.',
  props: defineProps<never>({}),
  notes: [
    'Mount `<OverlayProvider>` once near the app root; this facade shares that single provider with the drawer imperative API (`registerDrawer`). There is no separate DialogProvider component to render.',
    '`registerDialog(id, Component, defaultProps?)` returns a typed controller — call `controller.show(props)` (resolves when the dialog closes), `controller.hide()`, and `controller.remove()`. Props passed as `defaultProps` become optional in `show`.',
    'The registered component receives controlled `open` and `onOpenChange` props automatically (wrapped with NiceModal), so it does not manage its own open state.',
    '`showDialog(id, props?)` opens a dialog by id when the typed controller is not in scope; prefer `registerDialog(...).show(...)` when the component is available in the same module.',
    'The `dialog` facade groups the same operations under one import: `dialog.register`, `dialog.show`, `dialog.hide`, `dialog.remove`, `dialog.unregister`.',
    '`useDialog()` (alias of `useOverlay`) reads dialog state from inside a component.',
  ],
  examples: [
    {
      title: 'Register and show with a typed controller',
      code: "const projectDialog = registerDialog('project-dialog', ProjectDialog, { mode: 'edit' });\nawait projectDialog.show({ projectId: 'project-1' });",
    },
    {
      title: 'Open a dialog by id from anywhere',
      code: "await showDialog('project-dialog', { projectId: 'project-2' });",
    },
    {
      title: 'The `dialog` registry facade',
      code: "const projectDialog = dialog.register('project-dialog', ProjectDialog);\nawait projectDialog.show({ projectId: 'project-1' });\ndialog.unregister('project-dialog');",
    },
  ],
  related: ['OverlayProvider', 'registerDrawer', 'Dialog', 'ConfirmationDialog'],
  keywords: [
    'dialog',
    'provider',
    'modal',
    'imperative',
    'show-dialog',
    'register-dialog',
    'use-dialog',
    'overlay',
    'dialog-provider',
  ],
};
