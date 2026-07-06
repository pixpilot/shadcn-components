#!/usr/bin/env node
import process from 'node:process';
import { startComponentMcpServer } from '@internal/mcp/server';
import { mcpRegistry } from './generated/mcp-registry';

startComponentMcpServer({
  packageName: '@pixpilot/formily-shadcn',
  packageVersion: '1.14.2',
  registry: mcpRegistry,
}).catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(
    `Failed to start @pixpilot/formily-shadcn MCP server: ${message}\n`,
  );
  process.exit(1);
});
