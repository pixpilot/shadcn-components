import { createSchemaField } from '@formily/react';

import { FileUpload, FileUploadInline } from './file-upload';
import { IconPicker } from './icon-picker';
import { RichTextEditor } from './rich-text-editor';
import { basicComponents } from './schema-field';

/**
 * SchemaField with all Shadcn Formily components pre-registered
 * Use this to render forms from JSON Schema
 */
export const SchemaFieldExtended = createSchemaField({
  components: {
    FileUploadInline,
    IconPicker,
    FileUpload,
    RichTextEditor,
    ...basicComponents,
  },
});
