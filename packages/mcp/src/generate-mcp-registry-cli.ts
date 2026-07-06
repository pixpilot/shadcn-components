import process from 'node:process';
import { generateMcpRegistry } from './generate-mcp-registry';

/** CLI entrypoint used by package build scripts to regenerate MCP metadata. */
async function main(): Promise<void> {
  await generateMcpRegistry({
    packageRoot: process.cwd(),
  });
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`Failed to generate MCP registry: ${message}\n`);
  process.exit(1);
});
