import type { IFormProps } from './form';
import React from 'react';
import { Form } from './form';

export interface JsonSchemaFormRendererProps extends IFormProps {}

const JsonSchemaFormRenderer: React.FC<JsonSchemaFormRendererProps> = (props) => {
  return <Form {...props} />;
};

JsonSchemaFormRenderer.displayName = 'JsonSchemaFormRenderer';

export { JsonSchemaFormRenderer };
