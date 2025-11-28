import type { Schema } from '@formily/react';
import type {
  ArrayComponentTypes,
  ArrayItemComponentRegistryProps,
  FieldComponentProps,
  RecursionFieldComponent,
} from './types';
import { RecursionField } from '@formily/react';
import React from 'react';
import { forEachSchema } from '../../../utils';
import {
  isAdditionComponent,
  isCopyComponent,
  isEmptyComponent,
  isIndexComponent,
  isLabelComponent,
  isMoveDownComponent,
  isMoveUpComponent,
  isRemoveComponent,
} from '../utils/is-array-component';
import { arrayComponentMap } from './components';

function getRecursionField(props: { isTargetField: (schema: Schema) => boolean }) {
  const { isTargetField } = props;
  const Component: React.FC<
    FieldComponentProps & Partial<ArrayItemComponentRegistryProps>
  > = React.memo(({ basePath, index, schema }) => {
    return (
      <RecursionField
        basePath={basePath}
        schema={schema}
        name={index}
        filterProperties={(s) => {
          // console.log(s);
          return isTargetField(s);
        }}
        onlyRenderProperties
      />
    );
  });
  return Component;
}

const componentChecks: Array<{
  type: ArrayComponentTypes;
  check: (schema: Schema) => boolean;
}> = [
  { type: 'Remove', check: isRemoveComponent },
  { type: 'Addition', check: isAdditionComponent },
  { type: 'Empty', check: isEmptyComponent },
  { type: 'Index', check: isIndexComponent },
  { type: 'MoveDown', check: isMoveDownComponent },
  { type: 'MoveUp', check: isMoveUpComponent },
  { type: 'Copy', check: isCopyComponent },
  { type: 'Label', check: isLabelComponent },
];

export function getArrayComponents(rootSchema: Schema) {
  const schemaComponents = new Map<
    ArrayComponentTypes,
    {
      Component: React.FC<FieldComponentProps>;
      isUserField: boolean;
    }
  >([]);

  forEachSchema(rootSchema, (schema, path) => {
    // Skip nested arrays (path.length > 0 means it's not root)
    if (path.length > 0 && schema.type === 'array') {
      return false; // Don't traverse this branch
    }

    // Check each component type that may added by user
    componentChecks.forEach(({ type, check }) => {
      if (check(schema)) {
        schemaComponents.set(type, {
          Component: getRecursionField({ isTargetField: check }),
          isUserField: true,
        });
      }
    });

    return true;
  });

  // Fill in defaults from arrayComponentMap
  Object.entries(arrayComponentMap).forEach(([key, component]) => {
    if (schemaComponents.has(key as ArrayComponentTypes)) return;
    const DefaultComponent: RecursionFieldComponent = (props) => {
      return React.createElement(component as React.ComponentType<any>, props);
    };
    schemaComponents.set(key as ArrayComponentTypes, {
      Component: DefaultComponent,
      isUserField: false,
    });
  });

  return schemaComponents;
}
