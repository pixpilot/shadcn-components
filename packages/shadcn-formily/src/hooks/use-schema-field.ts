import type { ISchema } from '@formily/react';
import type { JsonSchemaFormComponents } from '../components/json-schema-form-renderer/types';
import type { FormComponentRecord } from '../types/form';

import { createSchemaField } from '@formily/react';
import { isDevelopment } from '@pixpilot/env/is-dev';
import React from 'react';

import { validateSchemaComponents } from '../utils';
import { extractComponents } from '../utils/extract-components';

// eslint-disable-next-line ts/explicit-module-boundary-types
export function useSchemaField(
  formSchema: ISchema,
  componentsProp: Partial<JsonSchemaFormComponents> | undefined,
) {
  return React.useMemo(() => {
    // Use only user-provided components (headless approach)
    const componentConfigs: FormComponentRecord = {
      ...(componentsProp?.fields ?? {}),
    };

    // Add decorators as components
    if (componentsProp?.decorators) {
      Object.entries(componentsProp.decorators).forEach(([key, decorator]) => {
        componentConfigs[key] = { component: decorator };
      });
    }

    // Extract component instances
    const components = extractComponents(componentConfigs);

    if (isDevelopment()) {
      validateSchemaComponents(formSchema, components);
    }

    const schemaField = createSchemaField({
      components,
      scope: {},
    });

    return schemaField;
  }, [formSchema, componentsProp]);
}
