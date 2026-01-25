import type { ISchema } from '@formily/react';
import type { FormComponentConfig } from '../../types/form';
import type { JsonSchemaFormComponents } from '../json-schema-form-renderer/types';
import { createSchemaField } from '@formily/react';

import { useFormSchema } from '../../hooks/use-form-schema';
import { useMergedSchemaComponents } from '../../hooks/use-merged-schema-components';
import { extractComponents } from '../../utils/extract-components';
import { AvatarUpload, FileUpload, FileUploadInline } from '../file-upload';
import { IconPicker } from '../IconPicker';
import { RichTextEditor } from '../RichTextEditor';
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

type JsonSchemaFieldExtendedProps = Omit<
  React.ComponentProps<typeof SchemaFieldExtended>,
  'components'
> & {
  components?: JsonSchemaFormComponents;
  schema: ISchema;
};

const JsonSchemaFieldExtended: React.FC<JsonSchemaFieldExtendedProps> = (props) => {
  const { components, schema, ...rest } = props;

  // Merge extendedComponentRegistry with user-provided components
  // User components will override extended components with the same key
  const mergedComponents = useMergedSchemaComponents(
    extendedComponentRegistry,
    components,
  );

  const { formSchema, SchemaField } = useFormSchema(schema, mergedComponents);

  return <SchemaField {...rest} schema={formSchema} />;
};

JsonSchemaFieldExtended.displayName = 'JsonSchemaFieldExtended';

export { JsonSchemaFieldExtended };
