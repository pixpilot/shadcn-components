import type { FormComponentConfig } from '../../types/form';
import { createSchemaField } from '@formily/react';

import { extractComponents } from '../../utils/extract-components';
import { AvatarUpload, FileUpload, FileUploadInline } from '../file-upload';
import { IconPicker } from '../icon-picker';
import { RichTextEditor } from '../rich-text-editor';
import { defaultComponentRegistry } from '../schema-field';

export const extendedComponentRegistry = {
  ...defaultComponentRegistry,
  AvatarUpload: { component: AvatarUpload, decorator: 'FormItem' },
  FileUploadInline: { component: FileUploadInline, decorator: 'FormItem' },
  IconPicker: { component: IconPicker, decorator: 'FormItem' },
  FileUpload: { component: FileUpload, decorator: 'FormItem' },
  RichTextEditor: { component: RichTextEditor, decorator: 'FormItem' },
} satisfies Record<string, FormComponentConfig>;

/**
 * SchemaField with all Shadcn Formily components pre-registered
 * Use this to render forms from JSON Schema
 */
export const extendedComponents = extractComponents(extendedComponentRegistry);

export const SchemaFieldExtended = createSchemaField({
  components: extendedComponents,
});
