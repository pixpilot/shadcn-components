import type { JsonSchemaFormProps } from './types';
import React from 'react';
import { useMergedSchemaComponents } from '../../hooks/use-merged-schema-components';
import { extendedComponentRegistry } from '../schema-field/schema-field-extended';
import { JsonSchemaFormRenderer } from './JsonSchemaFormRenderer';

/**
 * JsonSchemaFormExtended is the extended version that provides all components
 * from the extendedComponentRegistry (including FileUpload, RichTextEditor, etc.).
 *
 * User-provided components are merged with extended defaults, with user components taking precedence.
 */
export const JsonSchemaFormExtended: React.FC<JsonSchemaFormProps> = (props) => {
  const { components, ...rest } = props;

  const mergedComponents = useMergedSchemaComponents(
    extendedComponentRegistry,
    components,
  );

  return <JsonSchemaFormRenderer {...rest} components={mergedComponents} />;
};

JsonSchemaFormExtended.displayName = 'JsonSchemaFormExtended';
