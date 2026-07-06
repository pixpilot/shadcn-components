import { mkdir, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

interface DiscoveredMeta {
  filePath: string;
  importPath: string;
  name: string;
}

/** Options for generating a package-local src/generated/mcp-registry.ts file. */
export interface GenerateMcpRegistryOptions {
  /** Absolute or package-relative root that contains the package src directory. */
  packageRoot: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function validateMetaExport(filePath: string, meta: unknown): string {
  if (!isRecord(meta)) {
    throw new TypeError(`${filePath} must export a meta object.`);
  }

  const requiredStringFields = ['name', 'category', 'description'];

  for (const field of requiredStringFields) {
    if (typeof meta[field] !== 'string' || meta[field].length === 0) {
      throw new TypeError(`${filePath} meta.${field} must be a non-empty string.`);
    }
  }

  if ('htmlElement' in meta && meta.htmlElement !== undefined) {
    if (typeof meta.htmlElement !== 'string' || meta.htmlElement.length === 0) {
      throw new TypeError(
        `${filePath} meta.htmlElement must be a non-empty string if provided.`,
      );
    }
  }

  if (!isRecord(meta.props)) {
    throw new TypeError(`${filePath} meta.props must be an object.`);
  }

  if (!Array.isArray(meta.examples)) {
    throw new TypeError(`${filePath} meta.examples must be an array.`);
  }

  if ('dependencies' in meta && meta.dependencies !== undefined) {
    if (!Array.isArray(meta.dependencies)) {
      throw new TypeError(
        `${filePath} meta.dependencies must be an array of packages consumers need to install separately if provided.`,
      );
    }
  }

  return String(meta.name);
}

async function findMetadataFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        return findMetadataFiles(entryPath);
      }

      return entry.isFile() && entry.name === 'mcp.ts' ? [entryPath] : [];
    }),
  );

  return files.flat();
}

function toImportPath(fromDir: string, filePath: string): string {
  const relativePath = path.relative(fromDir, filePath).replaceAll(path.sep, '/');
  const withoutExtension = relativePath.replace(/\.ts$/u, '');

  return withoutExtension.startsWith('.') ? withoutExtension : `./${withoutExtension}`;
}

function toIdentifier(name: string, index: number): string {
  const identifier = name.replace(/^\d+/u, '').replace(/\W+/gu, '_');

  return `${identifier || 'component'}Meta${index}`;
}

async function discoverMetadata(srcDir: string, generatedDir: string) {
  const metadataFiles = await findMetadataFiles(srcDir);
  const discovered = await Promise.all(
    metadataFiles.map(async (filePath): Promise<DiscoveredMeta> => {
      const moduleUrl = pathToFileURL(filePath).href;
      const moduleExports = (await import(moduleUrl)) as Record<string, unknown>;
      const name = validateMetaExport(filePath, moduleExports.meta);

      return {
        filePath,
        importPath: toImportPath(generatedDir, filePath),
        name,
      };
    }),
  );

  const componentNames = new Set<string>();
  for (const item of discovered) {
    if (componentNames.has(item.name)) {
      throw new TypeError(`Duplicate MCP component name "${item.name}" found.`);
    }

    componentNames.add(item.name);
  }

  return discovered.sort((a, b) => a.name.localeCompare(b.name));
}

function renderRegistry(discovered: readonly DiscoveredMeta[]): string {
  const imports = discovered
    .map(
      (item, index) =>
        `import { meta as ${toIdentifier(item.name, index)} } from '${item.importPath}';`,
    )
    .join('\n');

  const registryEntries = discovered
    .map(
      (item, index) =>
        `  ${JSON.stringify(item.name)}: withHtmlElementNote(${toIdentifier(item.name, index)}),`,
    )
    .join('\n');

  return `${imports}

function withHtmlElementNote<
  TComponent extends { htmlElement?: string; notes?: readonly string[] },
>(comp: TComponent): TComponent & { notes: readonly string[] } {
  const htmlNote =
    comp.htmlElement != null && comp.htmlElement.length > 0
      ? \`Also supports all standard props of a native <\${comp.htmlElement}> element (onClick, disabled, className, style, type, aria-*, data-*, etc.).\`
      : '';

  return {
    ...comp,
    notes:
      htmlNote.length > 0 ? [...(comp.notes ?? []), htmlNote] : [...(comp.notes ?? [])],
  };
}

// prettier-ignore
/** Generated component metadata map keyed by public component name. */
export const mcpRegistry = {
${registryEntries}
} as const;

/** Type of the generated component metadata registry. */
export type McpRegistry = typeof mcpRegistry;
`;
}

/** Scans package src folders for mcp.ts files and writes the generated registry. */
export async function generateMcpRegistry({
  packageRoot,
}: GenerateMcpRegistryOptions): Promise<void> {
  const srcDir = path.join(packageRoot, 'src');
  const generatedDir = path.join(srcDir, 'generated');
  const outputPath = path.join(generatedDir, 'mcp-registry.ts');
  const discovered = await discoverMetadata(srcDir, generatedDir);

  await mkdir(generatedDir, { recursive: true });
  await writeFile(outputPath, renderRegistry(discovered));

  process.stdout.write(
    `Generated MCP registry with ${discovered.length} component(s).\n`,
  );
}
