import { defineMcpRegistryConfig } from '@internal/mcp/generate-mcp-registry';

/**
 * Configuration for the MCP registry generator (`pnpm run mcp:generate`).
 *
 * In this package each component lives in its own folder directly under `src`
 * (there is no `src/components` directory), so the generator scans `src` itself.
 * Every component folder must contain an `mcp.ts` file that exports its `meta`
 * so the component is exposed to the MCP server. Folders that intentionally do
 * not ship an `mcp.ts` file (generated output, shared hooks, utilities and other
 * internal helpers) must be listed in `exclude`, otherwise generation and the
 * registry test will fail.
 */
export default defineMcpRegistryConfig({
  // Scan folders directly under `src` instead of the default `src/components`.
  componentsDir: '.',
  exclude: [
    // Auto-generated registry output — not a component.
    'generated',
    // MCP server plumbing folder — not a component.
    'mcp',
    // Shared React hooks — not standalone components.
    'hooks',
    // Shared utility helpers — not standalone components.
    'utils',
    // Internal command list used by combobox/select — not part of the public API.
    'command-option-list',
    // Shared overlay-registry base used by dialog-provider and drawer-provider —
    // internal plumbing, not a standalone component.
    'overlay-provider',
  ],
});
