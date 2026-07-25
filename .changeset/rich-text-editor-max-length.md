---
'@pixpilot/shadcn-ui': minor
---

Add an optional `maxLength` prop to `RichTextEditor`. When set, input past the limit is rejected and a `current / max` character counter is rendered below the content area (styleable via `slots.characterCount.className`). The editor root now also exposes `data-slot="rich-text-editor"`.
