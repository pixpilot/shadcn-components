import type { ISchema } from '@formily/react';

import {
  isCopyComponent,
  isIndexComponent,
  isMoveDownComponent,
  isMoveUpComponent,
  isRemoveComponent,
} from './is-array-component';

/**
 * Matches the built-in item operation schema properties that should render
 * when `actions === false` (schema-defined ops like move/copy/remove/index).
 */
export function isArrayItemOperationSchema(schema: ISchema): boolean {
  return (
    isMoveDownComponent(schema) ||
    isMoveUpComponent(schema) ||
    isCopyComponent(schema) ||
    isRemoveComponent(schema) ||
    isIndexComponent(schema)
  );
}
