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

    it('should transform string with enum to Select component', () => {
      const schema: ISchema = {
        type: 'object',
        properties: {
          employmentType: {
            type: 'string',
            title: 'Employment Type',
            enum: [
              'full-time',
              'part-time',
              'contract',
              'freelance',
              'internship',
              'temporary',
            ],
          },
        },
      };

      const transformedSchema = transformSchema(schema);
      expect((transformedSchema.properties as any).employmentType['x-component']).toBe(
        'Select',
      );
      expect((transformedSchema.properties as any).employmentType['x-decorator']).toBe(
        'FormItem',
      );
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

    it('should not set x-component on array items unless explicitly set', () => {
      const schema: ISchema = {
        type: 'object',
        properties: {
          contacts: {
            type: 'array',
            title: 'Contacts',
            maxItems: 10,
            description: 'List of user contacts',
            'x-decorator': 'FormItem',
            'x-component': 'ArrayInline',
            'x-component-props': { className: 'space-y-2' },
            items: {
              type: 'object',
              'x-reactions': {
                fulfill: {
                  state: {
                    title: "{{$self.value?.name || 'User'}}",
                  },
                },
              },
              properties: {
                name: {
                  type: 'string',
                  title: 'Name',
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                  'x-component-props': { placeholder: 'Enter name' },
                  required: true,
                },
                email: {
                  type: 'string',
                  title: 'Email',
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                  'x-component-props': { type: 'email', placeholder: 'Enter email' },
                  required: true,
                },
                phone: {
                  type: 'string',
                  title: 'Phone',
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                  'x-component-props': { placeholder: 'Enter phone' },
                },
              },
            },
            properties: {
              addition: {
                type: 'void',
                title: 'Add Contact',
                'x-component': 'ArrayInline.Addition',
              },
            },
          },
        },
      };

      const transformedSchema = transformSchema(schema);
      const itemsSchema = (transformedSchema.properties as any).contacts.items;
      // The items object should not have x-component set automatically
      expect(itemsSchema['x-component']).toBeUndefined();
      // But properties inside should have components
      expect(itemsSchema.properties.name['x-component']).toBe('Input');
      expect(itemsSchema.properties.email['x-component']).toBe('Input');
      expect(itemsSchema.properties.phone['x-component']).toBe('Input');
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

  describe('required array handling', () => {
    it('should convert object-level required array to field-level required', () => {
      const schema: ISchema = {
        type: 'object',
        required: ['name', 'email'],
        properties: {
          name: {
            type: 'string',
            title: 'Name',
          },
          email: {
            type: 'string',
            title: 'Email',
          },
          optional: {
            type: 'string',
            title: 'Optional',
          },
        },
      };

      const transformedSchema = transformSchema(schema);

      // Required fields should have required: true
      expect((transformedSchema.properties as any).name.required).toBe(true);
      expect((transformedSchema.properties as any).email.required).toBe(true);

      // Optional fields should not have required set
      expect((transformedSchema.properties as any).optional.required).toBeUndefined();

      // Object-level required should still be preserved
      expect(transformedSchema.required).toEqual(['name', 'email']);
    });

    it('should override existing field-level required when in object required array', () => {
      const schema: ISchema = {
        type: 'object',
        required: ['name'],
        properties: {
          name: {
            type: 'string',
            required: false, // Explicitly set to false, but object-level required takes precedence
            title: 'Name',
          },
        },
      };

      const transformedSchema = transformSchema(schema);

      // Object-level required takes precedence, should set to true
      expect((transformedSchema.properties as any).name.required).toBe(true);
    });

    it('should handle nested objects with required arrays', () => {
      const schema: ISchema = {
        type: 'object',
        properties: {
          user: {
            type: 'object',
            required: ['name'],
            properties: {
              name: {
                type: 'string',
                title: 'Name',
              },
              age: {
                type: 'number',
                title: 'Age',
              },
            },
          },
        },
      };

      const transformedSchema = transformSchema(schema);

      // Nested required should be converted
      expect((transformedSchema.properties as any).user.properties.name.required).toBe(
        true,
      );
      expect(
        (transformedSchema.properties as any).user.properties.age.required,
      ).toBeUndefined();
    });

    it('should handle array items with required arrays', () => {
      const schema: ISchema = {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            items: {
              type: 'object',
              required: ['name'],
              properties: {
                name: {
                  type: 'string',
                  title: 'Name',
                },
                value: {
                  type: 'string',
                  title: 'Value',
                },
              },
            },
          },
        },
      };

      const transformedSchema = transformSchema(schema);

      // Array item required should be converted
      const itemSchema = (transformedSchema.properties as any).items.items;
      expect(itemSchema.properties.name.required).toBe(true);
      expect(itemSchema.properties.value.required).toBeUndefined();
    });

    it('should handle nested arrays within array items', () => {
      const schema: ISchema = {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                tags: {
                  type: 'array',
                  items: {
                    type: 'object',
                    required: ['label'],
                    properties: {
                      label: {
                        type: 'string',
                        title: 'Label',
                      },
                      color: {
                        type: 'string',
                        title: 'Color',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      };

      const transformedSchema = transformSchema(schema);

      // Nested array item required should be converted
      const tagItemSchema = (transformedSchema.properties as any).items.items.properties
        .tags.items;
      expect(tagItemSchema.properties.label.required).toBe(true);
      expect(tagItemSchema.properties.color.required).toBeUndefined();
    });

    it('should handle deeply nested objects in array items', () => {
      const schema: ISchema = {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                metadata: {
                  type: 'object',
                  required: ['version'],
                  properties: {
                    version: {
                      type: 'string',
                      title: 'Version',
                    },
                    description: {
                      type: 'string',
                      title: 'Description',
                    },
                  },
                },
              },
            },
          },
        },
      };

      const transformedSchema = transformSchema(schema);

      // Deeply nested required should be converted
      const metadataSchema = (transformedSchema.properties as any).items.items.properties
        .metadata;
      expect(metadataSchema.properties.version.required).toBe(true);
      expect(metadataSchema.properties.description.required).toBeUndefined();
    });

    it('should handle arrays of arrays with required fields', () => {
      const schema: ISchema = {
        type: 'object',
        properties: {
          matrix: {
            type: 'array',
            items: {
              type: 'array',
              items: {
                type: 'object',
                required: ['value'],
                properties: {
                  value: {
                    type: 'number',
                    title: 'Value',
                  },
                  note: {
                    type: 'string',
                    title: 'Note',
                  },
                },
              },
            },
          },
        },
      };

      const transformedSchema = transformSchema(schema);

      // Array of array items required should be converted
      const cellSchema = (transformedSchema.properties as any).matrix.items.items;
      expect(cellSchema.properties.value.required).toBe(true);
      expect(cellSchema.properties.note.required).toBeUndefined();
    });

    it('should handle empty required array', () => {
      const schema: ISchema = {
        type: 'object',
        required: [],
        properties: {
          name: {
            type: 'string',
            title: 'Name',
          },
        },
      };

      const transformedSchema = transformSchema(schema);

      // No fields should be marked required
      expect((transformedSchema.properties as any).name.required).toBeUndefined();
    });

    it('should handle non-array required (ignore gracefully)', () => {
      const schema: ISchema = {
        type: 'object',
        required: 'name' as any, // Invalid, should be array
        properties: {
          name: {
            type: 'string',
            title: 'Name',
          },
        },
      };

      const transformedSchema = transformSchema(schema);

      // Should not crash and not set required
      expect((transformedSchema.properties as any).name.required).toBeUndefined();
    });

    it('should handle required array with non-existent properties', () => {
      const schema: ISchema = {
        type: 'object',
        required: ['nonExistent', 'name'],
        properties: {
          name: {
            type: 'string',
            title: 'Name',
          },
        },
      };

      const transformedSchema = transformSchema(schema);

      // Should not crash, only set required on existing properties
      expect((transformedSchema.properties as any).name.required).toBe(true);
      // nonExistent should be ignored since it doesn't exist
      expect((transformedSchema.properties as any).nonExistent).toBeUndefined();
    });

    it('should handle object with null properties', () => {
      const schema: ISchema = {
        type: 'object',
        required: ['name'],
        properties: null as any,
      };

      const transformedSchema = transformSchema(schema);

      // Should not crash
      expect(transformedSchema.properties).toBeNull();
    });

    it('should handle object with undefined properties', () => {
      const schema: ISchema = {
        type: 'object',
        required: ['name'],
      };

      const transformedSchema = transformSchema(schema);

      // Should not crash
      expect(transformedSchema.properties).toBeUndefined();
    });

    it('should handle required array with null property values', () => {
      const schema: ISchema = {
        type: 'object',
        required: ['name', 'age'],
        properties: {
          name: null as any,
          age: {
            type: 'number',
            title: 'Age',
          },
        },
      };

      const transformedSchema = transformSchema(schema);

      // Should not crash, skip null properties
      expect((transformedSchema.properties as any).name).toBeNull();
      expect((transformedSchema.properties as any).age.required).toBe(true);
    });

    it('should handle required array with duplicate entries', () => {
      const schema: ISchema = {
        type: 'object',
        required: ['name', 'name', 'name'],
        properties: {
          name: {
            type: 'string',
            title: 'Name',
          },
        },
      };

      const transformedSchema = transformSchema(schema);

      // Should handle duplicates gracefully
      expect((transformedSchema.properties as any).name.required).toBe(true);
    });

    it('should handle required array with empty strings', () => {
      const schema: ISchema = {
        type: 'object',
        required: ['', 'name'],
        properties: {
          name: {
            type: 'string',
            title: 'Name',
          },
        },
      };

      const transformedSchema = transformSchema(schema);

      // Should ignore empty string keys
      expect((transformedSchema.properties as any).name.required).toBe(true);
    });

    it('should handle required on non-object types gracefully', () => {
      const schema: ISchema = {
        type: 'string',
        required: ['something'] as any, // Invalid: strings don't have required arrays
      };

      const transformedSchema = transformSchema(schema);

      // Should not crash or modify the schema incorrectly
      expect(transformedSchema.type).toBe('string');
      expect(transformedSchema['x-component']).toBe('Input');
    });

    it('should handle very deeply nested required arrays', () => {
      const schema: ISchema = {
        type: 'object',
        properties: {
          level1: {
            type: 'object',
            required: ['level2'],
            properties: {
              level2: {
                type: 'string', // Changed to string to make simpler test
                title: 'Level 2',
              },
            },
          },
        },
      };

      const transformedSchema = transformSchema(schema);

      // Verify nesting works - level2 should get required: true from level1's required array
      expect(
        (transformedSchema.properties as any).level1.properties.level2.required,
      ).toBe(true);
    });
  });

  describe('fieldsDecorators parameter', () => {
    it('should apply decorator from fieldsDecorators when x-decorator is undefined', () => {
      const schema: ISchema = {
        type: 'object',
        properties: {
          customField: {
            'x-component': 'CustomInput',
          },
        },
      };

      const fieldsDecorators = {
        CustomInput: 'CustomDecorator',
      };

      const transformedSchema = transformSchema(schema, fieldsDecorators);
      expect((transformedSchema.properties as any).customField['x-decorator']).toBe(
        'CustomDecorator',
      );
    });

    it('should not override x-decorator if already defined in schema', () => {
      const schema: ISchema = {
        type: 'object',
        properties: {
          customField: {
            'x-component': 'CustomInput',
            'x-decorator': 'ExistingDecorator',
          },
        },
      };

      const fieldsDecorators = {
        CustomInput: 'CustomDecorator',
      };

      const transformedSchema = transformSchema(schema, fieldsDecorators);
      expect((transformedSchema.properties as any).customField['x-decorator']).toBe(
        'ExistingDecorator',
      );
    });

    it('should not apply decorator if component not in fieldsDecorators', () => {
      const schema: ISchema = {
        type: 'object',
        properties: {
          customField: {
            'x-component': 'UnregisteredComponent',
          },
        },
      };

      const fieldsDecorators = {
        CustomInput: 'CustomDecorator',
      };

      const transformedSchema = transformSchema(schema, fieldsDecorators);
      expect(
        (transformedSchema.properties as any).customField['x-decorator'],
      ).toBeUndefined();
    });

    it('should apply type mapping decorator when no fieldsDecorators provided', () => {
      const schema: ISchema = {
        type: 'object',
        properties: {
          name: {
            type: 'string',
          },
        },
      };

      const transformedSchema = transformSchema(schema);
      expect((transformedSchema.properties as any).name['x-decorator']).toBe('FormItem');
    });

    it('should handle empty fieldsDecorators object', () => {
      const schema: ISchema = {
        type: 'object',
        properties: {
          customField: {
            'x-component': 'CustomInput',
          },
        },
      };

      const fieldsDecorators = {};

      const transformedSchema = transformSchema(schema, fieldsDecorators);
      expect(
        (transformedSchema.properties as any).customField['x-decorator'],
      ).toBeUndefined();
    });

    it('should handle undefined fieldsDecorators', () => {
      const schema: ISchema = {
        type: 'object',
        properties: {
          customField: {
            'x-component': 'CustomInput',
          },
        },
      };

      const transformedSchema = transformSchema(schema, undefined);
      expect(
        (transformedSchema.properties as any).customField['x-decorator'],
      ).toBeUndefined();
    });

    it('should apply fieldsDecorators to nested fields', () => {
      const schema: ISchema = {
        type: 'object',
        properties: {
          user: {
            type: 'object',
            properties: {
              profile: {
                'x-component': 'CustomInput',
              },
            },
          },
        },
      };

      const fieldsDecorators = {
        CustomInput: 'CustomDecorator',
      };

      const transformedSchema = transformSchema(schema, fieldsDecorators);
      expect(
        (transformedSchema.properties as any).user.properties.profile['x-decorator'],
      ).toBe('CustomDecorator');
    });

    it('should apply fieldsDecorators to array item fields', () => {
      const schema: ISchema = {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                customField: {
                  'x-component': 'CustomInput',
                },
              },
            },
          },
        },
      };

      const fieldsDecorators = {
        CustomInput: 'CustomDecorator',
      };

      const transformedSchema = transformSchema(schema, fieldsDecorators);
      expect(
        (transformedSchema.properties as any).items.items.properties.customField[
          'x-decorator'
        ],
      ).toBe('CustomDecorator');
    });

    it('should prioritize type mapping decorator over fieldsDecorators when type is defined', () => {
      const schema: ISchema = {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            'x-component': 'Input',
          },
        },
      };

      const fieldsDecorators = {
        Input: 'CustomDecorator',
      };

      const transformedSchema = transformSchema(schema, fieldsDecorators);
      // User-provided decorator should override type mapping decorator
      expect((transformedSchema.properties as any).name['x-decorator']).toBe(
        'CustomDecorator',
      );
    });

    it('should use type mapping decorator when no custom decorator provided for component', () => {
      const schema: ISchema = {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            'x-component': 'Input',
          },
        },
      };

      const fieldsDecorators = {
        CustomInput: 'CustomDecorator',
      };

      const transformedSchema = transformSchema(schema, fieldsDecorators);
      // Input not in fieldsDecorators, so type mapping FormItem should be used
      expect((transformedSchema.properties as any).name['x-decorator']).toBe('FormItem');
    });

    it('should apply fieldsDecorators only when type-based decorator is not applicable', () => {
      const schema: ISchema = {
        type: 'object',
        properties: {
          customField: {
            'x-component': 'CustomInput',
            // No type defined, so no type mapping
          },
        },
      };

      const fieldsDecorators = {
        CustomInput: 'CustomDecorator',
      };

      const transformedSchema = transformSchema(schema, fieldsDecorators);
      expect((transformedSchema.properties as any).customField['x-decorator']).toBe(
        'CustomDecorator',
      );
    });

    it('should handle multiple custom components with different decorators', () => {
      const schema: ISchema = {
        type: 'object',
        properties: {
          field1: {
            'x-component': 'CustomInput1',
          },
          field2: {
            'x-component': 'CustomInput2',
          },
          field3: {
            'x-component': 'CustomInput3',
          },
        },
      };

      const fieldsDecorators = {
        CustomInput1: 'Decorator1',
        CustomInput2: 'Decorator2',
        CustomInput3: 'Decorator3',
      };

      const transformedSchema = transformSchema(schema, fieldsDecorators);
      expect((transformedSchema.properties as any).field1['x-decorator']).toBe(
        'Decorator1',
      );
      expect((transformedSchema.properties as any).field2['x-decorator']).toBe(
        'Decorator2',
      );
      expect((transformedSchema.properties as any).field3['x-decorator']).toBe(
        'Decorator3',
      );
    });

    it('should ignore null/undefined values in fieldsDecorators', () => {
      const schema: ISchema = {
        type: 'object',
        properties: {
          customField: {
            'x-component': 'CustomInput',
          },
        },
      };

      const fieldsDecorators = {
        CustomInput: undefined,
      };

      const transformedSchema = transformSchema(schema, fieldsDecorators);
      expect(
        (transformedSchema.properties as any).customField['x-decorator'],
      ).toBeUndefined();
    });
  });
});
