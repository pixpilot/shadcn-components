import { defineMcpRegistryConfig } from '@internal/mcp/generate-mcp-registry';

/**
 * Configuration for the MCP registry generator (`pnpm run mcp:generate`).
 *
 * Every folder inside `src/components` must contain an `mcp.ts` file so the
 * component is exposed to the MCP server. Folders that intentionally do not
 * ship an `mcp.ts` file (shared helpers, contexts, internal utilities) must be
 * listed in `exclude`, otherwise generation and the registry test will fail.
 */
export default defineMcpRegistryConfig({
  exclude: [
    // Shared array helpers/hooks — not a standalone component.
    'array-common',
    // React context providers/consumers — not a standalone component.
    'context',
    // Shared overlay helpers/hooks (trigger, open state, validation) — not a standalone component.
    'overlay-common',
  ],
});
