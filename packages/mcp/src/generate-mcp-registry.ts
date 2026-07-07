import { existsSync } from 'node:fs';
import { mkdir, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

interface DiscoveredMeta {
  filePath: string;
  importPath: string;
  name: string;
}

/**
 * Per-package configuration for the MCP registry generator. Place this in a
 * `mcp.config.ts` file at the package root and export it as the default export
 * (see {@link defineMcpRegistryConfig}). Shared by the generator CLI and tests.
 */
export interface McpRegistryConfig {
  /**
   * Directory, relative to the package `src`, that holds one folder per
   * component. Each component folder is expected to contain an `mcp.ts` file.
   * Defaults to `components`.
   */
  componentsDir?: string;
  /**
   * Component folder names that intentionally do not ship an `mcp.ts` file
   * (helpers, shared internals, context providers, etc.). Folders listed here
   * are skipped by the missing-metadata check.
   */
  exclude?: readonly string[];
}

/** Options for generating a package-local src/generated/mcp-registry.ts file. */
export interface GenerateMcpRegistryOptions extends McpRegistryConfig {
  /** Absolute or package-relative root that contains the package src directory. */
  packageRoot: string;
}

const DEFAULT_COMPONENTS_DIR = 'components';

const CONFIG_FILE_NAMES = [
  'mcp.config.ts',
  'mcp.config.mts',
  'mcp.config.mjs',
  'mcp.config.js',
];

const GENERATED_FILE_HEADER = `/* eslint-disable perfectionist/sort-imports */
/**
 * AUTO-GENERATED FILE — DO NOT EDIT.
 *
 * This registry is produced by @internal/mcp from the \`mcp.ts\` files that live
 * next to each component. To change it, edit those \`mcp.ts\` files (or add a new
 * one when you add a component) and re-run the generator:
 *
 *   pnpm run mcp:generate
 */`;

/** Identity helper for authoring a strongly typed `mcp.config.ts` file. */
export function defineMcpRegistryConfig(config: McpRegistryConfig): McpRegistryConfig {
  return config;
}

/**
 * Loads an optional `mcp.config.ts` (or `.mts`/`.mjs`/`.js`) file from the
 * package root. Returns an empty config when no file is present.
 */
export async function loadMcpRegistryConfig(
  packageRoot: string,
): Promise<McpRegistryConfig> {
  const configPath = CONFIG_FILE_NAMES.map((fileName) =>
    path.join(packageRoot, fileName),
  ).find((candidate) => existsSync(candidate));

  if (configPath === undefined) {
    return {};
  }

  const moduleExports = (await import(pathToFileURL(configPath).href)) as {
    default?: McpRegistryConfig;
  };

  return moduleExports.default ?? {};
}

/** Merges the on-disk `mcp.config.ts` with the required `packageRoot`. */
export async function resolveMcpRegistryOptions(
  packageRoot: string,
): Promise<GenerateMcpRegistryOptions> {
  const config = await loadMcpRegistryConfig(packageRoot);

  return { packageRoot, ...config };
}

function componentsDirPath(options: GenerateMcpRegistryOptions): string {
  return path.join(
    options.packageRoot,
    'src',
    options.componentsDir ?? DEFAULT_COMPONENTS_DIR,
  );
}

/**
 * Returns the names of component folders that are missing an `mcp.ts` file and
 * are not listed in `exclude`. An empty array means every component is covered.
 */
export async function findMissingMcpFiles(
  options: GenerateMcpRegistryOptions,
): Promise<string[]> {
  const componentsDir = componentsDirPath(options);

  if (!existsSync(componentsDir)) {
    return [];
  }

  const exclude = new Set(options.exclude ?? []);
  const entries = await readdir(componentsDir, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isDirectory() && !exclude.has(entry.name))
    .filter((entry) => !existsSync(path.join(componentsDir, entry.name, 'mcp.ts')))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));
}

function assertNoMissingMcpFiles(
  options: GenerateMcpRegistryOptions,
  missing: readonly string[],
): void {
  if (missing.length === 0) {
    return;
  }

  const componentsDir = options.componentsDir ?? DEFAULT_COMPONENTS_DIR;
  const list = missing
    .map((name) => `  - src/${componentsDir}/${name}/mcp.ts`)
    .join('\n');

  throw new Error(
    `Missing mcp.ts for ${missing.length} component folder(s):\n${list}\n\n` +
      'Add an mcp.ts file to each folder so it is exposed to the MCP server, or ' +
      'add the folder name to the `exclude` list in mcp.config.ts if it does not ' +
      'need one.',
  );
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

  return `${GENERATED_FILE_HEADER}
${imports}

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

/**
 * Scans package src folders for mcp.ts files and writes the generated registry.
 * Throws when a component folder is missing an mcp.ts file and is not listed in
 * the `exclude` option, so new components cannot silently skip the registry.
 */
export async function generateMcpRegistry(
  options: GenerateMcpRegistryOptions,
): Promise<void> {
  const missing = await findMissingMcpFiles(options);
  assertNoMissingMcpFiles(options, missing);

  const srcDir = path.join(options.packageRoot, 'src');
  const generatedDir = path.join(srcDir, 'generated');
  const outputPath = path.join(generatedDir, 'mcp-registry.ts');
  const discovered = await discoverMetadata(srcDir, generatedDir);

  if (discovered.length === 0) {
    throw new Error(
      `No component mcp.ts files found under ${srcDir}. Run this generator from ` +
        'a package that has component mcp.ts files (e.g. `pnpm run mcp:generate` ' +
        'inside a consuming package).',
    );
  }

  await mkdir(generatedDir, { recursive: true });
  await writeFile(outputPath, renderRegistry(discovered));

  process.stdout.write(
    `Generated MCP registry with ${discovered.length} component(s).\n`,
  );
}
