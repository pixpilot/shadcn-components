import type { JsonSchemaFormProps } from './types';
import React from 'react';
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

  const mergedComponents = React.useMemo(() => {
    return {
      fields: {
        ...defaultComponentRegistry,
        ...(components?.fields || {}),
      },
      decorators: components?.decorators,
    };
  }, [components?.decorators, components?.fields]);

  return <JsonSchemaFormRenderer {...rest} components={mergedComponents} />;
};

JsonSchemaForm.displayName = 'JsonSchemaForm';
