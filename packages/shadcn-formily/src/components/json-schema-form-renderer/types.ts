import type { ISchema } from '@formily/react';
import type { Form as FormilyForm } from '../Form';

export interface JsonSchemaFormComponent {
  component: React.ComponentType<any>;
  decorator?: string;
}

export interface JsonSchemaFormComponents {
  fields?: Record<string, JsonSchemaFormComponent>;
  decorators?: Record<string, React.ComponentType<any>>;
}

export interface JsonSchemaFormRendererProps extends React.ComponentProps<
  typeof FormilyForm
> {
  schema: ISchema;
  children?: React.ReactNode;
  components?: Partial<JsonSchemaFormComponents>;
}

export interface JsonSchemaFormProps extends Omit<
  JsonSchemaFormRendererProps,
  'components'
> {
  components?: JsonSchemaFormComponents;
}
