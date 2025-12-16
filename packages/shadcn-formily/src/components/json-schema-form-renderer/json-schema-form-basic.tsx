import type { JsonSchemaFormProps } from './types';
import React from 'react';
import { basicComponentRegistry } from '../schema-field/schema-field-basics';
import { JsonSchemaFormRenderer } from './json-schema-form-renderer';

/**
 * JsonSchemaFormBasic is the basic version that provides only the essential components
 * from the basicComponentRegistry (Input, Checkbox, Select, etc.).
 *
 * User-provided components are merged with basics, with user components taking precedence.
 */
export const JsonSchemaFormBasic: React.FC<JsonSchemaFormProps> = (props) => {
  const { components, ...rest } = props;

  const mergedComponents = React.useMemo(() => {
    return {
      fields: {
        ...basicComponentRegistry,
        ...(components?.fields || {}),
      },
      decorators: components?.decorators,
    };
  }, [components?.decorators, components?.fields]);

  return <JsonSchemaFormRenderer {...rest} components={mergedComponents} />;
};

JsonSchemaFormBasic.displayName = 'JsonSchemaFormBasic';
