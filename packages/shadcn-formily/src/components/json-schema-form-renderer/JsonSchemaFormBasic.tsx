import type { JsonSchemaFormProps } from './types';
import React from 'react';
import { useMergedSchemaComponents } from '../../hooks/use-merged-schema-components';
import { basicComponentRegistry } from '../schema-field/schema-field-basics';
import { JsonSchemaFormRenderer } from './JsonSchemaFormRenderer';

/**
 * JsonSchemaFormBasic is the basic version that provides only the essential components
 * from the basicComponentRegistry (Input, Checkbox, Select, etc.).
 *
 * User-provided components are merged with basics, with user components taking precedence.
 */
export const JsonSchemaFormBasic: React.FC<JsonSchemaFormProps> = (props) => {
  const { components, ...rest } = props;

  const mergedComponents = useMergedSchemaComponents(basicComponentRegistry, components);

  return <JsonSchemaFormRenderer {...rest} components={mergedComponents} />;
};

JsonSchemaFormBasic.displayName = 'JsonSchemaFormBasic';
