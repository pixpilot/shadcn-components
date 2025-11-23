/* eslint-disable ts/no-misused-promises */
import { ArrayField as FormilyArrayField } from '@formily/react';
import { Button } from '@pixpilot/shadcn-ui';
import { PlusIcon, Trash2Icon } from 'lucide-react';
import React from 'react';

export interface IArrayFieldProps {
  name: string;
  title?: string;
  children?: React.ReactNode;
}

/**
 * ArrayField component for managing array form fields
 * Provides add/remove functionality for dynamic field arrays
 */
export function ArrayField({ name, title, children }: IArrayFieldProps) {
  return (
    <FormilyArrayField name={name}>
      {(field) => {
        return (
          <div className="space-y-4">
            {title != null && <h3 className="text-lg font-medium">{title}</h3>}

            {field.value?.map((_: any, index: number) => (
              <div key={index} className="flex gap-2 items-start">
                <div className="flex-1">{children}</div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={async () => field.remove(index)}
                >
                  <Trash2Icon className="size-4" />
                </Button>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={async () => field.push({})}
              className="w-full"
            >
              <PlusIcon className="mr-2 size-4" />
              Add Item
            </Button>
          </div>
        );
      }}
    </FormilyArrayField>
  );
}
