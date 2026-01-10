import type { ISchema } from '@formily/react';
import type { FormComponentConfig } from '../../types/form';
import type { JsonSchemaFormComponents } from '../json-schema-form-renderer';

import { createSchemaField } from '@formily/react';
import { TagsInput } from '@pixpilot/shadcn-ui';
import { useFormSchema } from '../../hooks/use-form-schema';
import { useMergedSchemaComponents } from '../../hooks/use-merged-schema-components';
import { extractComponents } from '../../utils/extract-components';
import { ColorPicker } from '../color-picker';
import { Combobox } from '../combobox';
import { Slider, SliderInput, SliderSelect } from '../slider';
import { TagsInputInLine } from '../tags-input-inline';
import { basicComponentRegistry } from './schema-field-basics';

export const defaultComponentRegistry = {
  ...basicComponentRegistry,
  ColorPicker: { component: ColorPicker, decorator: 'FormItem' },
  Combobox: { component: Combobox, decorator: 'FormItem' },
  Slider: { component: Slider, decorator: 'FormItem' },
  SliderInput: { component: SliderInput, decorator: 'FormItem' },
  SliderSelect: { component: SliderSelect, decorator: 'FormItem' },
  TagsInput: { component: TagsInput, decorator: 'FormItem' },
  TagsInputInLine: { component: TagsInputInLine, decorator: 'FormItem' },
} satisfies Record<string, FormComponentConfig>;

export const defaultComponents = extractComponents(defaultComponentRegistry);

export const SchemaField = createSchemaField({
  components: defaultComponents,
});

type SchemaFieldDefaultProps = Omit<
  React.ComponentProps<typeof SchemaField>,
  'components'
> & {
  components?: JsonSchemaFormComponents;
  schema: ISchema;
};

const JsonSchemaField: React.FC<SchemaFieldDefaultProps> = (props) => {
  const { components, schema, ...rest } = props;

  // Merge defaultComponentRegistry with user-provided components
  // User components will override default components with the same key
  const mergedComponents = useMergedSchemaComponents(
    defaultComponentRegistry,
    components,
  );

  const { formSchema, SchemaField: SchemaFieldComponent } = useFormSchema(
    schema,
    mergedComponents,
  );

  return <SchemaFieldComponent {...rest} schema={formSchema} />;
};

JsonSchemaField.displayName = 'JsonSchemaField';

export { JsonSchemaField };
