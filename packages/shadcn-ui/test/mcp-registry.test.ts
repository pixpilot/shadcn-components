import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  findMissingMcpFiles,
  resolveMcpRegistryOptions,
} from '@internal/mcp/generate-mcp-registry';
import { describe, expect, it } from 'vitest';

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

describe('mcp registry coverage', () => {
  it('has an mcp.ts for every component folder', async () => {
    // If this fails, either add an mcp.ts to the listed component folder(s) and
    // run `pnpm run mcp:generate`, or add the folder name to the `exclude` list
    // in mcp.config.ts if it does not need MCP metadata.
    const options = await resolveMcpRegistryOptions(packageRoot);
    const missing = await findMissingMcpFiles(options);

    expect(missing).toEqual([]);
  });
});
