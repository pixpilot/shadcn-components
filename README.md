# pnpm-turbo-monorepo-template

> ⚠️ **Opinionated Template:**
> This monorepo template is designed for our internal standards and workflows. Feel free to use, adapt, and extend it for your own projects.

A modern TypeScript monorepo template for npm packages, managed with pnpm and TurboRepo.

## ✨ Features

- Monorepo structure with workspaces
- TypeScript support
- Linting and formatting with ESLint and Prettier
- Easy dependency management with pnpm

## 🚀 Getting Started

1. Run setup after cloning:
   ```sh
   pnpm run setup
   ```
2. Build all packages:
   ```sh
   pnpm build
   ```
3. Run tests:
   ```sh
   pnpm test
   ```

## 📦 Packages

- First, ensure the repository URL is included in the root `package.json`. This allows Turbo to automatically set the `repository` property for packages in the monorepo:

  ```json
  {
    "repository": {
      "type": "git",
      "url": "https://github.com/user/repo.git"
    }
  }
  ```

- [packages/example-package](packages/example-package) – Example package included by default. You can remove this and run `pnpm run turbo:gen:init` to generate a new package for your monorepo.

### 🏷️ Package Naming Convention

In this template, we use `@pixpilot` as a placeholder for package names. As a user, you might want to replace it with your own organization or project name.

## 🚢 Releases

### 🤖 Automated Release (Recommended)

This monorepo uses the [Changeset Autopilot GitHub Action](https://github.com/pixpilot/changesets-autopilot) for fully automated, dependency-aware versioning and publishing. It:

- Detects conventional commits and generates changesets automatically
- Handles branch-based release channels (main, next, beta, etc.)
- Versions and publishes only changed packages to npm
- Manages pre-releases and dist-tags
- Runs entirely in CI for maximum reliability

**How it works:**

- On every push to a release branch, the action analyzes commits, generates changesets, versions packages, and publishes to npm.
- No manual steps are needed—just follow the conventional commit format and push to the correct branch.
- See the [Changeset Autopilot documentation](https://github.com/pixpilot/changesets-autopilot) for setup and configuration details.

### 📝 Manual Release

Manual releases are possible if needed (for example, for hotfixes or if CI is unavailable):

1. Ensure you have an `NPM_TOKEN` with publish rights set in your environment (for CI/CD, set as a secret).
2. Run the following commands from the root:
   ```sh
   pnpm changeset
   pnpm changeset version
   pnpm changeset publish
   ```
   This will version and publish only those workspace packages with relevant changes.

- Each package is versioned independently.
- Git tags are created in the format `<package-name>-<version>`.
- See `.changeset/config.json` for configuration details.

For more, see the [Changesets documentation](https://github.com/changesets/changesets).

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📄 License

[MIT](LICENSE)
