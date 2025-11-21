# Copilot Instructions

- Only use pnpm for installing or managing dependencies in this project. Do not use npm, yarn, or any other package manager.
- This is a monorepo powered by Turbo and pnpm.

## Commenting

- If a comment is long, write it as a multi-line comment and break lines for readability.

## Testing

This project uses Vitest for testing.

# File Naming Conventions

## JavaScript/TypeScript

- **File Naming:** Use kebab-case for almost all files, including those whose main export is a PascalCase class.
  - Example: `my-module.ts`, `helper-functions.js`, `data-handler.js`
- **Frontend UI Components (React/Vue only):** Use PascalCase for component files (e.g., `MyButton.tsx`).
  - Example: `MyButton.tsx`, `UserProfile.vue`
- **Config files:** Use kebab-case unless the framework or library has a different standard—follow the convention for that tool.
  - Example: `tsconfig.json`
