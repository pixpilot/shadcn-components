# Storybook

This package contains the Storybook configuration for the shadcn-components monorepo.

## Overview

Storybook is set up at the root level in `/tooling/storybook` and automatically discovers stories from all packages in the monorepo.

## Directory Structure

```
tooling/storybook/
├── .storybook/
│   ├── main.ts              # Storybook configuration
│   ├── preview.ts           # Global decorators and parameters
│   ├── middleware.mjs       # Express middleware for icon API
│   └── globals.css          # Global styles
├── package.json
├── tsconfig.json
├── tailwind.config.ts       # Tailwind CSS configuration
└── postcss.config.js        # PostCSS configuration
```

## Story Location

Stories should be placed in a `stories` folder at the root of each package:

```
packages/
├── shadcn-ui/
│   ├── src/              # Component source files
│   └── stories/          # Storybook stories
│       ├── Button.stories.tsx
│       ├── Alert.stories.tsx
│       └── README.md
└── shadcn-auth/
    ├── src/              # Component source files
    └── stories/          # Storybook stories
        ├── SignInForm.stories.tsx
        └── README.md
```

## Running Storybook

### Development Mode

Start the Storybook development server:

```bash
# From the repository root
pnpm storybook

# Or directly from this package
pnpm --filter @internal/storybook storybook
```

This will start Storybook at `http://localhost:6006`

### Build Static Storybook

Build a static version of Storybook for deployment:

```bash
# From the repository root
pnpm build-storybook

# Or directly from this package
pnpm --filter @internal/storybook build-storybook
```

The static files will be generated in `storybook-static/`

## Creating Stories

### Story File Template

Create a new story file in your package's `stories/` folder:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { MyComponent } from '../src/MyComponent';

/**
 * Component description for documentation
 */
const meta = {
  title: 'package-name/MyComponent',
  component: MyComponent,
  parameters: {
    layout: 'centered', // or 'padded', 'fullscreen'
  },
  tags: ['autodocs'],
  argTypes: {
    propName: {
      control: 'text',
      description: 'Prop description',
    },
  },
} satisfies Meta<typeof MyComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default story showing basic usage
 */
export const Default: Story = {
  args: {
    propName: 'value',
  },
};

/**
 * Another variant of the component
 */
export const Variant: Story = {
  args: {
    propName: 'different value',
  },
};
```

## Features

### Theme Support

Storybook is configured with theme switching support:

- Light theme
- Dark theme

Use the theme toggle in the toolbar to switch between themes.

### Icon Server Configuration

Storybook includes a built-in Iconify API endpoint for serving icon data. This allows components using the `IconSelector` to work offline or with custom icon collections.

#### How It Works

1. **Local Storybook Endpoint** (Default):
   - By default, Storybook provides icon data via `http://localhost:6006/api/iconify`
   - Icons are served from `@iconify-json/*` packages installed in the project
   - Supports Material Design Icons (`mdi`) and other Iconify collections

2. **Custom Icon Server**:
   - You can use your own icon server or the public Iconify API
   - Set the `STORYBOOK_ICONIFY_SERVER` environment variable to point to a custom server

#### Configuration

The icon server configuration is in `.storybook/preview.ts`:

```typescript
import { addAPIProvider } from '@iconify/react';

// Default: uses local Storybook endpoint
const iconifyServer =
  process.env.STORYBOOK_ICONIFY_SERVER || 'http://localhost:6006/api/iconify';

addAPIProvider('local', {
  resources: [iconifyServer],
});
```

#### Usage Examples

**Using the Default Local Server:**

```bash
# Just run Storybook normally
pnpm storybook
```

The IconSelector component will fetch icons from the local middleware at `http://localhost:6006/api/iconify`.

**Using Your Own Icon Server:**

```bash
# Windows PowerShell
$env:STORYBOOK_ICONIFY_SERVER = "https://your-icon-server.com/api/icons"
pnpm storybook

# Linux/macOS
STORYBOOK_ICONIFY_SERVER=https://your-icon-server.com/api/icons pnpm storybook
```

**Using the Public Iconify API:**

```bash
# Windows PowerShell
$env:STORYBOOK_ICONIFY_SERVER = "https://api.iconify.design"
pnpm storybook

# Linux/macOS
STORYBOOK_ICONIFY_SERVER=https://api.iconify.design pnpm storybook
```

#### Icon Server Middleware

The local icon server is implemented in `.storybook/middleware.mjs` and provides:

- **GET /api/iconify** - Returns icon data
  - Query parameters:
    - `prefix` (default: `mdi`) - Icon set prefix (e.g., `mdi`, `fa`, `bi`)
    - `icons` - Comma-separated list of icon names to fetch (optional)

Example requests:

```
http://localhost:6006/api/iconify?prefix=mdi                    # All Material Design Icons
http://localhost:6006/api/iconify?prefix=mdi&icons=home,search  # Specific icons
http://localhost:6006/api/iconify?prefix=fa                     # Font Awesome icons
```

#### Available Icon Sets

By default, the following icon sets are available if installed:

- `@iconify-json/mdi` - Material Design Icons
- `@iconify-json/fa` - Font Awesome
- `@iconify-json/bi` - Bootstrap Icons
- And any other `@iconify-json/*` packages in your dependencies

Check `package.json` to see which icon sets are installed.

### Styling

Storybook is configured with theme switching support:

- Light theme
- Dark theme

Use the theme toggle in the toolbar to switch between themes.

- **Tailwind CSS**: Fully configured with the same settings as the component packages
- **CSS Variables**: Supports all shadcn/ui CSS variables for theming
- **Global Styles**: Imports `globals.css` from the shadcn package

### Addons

The following Storybook addons are installed:

- **@storybook/addon-essentials**: Core addons (controls, actions, viewport, backgrounds, docs, etc.)
- **@storybook/addon-interactions**: Test user interactions
- **@storybook/addon-links**: Navigate between stories
- **@storybook/addon-themes**: Theme switching support
- **@chromatic-com/storybook**: Visual testing with Chromatic

## Configuration

### main.ts

Configures:

- Story file patterns: `packages/*/stories/**/*.stories.tsx`
- Framework: React with Vite
- Addons and features

### preview.ts

Configures:

- Global decorators (theme switcher)
- Default parameters
- Control matchers
- Background colors

### Tailwind CSS

The Tailwind configuration matches the component packages and includes:

- Content paths for all package stories
- CSS variables for theming
- shadcn/ui color system
- Custom animations and keyframes

## Tips

1. **Organize stories by feature**: Use the `title` property to create a hierarchy
2. **Use autodocs**: Add the `'autodocs'` tag to auto-generate documentation
3. **Add descriptions**: Use JSDoc comments above stories for better documentation
4. **Test interactions**: Use `@storybook/test` to write interaction tests
5. **Use args**: Define component props as args for interactive controls

## Learn More

- [Storybook Documentation](https://storybook.js.org/docs)
- [Writing Stories](https://storybook.js.org/docs/writing-stories)
- [Component Story Format (CSF)](https://storybook.js.org/docs/api/csf)
