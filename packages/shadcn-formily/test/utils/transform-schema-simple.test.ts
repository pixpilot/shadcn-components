import type { ISchema } from '@formily/react';

import { transformSchema } from '../../src/utils/transform-schema';

describe('transformSchema', () => {
  it('should be defined', () => {
    expect(transformSchema).toBeDefined();
  });

  describe('basic type mapping', () => {
    it('should transform string type to Input component', () => {
      const schema: ISchema = {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            title: 'Name',
          },
        },
      };

      const transformedSchema = transformSchema(schema);
      expect((transformedSchema.properties as any).name['x-component']).toBe('Input');
      expect((transformedSchema.properties as any).name['x-decorator']).toBe('FormItem');
    });

    it('should transform number type to NumberInput component', () => {
      const schema: ISchema = {
        type: 'object',
        properties: {
          age: {
            type: 'number',
            title: 'Age',
          },
        },
      };

      const transformedSchema = transformSchema(schema);
      expect((transformedSchema.properties as any).age['x-component']).toBe(
        'NumberInput',
      );
      expect((transformedSchema.properties as any).age['x-decorator']).toBe('FormItem');
    });

    it('should transform integer type to NumberInput component', () => {
      const schema: ISchema = {
        type: 'object',
        properties: {
          count: {
            type: 'integer',
            title: 'Count',
          },
        },
      };

      const transformedSchema = transformSchema(schema);
      expect((transformedSchema.properties as any).count['x-component']).toBe(
        'NumberInput',
      );
      expect((transformedSchema.properties as any).count['x-decorator']).toBe('FormItem');
    });

    it('should transform boolean type to Checkbox component', () => {
      const schema: ISchema = {
        type: 'object',
        properties: {
          active: {
            type: 'boolean',
            title: 'Active',
          },
        },
      };

      const transformedSchema = transformSchema(schema);
      expect((transformedSchema.properties as any).active['x-component']).toBe(
        'Checkbox',
      );
      expect((transformedSchema.properties as any).active['x-decorator']).toBe(
        'FormItem',
      );
    });

    it('should transform array type to ArrayCards component', () => {
      const schema: ISchema = {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            title: 'Items',
          },
        },
      };

      const transformedSchema = transformSchema(schema);
      expect((transformedSchema.properties as any).items['x-component']).toBe(
        'ArrayCards',
      );
      expect((transformedSchema.properties as any).items['x-decorator']).toBe('FormItem');
    });

    it('should transform object type to ObjectContainer component', () => {
      const schema: ISchema = {
        type: 'object',
        properties: {
          nested: {
            type: 'object',
            title: 'Nested',
          },
        },
      };

      const transformedSchema = transformSchema(schema);
      expect((transformedSchema.properties as any).nested['x-component']).toBe(
        'ObjectContainer',
      );
      expect((transformedSchema.properties as any).nested['x-decorator']).toBeUndefined();
    });
  });

  describe('nested properties', () => {
    it('should transform nested properties', () => {
      const schema: ISchema = {
        type: 'object',
        properties: {
          user: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
              },
              email: {
                type: 'string',
              },
            },
          },
        },
      };

      const transformedSchema = transformSchema(schema);
      expect((transformedSchema.properties as any).user['x-component']).toBe(
        'ObjectContainer',
      );
      expect(
        (transformedSchema.properties as any).user.properties.name['x-component'],
      ).toBe('Input');
      expect(
        (transformedSchema.properties as any).user.properties.name['x-decorator'],
      ).toBe('FormItem');
      expect(
        (transformedSchema.properties as any).user.properties.email['x-component'],
      ).toBe('Input');
      expect(
        (transformedSchema.properties as any).user.properties.email['x-decorator'],
      ).toBe('FormItem');
    });

    it('should transform deeply nested properties', () => {
      const schema: ISchema = {
        type: 'object',
        properties: {
          level1: {
            type: 'object',
            properties: {
              level2: {
                type: 'object',
                properties: {
                  level3: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
      };

      const transformedSchema = transformSchema(schema);
      expect((transformedSchema.properties as any).level1['x-component']).toBe(
        'ObjectContainer',
      );
      expect(
        (transformedSchema.properties as any).level1.properties.level2['x-component'],
      ).toBe('ObjectContainer');
      expect(
        (transformedSchema.properties as any).level1.properties.level2.properties.level3[
          'x-component'
        ],
      ).toBe('Input');
    });

    it('should transform array items schema', () => {
      const schema: ISchema = {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                },
              },
            },
          },
        },
      };

      const transformedSchema = transformSchema(schema);
      expect((transformedSchema.properties as any).items['x-component']).toBe(
        'ArrayCards',
      );
      const itemsSchema = (transformedSchema.properties as any).items.items;
      expect(itemsSchema.properties.name['x-component']).toBe('Input');
    });
  });

  describe('respect existing x-component', () => {
    it('should not override existing x-component', () => {
      const schema: ISchema = {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            'x-component': 'CustomInput',
            title: 'Name',
          },
        },
      };

      const transformedSchema = transformSchema(schema);
      expect((transformedSchema.properties as any).name['x-component']).toBe(
        'CustomInput',
      );
    });

    it('should add decorator even when x-component is pre-set', () => {
      const schema: ISchema = {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            'x-component': 'CustomInput',
          },
        },
      };

      const transformedSchema = transformSchema(schema);
      expect((transformedSchema.properties as any).name['x-component']).toBe(
        'CustomInput',
      );
      expect((transformedSchema.properties as any).name['x-decorator']).toBe('FormItem');
    });
  });

  describe('hidden component handling', () => {
    it('should not add decorator for Hidden component (lowercase)', () => {
      const schema: ISchema = {
        type: 'object',
        properties: {
          hidden: {
            type: 'string',
            'x-component': 'hidden',
          },
        },
      };

      const transformedSchema = transformSchema(schema);
      expect((transformedSchema.properties as any).hidden['x-component']).toBe('hidden');
      expect((transformedSchema.properties as any).hidden['x-decorator']).toBeUndefined();
    });

    it('should not add decorator for Hidden component (PascalCase)', () => {
      const schema: ISchema = {
        type: 'object',
        properties: {
          hidden: {
            type: 'string',
            'x-component': 'Hidden',
          },
        },
      };

      const transformedSchema = transformSchema(schema);
      expect((transformedSchema.properties as any).hidden['x-component']).toBe('Hidden');
      expect((transformedSchema.properties as any).hidden['x-decorator']).toBeUndefined();
    });

    it('should add decorator to field transformed by type mapping if not Hidden', () => {
      const schema: ISchema = {
        type: 'object',
        properties: {
          field: {
            type: 'string',
          },
        },
      };

      const transformedSchema = transformSchema(schema);
      expect((transformedSchema.properties as any).field['x-component']).toBe('Input');
      expect((transformedSchema.properties as any).field['x-decorator']).toBe('FormItem');
    });
  });

  describe('complex scenarios', () => {
    it('should handle schema without properties', () => {
      const schema: ISchema = {
        type: 'string',
      };

      const transformedSchema = transformSchema(schema);
      expect(transformedSchema['x-component']).toBe('Input');
      expect(transformedSchema['x-decorator']).toBe('FormItem');
    });

    it('should handle empty schema', () => {
      const schema: ISchema = {};
      const transformedSchema = transformSchema(schema);
      expect(transformedSchema).toEqual({});
    });

    it('should transform all type combinations in one schema', () => {
      const schema: ISchema = {
        type: 'object',
        properties: {
          name: { type: 'string' },
          age: { type: 'number' },
          active: { type: 'boolean' },
          tags: { type: 'array' },
          metadata: { type: 'object' },
          count: { type: 'integer' },
        },
      };

      const transformedSchema = transformSchema(schema);
      expect((transformedSchema.properties as any).name['x-component']).toBe('Input');
      expect((transformedSchema.properties as any).age['x-component']).toBe(
        'NumberInput',
      );
      expect((transformedSchema.properties as any).active['x-component']).toBe(
        'Checkbox',
      );
      expect((transformedSchema.properties as any).tags['x-component']).toBe(
        'ArrayCards',
      );
      expect((transformedSchema.properties as any).metadata['x-component']).toBe(
        'ObjectContainer',
      );
      expect((transformedSchema.properties as any).count['x-component']).toBe(
        'NumberInput',
      );
    });

    it('should preserve other schema properties during transformation', () => {
      const schema: ISchema = {
        type: 'object',
        title: 'User Form',
        description: 'A form for user data',
        required: ['name'],
        properties: {
          name: {
            type: 'string',
            title: 'Full Name',
            description: 'Enter your full name',
            minLength: 1,
            maxLength: 100,
          },
        },
      };

      const transformedSchema = transformSchema(schema);
      expect(transformedSchema.title).toBe('User Form');
      expect(transformedSchema.description).toBe('A form for user data');
      expect(transformedSchema.required).toEqual(['name']);
      expect((transformedSchema.properties as any).name.title).toBe('Full Name');
      expect((transformedSchema.properties as any).name.description).toBe(
        'Enter your full name',
      );
      expect((transformedSchema.properties as any).name.minLength).toBe(1);
      expect((transformedSchema.properties as any).name.maxLength).toBe(100);
      expect((transformedSchema.properties as any).name['x-component']).toBe('Input');
    });

    it('should handle unknown types gracefully', () => {
      const schema: ISchema = {
        type: 'object',
        properties: {
          unknown: {
            type: 'unknownType',
          },
        },
      };

      const transformedSchema = transformSchema(schema);
      expect(
        (transformedSchema.properties as any).unknown['x-component'],
      ).toBeUndefined();
      expect(
        (transformedSchema.properties as any).unknown['x-decorator'],
      ).toBeUndefined();
    });

    it('should not mutate the original schema and return a transformed clone', () => {
      const schema: ISchema = {
        type: 'object',
        properties: {
          name: { type: 'string' },
        },
      };

      const originalSchemaString = JSON.stringify(schema);

      const result = transformSchema(schema);

      // Original schema should be unchanged
      expect(JSON.stringify(schema)).toBe(originalSchemaString);
      expect(result).not.toBe(schema);

      // Result should have the transformations
      expect((result.properties as any).name['x-component']).toBe('Input');
    });
  });
});
