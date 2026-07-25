---
'@pixpilot/shadcn-ui': minor
---

Add optional `maxLength` and `autoFocus` props to `RichTextEditor`.

- `maxLength`: input past the limit is rejected and a `current / max` character counter is rendered below the content area (styleable via `slots.characterCount.className`).
- `autoFocus`: focus the editor on mount, accepting TipTap's `FocusPosition` (`true`/`'start'`/`'end'`/`'all'`/a document position). Defaults to `false`.

The editor root now also exposes `data-slot="rich-text-editor"`.
