---
'@pixpilot/shadcn-ui': patch
---

`ThemeModeSwitchInside` no longer causes a hydration mismatch: until it mounts in the browser it keeps its space but stays hidden and unchecked, then shows the real theme.
