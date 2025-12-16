import type { JsonSchemaFormProps } from './types';
import React from 'react';
import { extendedComponentRegistry } from '../schema-field/schema-field-extended';
import { JsonSchemaFormRenderer } from './json-schema-form-renderer';

/**
 * JsonSchemaFormExtended is the extended version that provides all components
 * from the extendedComponentRegistry (including FileUpload, RichTextEditor, etc.).
 *
 * User-provided components are merged with extended defaults, with user components taking precedence.
 */
export const JsonSchemaFormExtended: React.FC<JsonSchemaFormProps> = (props) => {
  const { components, ...rest } = props;

  const mergedComponents = React.useMemo(() => {
    return {
      fields: {
        ...extendedComponentRegistry,
        ...(components?.fields || {}),
      },
      decorators: components?.decorators,
    };
  }, [components?.decorators, components?.fields]);

  return <JsonSchemaFormRenderer {...rest} components={mergedComponents} />;
};

JsonSchemaFormExtended.displayName = 'JsonSchemaFormExtended';
