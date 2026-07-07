import type { ComponentMeta, OwnProps } from '@internal/mcp';
import type { SchemaFieldDefaultProps } from './schema-field';
import { defineProps } from '@internal/mcp';

type JsonSchemaFieldOwnProps = OwnProps<SchemaFieldDefaultProps, 'div'>;

export const meta: ComponentMeta<JsonSchemaFieldOwnProps> = {
  name: 'JsonSchemaField',
  category: 'Formily',
  description:
    'A schema field wrapper that renders Formily schema using the default shadcn component registry.',
  htmlElement: 'div',
  props: defineProps<JsonSchemaFieldOwnProps>({
    data: 'Forwarded to the underlying UI component.',
    pattern: 'Forwarded to the underlying UI component.',
    value: 'Controlled value. Usually supplied by Formily.',
    name: 'HTML/form name forwarded to the underlying control.',
    disabled:
      'Disables user interaction. Usually also respects the Formily field disabled state.',
    readOnly:
      'Makes the control read-only. Usually also respects the Formily field read-only state.',
    required: 'Marks the control as required for accessibility and UI state.',
    dataSource: 'Forwarded to the underlying UI component.',
    validator: 'Forwarded to the underlying UI component.',
    initialValue: 'Forwarded to the underlying UI component.',
    description: 'Description content rendered with the component.',
    component: 'Forwarded to the underlying UI component.',
    decorator: 'Forwarded to the underlying UI component.',
    display: 'Forwarded to the underlying UI component.',
    editable: 'Forwarded to the underlying UI component.',
    readPretty: 'Forwarded to the underlying UI component.',
    visible: 'Forwarded to the underlying UI component.',
    components: 'Component registry overrides merged with the defaults.',
    basePath: 'Forwarded to the underlying UI component.',
    validateFirst: 'Forwarded to the underlying UI component.',
    validatePattern: 'Forwarded to the underlying UI component.',
    validateDisplay: 'Forwarded to the underlying UI component.',
    reactions: 'Forwarded to the underlying UI component.',
    schema: 'JSON/Formily schema to render.',
    scope: 'Forwarded to the underlying UI component.',
  }),
  examples: [
    {
      title: 'Render a schema field',
      code: `<JsonSchemaField schema={schema} />`,
    },
    {
      title: 'JSON schema for form renderer',
      code: `{
  type: 'object',
  properties: {
    name: {
      type: 'string',
      title: 'Name',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
  },
}`,
    },
  ],
  keywords: ['formily', 'schema field', 'json schema'],
};
