import type { Schema } from '@formily/react';
import type { IArrayBaseAdditionProps } from './addition';

import type { ArrayItemLabelProps } from './array-item-label';
import type { ArrayEmptyProps } from './empty';

import type { ArrayItemComponentRegistryProps, FieldComponentProps } from './types';
import { cn } from '@pixpilot/shadcn';
import React from 'react';
import { getArrayComponents } from './get-array-components';

type ArrayItemsContainerProps = FieldComponentProps &
  React.HTMLAttributes<HTMLDivElement> & {
    children: React.ReactNode;
    hasItems: boolean;
  };

type AdditionProps = Pick<FieldComponentProps, 'schema'> & IArrayBaseAdditionProps;

interface ArrayComponentsProps {
  AddButton: AdditionProps;
  EmptyArray: ArrayEmptyProps;
  ItemIndex: ArrayItemComponentRegistryProps;
  ArrayItemsContainer: ArrayItemsContainerProps;
  ItemLabel: ArrayItemComponentRegistryProps & ArrayItemLabelProps;
}

export interface ArrayComponents {
  AddButton: React.FC<ArrayComponentsProps['AddButton']>;
  EmptyArray: React.FC<ArrayComponentsProps['EmptyArray']>;
  ItemIndex: React.FC<ArrayComponentsProps['ItemIndex']>;
  ArrayItemsContainer: React.FC<ArrayComponentsProps['ArrayItemsContainer']>;
  ItemLabel: React.FC<ArrayComponentsProps['ItemLabel']>;
}

export function useArrayComponentRegistry(rootSchema: Schema): ArrayComponents {
  return React.useMemo(() => {
    const schemaComponents = getArrayComponents(rootSchema);

    const EmptyArray = schemaComponents.get('Empty')?.Component;

    const AddButton = schemaComponents.get('Addition')?.Component;

    return {
      AddButton: (props: ArrayComponentsProps['AddButton']) => {
        if (!AddButton) return null;
        return <AddButton {...props} />;
      },

      EmptyArray: (props: ArrayComponentsProps['EmptyArray']) => {
        if (!EmptyArray) return null;
        return (
          <>
            <EmptyArray {...props} />
          </>
        );
      },

      ItemIndex: (_props: ArrayComponentsProps['ItemIndex']) => {
        const compInfo = schemaComponents.get('Index');
        if (!compInfo) return null;
        return (
          <>
            <compInfo.Component />
          </>
        );
      },

      ArrayItemsContainer: (props: ArrayComponentsProps['ArrayItemsContainer']) => {
        const { className, schema, children, hasItems, basePath, ...otherProps } = props;
        return (
          <div {...otherProps} className={cn('space-y-3', className)}>
            {!hasItems && EmptyArray && <EmptyArray />}
            {children}
          </div>
        );
      },
      ItemLabel: (_props: ArrayComponentsProps['ItemLabel']) => {
        const compInfo = schemaComponents.get('Label');
        if (!compInfo) return null;
        return (
          <>
            <compInfo.Component />
          </>
        );
      },
    };
  }, [rootSchema]);
}
