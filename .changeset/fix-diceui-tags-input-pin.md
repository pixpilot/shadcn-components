---
"@pixpilot/shadcn": patch
---

Pin `@diceui/tags-input` to `0.7.2`. The `^0.7.2` range resolved to `0.7.3`, which depends on the never-published `@diceui/shared@0.12.1`, breaking every fresh install of the package (including `npx` runs of the MCP servers).
