import type { FileMetadata } from '@pixpilot/shadcn-ui';
import { useFieldSchema } from '@formily/react';

/**
 * Extract FileMetadata from schema defaults
 * When fields are not rendered, use the schema's default values to build FileMetadata.
 */
export function useSchemaValues(): FileMetadata | null {
  const schema = useFieldSchema();

  if (!schema.properties) {
    return null;
  }

  // Build FileMetadata object from schema default values
  const metadata: Partial<FileMetadata> = {};

  for (const [key, prop] of Object.entries(schema.properties)) {
    if (
      typeof prop === 'object' &&
      prop !== null &&
      'default' in prop &&
      (key === 'name' ||
        key === 'size' ||
        key === 'type' ||
        key === 'url' ||
        key === 'lastModified')
    ) {
      // eslint-disable-next-line ts/no-unsafe-assignment
      metadata[key] = prop.default;
    }
  }

  // Check if we have at least the required fields
  if (metadata.name != null && metadata.type != null) {
    return metadata as FileMetadata;
  }

  return metadata as FileMetadata;
}
