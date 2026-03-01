import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const indexPath = resolve(__dirname, '../src/components/ui/index.ts');
const content = readFileSync(indexPath, 'utf8');

describe('ui index exports', () => {
  it('does not re-export ./form', () => {
    expect(content).not.toMatch(/export\s*\*\s*from\s*['"]\.\/form['"]/);
  });
});
