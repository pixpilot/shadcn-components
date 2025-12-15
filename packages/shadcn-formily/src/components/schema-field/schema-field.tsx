import { createSchemaField } from '@formily/react';
import { TagsInput } from '@pixpilot/shadcn-ui';
import { Combobox } from '../combobox';
import { Slider } from '../slider';
import { TagsInputInLine } from '../tags-input-inline';
import { schemaFieldBasicComponents } from './schema-field-basics';

export const schemaFieldComponents = {
  ...schemaFieldBasicComponents,
  Combobox,
  TagsInput,
  TagsInputInLine,
  Slider,
};

export const SchemaField = createSchemaField({
  components: schemaFieldComponents,
});
