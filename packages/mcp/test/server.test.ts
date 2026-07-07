import type { ComponentMeta, ComponentRegistry } from '../src/types';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { beforeEach, describe, expect, it } from 'vitest';

import { createComponentMcpServer } from '../src/server';

function meta(name: string, category: string, keywords: string[] = []): ComponentMeta {
  return {
    name,
    category,
    description: `${name} description.`,
    keywords,
    props: {},
    examples: [],
  };
}

const registry: ComponentRegistry = {
  Button: meta('Button', 'Actions'),
  Card: meta('Card', 'Layout'),
  Accordion: meta('Accordion', 'Disclosure'),
  Alert: meta('Alert', 'Feedback'),
  Dialog: meta('Dialog', 'Overlay', ['modal', 'popup']),
  Input: meta('Input', 'Forms'),
};

async function connectClient(reg: ComponentRegistry): Promise<Client> {
  const server = createComponentMcpServer({
    packageName: '@test/components',
    packageVersion: '1.0.0',
    registry: reg,
  });
  const client = new Client({ name: 'test-client', version: '1.0.0' });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);

  return client;
}

describe('list_components', () => {
  let client: Client;

  beforeEach(async () => {
    client = await connectClient(registry);
  });

  it('returns only an array of component names', async () => {
    const result = await client.callTool({ name: 'list_components' });

    expect(result.structuredContent).toEqual({
      components: ['Button', 'Card', 'Accordion', 'Alert', 'Dialog', 'Input'],
    });
  });

  it('returns the same names as text and structured content', async () => {
    const result = (await client.callTool({ name: 'list_components' })) as unknown as {
      content: { type: string; text: string }[];
      structuredContent: unknown;
    };

    const text = result.content.find((block) => block.type === 'text')?.text ?? '';

    expect(JSON.parse(text)).toEqual(result.structuredContent);
  });

  it('does not include category or description details', async () => {
    const result = (await client.callTool({ name: 'list_components' })) as unknown as {
      structuredContent: { components: unknown[] };
    };

    for (const entry of result.structuredContent.components) {
      expect(typeof entry).toBe('string');
    }
  });
});

interface SearchResult {
  name: string;
  category: string;
  description: string;
  score: number;
}

describe('search_components', () => {
  let client: Client;

  beforeEach(async () => {
    client = await connectClient(registry);
  });

  async function search(args: {
    query: string;
    limit?: number;
  }): Promise<SearchResult[]> {
    const result = (await client.callTool({
      name: 'search_components',
      arguments: args,
    })) as unknown as { structuredContent: { results: SearchResult[] } };

    return result.structuredContent.results;
  }

  it('returns ranked results with name, category, description, and score', async () => {
    const results = await search({ query: 'button' });

    expect(results[0]).toEqual({
      name: 'Button',
      category: 'Actions',
      description: 'Button description.',
      score: expect.any(Number) as number,
    });
    expect(results[0]?.score).toBeGreaterThan(0);
  });

  it('matches on keywords', async () => {
    const results = await search({ query: 'modal' });

    expect(results[0]?.name).toBe('Dialog');
  });

  it('honors the limit argument', async () => {
    const results = await search({ query: '', limit: 2 });

    expect(results).toHaveLength(2);
  });

  it('returns an empty result set for no matches', async () => {
    const results = await search({ query: 'zzzznope' });

    expect(results).toEqual([]);
  });
});
