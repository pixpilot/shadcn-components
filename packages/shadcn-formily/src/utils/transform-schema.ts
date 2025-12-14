/* eslint-disable no-param-reassign */
import type { ISchema } from '@formily/react';
import traverse from 'json-schema-traverse';

interface InputSchemaMap {
  [key: string]: {
    'x-component': string;
    'x-decorator'?: string;
  };
}

const inputSchemaMap: InputSchemaMap = {
  string: {
    'x-component': 'Input',
    'x-decorator': 'FormItem',
  },
  number: {
    'x-component': 'NumberInput',
    'x-decorator': 'FormItem',
  },
  integer: {
    'x-component': 'NumberInput',
    'x-decorator': 'FormItem',
  },
  boolean: {
    'x-component': 'Checkbox',
    'x-decorator': 'FormItem',
  },
  array: {
    'x-component': 'ArrayCards',
    'x-decorator': 'FormItem',
  },
  object: {
    'x-component': 'ObjectContainer',
  },
};

export function transformSchema(schema: ISchema): ISchema {
  traverse(schema, {
    allKeys: true,
    cb: (currentSchema) => {
      const { type } = currentSchema;

      if (typeof type === 'string' && type in inputSchemaMap) {
        const mapping = inputSchemaMap[type]!;
        if (currentSchema['x-component'] == null) {
          currentSchema['x-component'] = mapping['x-component'];
        }
        if (!['Hidden', 'hidden'].includes(currentSchema['x-component'] as string)) {
          currentSchema['x-decorator'] = mapping['x-decorator'];
        }
      }
    },
  });

  return schema;
}
