import type { ISchema } from '@formily/react';

function isComponent(schema: ISchema, compName: string): boolean {
  const comp = schema['x-component'] as unknown;
  if (comp == null) return false;
  if (typeof comp !== 'string') return false;

  if (comp.endsWith(compName)) {
    return true;
  }
  return false;
}

/**
 * Check if schema represents an Addition component
 */
export function isAdditionComponent(schema: ISchema): boolean {
  return isComponent(schema, '.Addition');
}

/**
 * Check if schema represents an Index component
 */
export function isIndexComponent(schema: ISchema): boolean {
  return isComponent(schema, '.Index');
}

/**
 * Check if schema represents a Remove component
 */
export function isRemoveComponent(schema: ISchema): boolean {
  return isComponent(schema, '.Remove');
}

/**
 * Check if schema represents a MoveUp component
 */
export function isMoveUpComponent(schema: ISchema): boolean {
  return isComponent(schema, '.MoveUp');
}

/**
 * Check if schema represents a MoveDown component
 */
export function isMoveDownComponent(schema: ISchema): boolean {
  return isComponent(schema, '.MoveDown');
}

export function isEmptyComponent(schema: ISchema): boolean {
  return isComponent(schema, '.Empty');
}

export function isCopyComponent(schema: ISchema): boolean {
  return isComponent(schema, '.Copy');
}

export function isEditComponent(schema: ISchema): boolean {
  return isComponent(schema, '.Edit');
}

export function isLabelComponent(schema: ISchema): boolean {
  return isComponent(schema, '.Label');
}

/**
 * Check if schema represents any operation component (Addition, Remove, MoveUp, MoveDown)
 */
export function isOperationComponent(schema: ISchema): boolean {
  return (
    isAdditionComponent(schema) ||
    isRemoveComponent(schema) ||
    isMoveDownComponent(schema) ||
    isMoveUpComponent(schema) ||
    isCopyComponent(schema) ||
    isEditComponent(schema) ||
    isIndexComponent(schema)
  );
}

export function isDisplayComponent(schema: ISchema): boolean {
  return isEmptyComponent(schema) || isIndexComponent(schema);
}
