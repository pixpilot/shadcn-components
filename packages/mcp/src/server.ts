import type { ComponentMeta, ComponentRegistry } from './types';
import process from 'node:process';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod/v4';

const JSON_INDENT = 2;

/** Configuration needed to expose a component registry as an MCP server. */
export interface ComponentMcpServerOptions<TRegistry extends ComponentRegistry> {
  /** Package name shown to MCP clients and used in tool descriptions. */
  packageName: string;
  /** Package version reported to MCP clients. */
  packageVersion: string;
  /** Generated component metadata registry for the package. */
  registry: TRegistry;
}

function jsonToolResult<TData extends Record<string, unknown>>(data: TData) {
  return {
    content: [
      {
        type: 'text' as const,
        text: JSON.stringify(data, null, JSON_INDENT),
      },
    ],
    structuredContent: data,
  };
}

function getComponentByName<TRegistry extends ComponentRegistry>(
  registry: TRegistry,
  name: string,
): ComponentMeta | undefined {
  if (!Object.hasOwn(registry, name)) {
    return undefined;
  }

  return registry[name];
}

/** Creates an MCP server with generic component listing and detail tools. */
export function createComponentMcpServer<TRegistry extends ComponentRegistry>({
  packageName,
  packageVersion,
  registry,
}: ComponentMcpServerOptions<TRegistry>): McpServer {
  const components = Object.values(registry);
  const server = new McpServer({
    name: packageName,
    version: packageVersion,
  });

  server.registerTool(
    'list_components',
    {
      title: 'List components',
      description: `List registered ${packageName} components.`,
    },
    async () =>
      jsonToolResult({
        components: components.map(({ name, category, description }) => ({
          name,
          category,
          description,
        })),
      }),
  );

  server.registerTool(
    'get_component_details',
    {
      title: 'Get component details',
      description: `Get the full MCP metadata object for a registered ${packageName} component.`,
      inputSchema: {
        name: z.string().min(1),
      },
    },
    async ({ name }: { name: string }) => {
      const component = getComponentByName(registry, name);

      if (!component) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Component "${name}" is not registered.`,
            },
          ],
          isError: true,
        };
      }

      return jsonToolResult({ component });
    },
  );

  return server;
}

/** Starts the generic component MCP server over stdio for package bin entrypoints. */
export async function startComponentMcpServer<TRegistry extends ComponentRegistry>(
  options: ComponentMcpServerOptions<TRegistry>,
): Promise<void> {
  try {
    const server = createComponentMcpServer(options);
    const transport = new StdioServerTransport();

    await server.connect(transport);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Failed to start ${options.packageName} MCP server: ${message}`);
    process.exit(1);
  }
}
