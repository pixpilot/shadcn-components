import type { Schema } from '@formily/react';
import type { ActionContext, ActionItem } from '../array-base';
import type { IArrayBaseContext } from '../array-base/array-context';

import { RecursionField } from '@formily/react';
import React from 'react';
import { isArrayItemOperationSchema } from '../array-base/utils/is-array-item-operation-schema';
import { RenderAction } from './RenderAction';
import { isDisabled, isHidden } from './utils';

export interface ArrayItemOperationsProps {
  schema: Schema;
  index: number;
  array: IArrayBaseContext | null;
  actionContext: ActionContext | null;
  resolvedActions: ActionItem[];
}

export const ArrayItemOperations: React.FC<ArrayItemOperationsProps> = ({
  schema,
  index,
  array,
  actionContext,
  resolvedActions,
}) => {
  const schemaOperationsNode =
    actionContext != null && array?.field != null ? (
      <RecursionField
        basePath={array.field.address}
        schema={schema}
        name={index}
        filterProperties={isArrayItemOperationSchema}
        onlyRenderProperties
      />
    ) : null;

  if (array?.props?.actions === false) {
    return <>{schemaOperationsNode}</>;
  }

  return (
    <>
      {resolvedActions.map((action, i) => (
        <RenderAction
          // eslint-disable-next-line react/no-array-index-key
          key={i}
          action={action}
          ctx={actionContext!}
          isHidden={isHidden}
          isDisabled={isDisabled}
          index={index}
          array={array!}
          schema={schema}
        />
      ))}
    </>
  );
};

ArrayItemOperations.displayName = 'ArrayItemOperations';
