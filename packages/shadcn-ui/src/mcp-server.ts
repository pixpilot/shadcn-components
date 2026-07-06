#!/usr/bin/env node
import process from 'node:process';
import { startComponentMcpServer } from '@internal/mcp/server';
import { mcpRegistry } from './generated/mcp-registry';

startComponentMcpServer({
  packageName: '@pixpilot/shadcn-ui',
  packageVersion: '1.37.0',
  registry: mcpRegistry,
}).catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`Failed to start @pixpilot/shadcn-ui MCP server: ${message}\n`);
  process.exit(1);
});
