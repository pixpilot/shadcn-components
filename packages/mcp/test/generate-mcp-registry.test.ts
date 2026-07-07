import { mkdirSync, writeFileSync } from 'node:fs';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { findMissingMcpFiles } from '../src/generate-mcp-registry';

let packageRoot: string;

function createComponent(name: string, withMeta: boolean): void {
  const dir = path.join(packageRoot, 'src', 'components', name);
  mkdirSync(dir, { recursive: true });
  if (withMeta) {
    // The presence check only looks for the file, not its contents.
    writeFileSync(path.join(dir, 'mcp.ts'), 'export const meta = {};\n');
  }
}

beforeEach(async () => {
  packageRoot = await mkdtemp(path.join(tmpdir(), 'mcp-registry-'));
  mkdirSync(path.join(packageRoot, 'src', 'components'), { recursive: true });
});

afterEach(async () => {
  await rm(packageRoot, { recursive: true, force: true });
});

describe('findMissingMcpFiles', () => {
  it('returns folders that have no mcp.ts file', async () => {
    createComponent('input', true);
    createComponent('button', false);
    createComponent('select', false);

    const missing = await findMissingMcpFiles({ packageRoot });

    expect(missing).toEqual(['button', 'select']);
  });

  it('ignores folders listed in exclude', async () => {
    createComponent('input', true);
    createComponent('context', false);

    const missing = await findMissingMcpFiles({
      packageRoot,
      exclude: ['context'],
    });

    expect(missing).toEqual([]);
  });

  it('returns an empty array when the components directory is absent', async () => {
    await rm(path.join(packageRoot, 'src', 'components'), {
      recursive: true,
      force: true,
    });

    const missing = await findMissingMcpFiles({ packageRoot });

    expect(missing).toEqual([]);
  });

  it('honours a custom componentsDir', async () => {
    const dir = path.join(packageRoot, 'src', 'ui', 'card');
    mkdirSync(dir, { recursive: true });

    const missing = await findMissingMcpFiles({
      packageRoot,
      componentsDir: 'ui',
    });

    expect(missing).toEqual(['card']);
  });
});
