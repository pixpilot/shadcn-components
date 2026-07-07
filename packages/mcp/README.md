# mcp

This package provides a local stdio MCP server for coding assistants that support the Model Context Protocol.

## Usage

Consuming packages start the server from a bin entrypoint:

```ts
#!/usr/bin/env node
import { startComponentMcpServer } from '@internal/mcp/server';
import { mcpRegistry } from './generated/mcp-registry';

startComponentMcpServer({
  packageName: '@pixpilot/shadcn-ui',
  packageVersion: '1.37.0',
  registry: mcpRegistry,
});
```

Each component's own metadata is authored next to its source in a `mcp.ts` file:

```ts
import type { ComponentMeta, OwnProps } from '@internal/mcp';
import type { MyComponentProps } from './MyComponent';
import { defineProps } from '@internal/mcp';

// Do not hardcode the props type here, because it will be duplicated in the component's own source. Instead, import the props type from the component's source file.
type ComponentOwnProps = OwnProps<MyComponentProps, 'div'>;

export const meta: ComponentMeta<ComponentOwnProps> = {
  name: 'MyComponent',
  category: 'Actions',
  description:
    'An example component that demonstrates how to define metadata for a component in a TypeScript project.',
  htmlElement: 'div',
  props: defineProps<MyComponentProps>({
    prop1: {
      type: 'string',
      description: 'A string prop for the component.',
      defaultValue: 'default value',
    },
  }),
  examples: [
    {
      title: 'Default Component',
      code: '<MyComponent>Hello World</MyComponent>',
    },
  ],
  keywords: ['component', 'example', 'typescript'],
};
```

These `meta` exports are collected into a registry at build time and served by three MCP tools.

## Generating the registry

The registry at `src/generated/mcp-registry.ts` is **auto-generated — do not edit it by hand.** Run the generator whenever you add, remove, or rename a component:

```json
{
  "scripts": {
    "mcp:generate": "tsx ../mcp/src/generate-mcp-registry-cli.ts"
  }
}
```

The generator scans every folder in `src/components` and expects each to export a `meta` from an `mcp.ts` file. **If a component folder is missing `mcp.ts`, generation fails** with the list of offending folders — this is the reminder to add metadata for a newly added component.

Folders that intentionally have no `mcp.ts` (shared helpers, contexts, internal utilities) must be listed in an optional `mcp.config.ts` at the package root:

```ts
import { defineMcpRegistryConfig } from '@internal/mcp/generate-mcp-registry';

export default defineMcpRegistryConfig({
  // Folder names inside src/components that do not need MCP metadata.
  exclude: ['array-common', 'context'],
  // Optional: change the folder scanned (relative to src). Defaults to 'components'.
  // componentsDir: 'components',
});
```

The same check is exposed as `findMissingMcpFiles(options)` so packages can add a test that fails in CI when a component folder is missing its `mcp.ts` (see `test/mcp-registry.test.ts` in the consuming package).

## What the AI receives

The server exposes three tools. Each returns the same JSON both as a `text` content block and as `structuredContent`, so an AI client can read either the raw text or the parsed object.

### `list_components`

Takes no input. Returns just the names of every registered component, so the AI can discover what's available without pulling in categories, descriptions, or full prop tables:

```json
{
  "components": ["Accordion", "Alert", "Button", "Card", "Dialog", "Input"]
}
```

### `search_components`

Takes `{ "query": string, "limit"?: number }` (default `limit` is `10`) and returns components ranked by relevance. It scores each component against its name, category, keywords, and description, with light typo tolerance on the name, so the AI can find the right component from a fuzzy description. An empty `query` returns an alphabetical list.

```json
{
  "results": [
    {
      "name": "Button",
      "category": "Actions",
      "description": "A shadcn button wrapper with variant styling, optional slot rendering, and disabled-click overlay support.",
      "score": 100
    }
  ]
}
```

### `get_component_details`

Takes `{ "name": "Button" }` and returns the full `ComponentMeta` object for that component, e.g.:

```json
{
  "component": {
    "name": "Button",
    "category": "Actions",
    "description": "A shadcn button wrapper with variant styling, optional slot rendering, and disabled-click overlay support.",
    "htmlElement": "button",
    "props": {
      "asChild": {
        "description": "Render the button behavior and styles through the child element instead of a native button.",
        "type": "boolean",
        "defaultValue": "false"
      },
      "variant": {
        "description": "Controls the visual button treatment.",
        "type": "\"default\" | \"destructive\" | \"outline\" | \"secondary\" | \"ghost\" | \"link\"",
        "defaultValue": "\"default\""
      },
      "size": {
        "description": "Controls the button dimensions and icon-only sizing.",
        "type": "\"default\" | \"xs\" | \"sm\" | \"lg\" | \"icon\" | \"icon-xs\" | \"icon-sm\" | \"icon-lg\"",
        "defaultValue": "\"default\""
      }
    },
    "examples": [
      {
        "title": "Default button",
        "code": "<Button>Save changes</Button>"
      },
      {
        "title": "Disabled reason",
        "code": "<Button disabled title=\"Complete required fields first\" onDisabledClick={() => showHelp()}>Publish</Button>"
      }
    ],
    "keywords": ["button", "action", "cta"]
  }
}
```

If `name` doesn't match a registered component, the tool returns an error result instead:

```json
{
  "content": [{ "type": "text", "text": "Component \"Foo\" is not registered." }],
  "isError": true
}
```

This gives the AI everything it needs to pick the right component (`list_components`) and then write correct, idiomatic usage (`get_component_details`) — props, types, defaults, and copy-pasteable examples — without having to read the component's source.
