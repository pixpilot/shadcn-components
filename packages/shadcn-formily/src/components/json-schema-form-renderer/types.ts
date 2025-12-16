import type { ISchema } from '@formily/react';
import type { Form } from '../form';

export interface JsonSchemaFormComponent {
  component: React.ComponentType<any>;
  decorator?: string;
}

export interface JsonSchemaFormComponents {
  fields?: Record<string, JsonSchemaFormComponent>;
  decorators?: Record<string, React.ComponentType<any>>;
}

export interface JsonSchemaFormRendererProps extends Omit<
  React.ComponentProps<typeof Form>,
  'form'
> {
  schema: ISchema;
  children?: React.ReactNode;
  values?: Record<string, any>;
  components: Partial<JsonSchemaFormComponents>;
}

export interface JsonSchemaFormProps extends Omit<
  JsonSchemaFormRendererProps,
  'components'
> {
  components?: JsonSchemaFormComponents;
}
