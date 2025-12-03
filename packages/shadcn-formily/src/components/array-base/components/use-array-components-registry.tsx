import type { Schema } from '@formily/react';
import type { IArrayBaseAdditionProps } from './addition';

import type { ArrayItemLabelProps } from './array-item-label';
import type {
  ArrayItemComponentRegistryProps,
  ArrayOperationTypes,
  FieldComponentProps,
} from './types';

import { cn } from '@pixpilot/shadcn';
import React from 'react';
import { filterAndSortComponents } from '../utils/filter-and-sort-components';
import { getArrayComponents } from './get-array-components';

type ArrayItemsContainerProps = FieldComponentProps &
  React.HTMLAttributes<HTMLDivElement> & {
    children: React.ReactNode;
    hasItems: boolean;
  };

type AdditionProps = FieldComponentProps & IArrayBaseAdditionProps;

export interface ArrayComponents {
  OperationComponents: React.FC<ArrayItemComponentRegistryProps>;
  AddButton: React.FC<AdditionProps>;
  EmptyArray: React.FC<FieldComponentProps>;
  ItemIndex: React.FC<ArrayItemComponentRegistryProps>;
  ArrayItemsContainer: React.FC<ArrayItemsContainerProps>;
  ItemLabel: React.FC<ArrayItemComponentRegistryProps & ArrayItemLabelProps>;
}

export function useArrayComponentRegistry(
  rootSchema: Schema,
  operations?: ArrayOperationTypes[] | false,
): ArrayComponents {
  return React.useMemo(() => {
    const schemaComponents = getArrayComponents(rootSchema);
    const componentToRender = filterAndSortComponents(schemaComponents, operations);

    const EmptyArray = schemaComponents.get('Empty')?.Component;

    const AddButton = schemaComponents.get('Addition')?.Component;

    return {
      OperationComponents: React.memo((props: FieldComponentProps) => {
        return (
          <>
            {componentToRender.map(([key, { Component }]) => (
              <React.Fragment key={key}>
                <Component {...props} />
              </React.Fragment>
            ))}
          </>
        );
      }),
      AddButton: (props: AdditionProps) => {
        if (!AddButton) return null;
        return <AddButton {...props} />;
      },

      EmptyArray: (props: FieldComponentProps) => {
        if (!EmptyArray) return null;
        return (
          <>
            <EmptyArray {...props} />
          </>
        );
      },

      ItemIndex: (props: FieldComponentProps) => {
        const compInfo = schemaComponents.get('Index');
        if (!compInfo) return null;
        return (
          <>
            <compInfo.Component {...props} />
          </>
        );
      },

      ArrayItemsContainer: (props: ArrayItemsContainerProps) => {
        const { className, schema, children, hasItems, basePath, ...otherProps } = props;
        return (
          <div {...otherProps} className={cn('space-y-3', className)}>
            {!hasItems && EmptyArray && (
              <EmptyArray basePath={basePath} schema={schema} />
            )}
            {children}
          </div>
        );
      },
      ItemLabel: (props: FieldComponentProps) => {
        const compInfo = schemaComponents.get('Label');
        if (!compInfo) return null;
        return (
          <>
            <compInfo.Component {...props} />
          </>
        );
      },
    };
  }, [operations, rootSchema]);
}
