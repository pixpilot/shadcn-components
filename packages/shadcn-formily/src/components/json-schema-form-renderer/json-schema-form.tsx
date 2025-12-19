import type { JsonSchemaFormProps } from './types';
import React from 'react';
import { useMergedSchemaComponents } from '../../hooks/use-merged-schema-components';
import { defaultComponentRegistry } from '.././schema-field';
import { JsonSchemaFormRenderer } from './json-schema-form-renderer';

/**
 * JsonSchemaForm is the "batteries-included" version that automatically provides
 * all default components (Slider, Combobox, TagsInput, etc.) from the defaultComponentRegistry.
 *
 * User-provided components are merged with defaults, with user components taking precedence.
 */
export const JsonSchemaForm: React.FC<JsonSchemaFormProps> = (props) => {
  const { components, ...rest } = props;

  const mergedComponents = useMergedSchemaComponents(
    defaultComponentRegistry,
    components,
  );

  return <JsonSchemaFormRenderer {...rest} components={mergedComponents} />;
};

JsonSchemaForm.displayName = 'JsonSchemaForm';
