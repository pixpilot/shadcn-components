import type { ISchema } from '@formily/react';

import { validateSchemaComponents } from '../../src/utils/validate-schema-components';

// Mock React components for testing
const Input = () => null;
const NumberInput = () => null;
const Checkbox = () => null;
const Select = () => null;
const CustomComponent = () => null;
const FormItem = () => null;

describe('validateSchemaComponents', () => {
  it('should be defined', () => {
    expect(validateSchemaComponents).toBeDefined();
  });

  describe('valid schemas', () => {
    it('should pass validation for valid schema with registered components', () => {
      const schema: ISchema = {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            'x-component': 'Input',
          },
        },
      };

      const components = {
        Input,
      };

      expect(() => validateSchemaComponents(schema, components)).not.toThrow();
    });

    it('should pass validation for schema with multiple valid components', () => {
      const schema: ISchema = {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            'x-component': 'Input',
            'x-decorator': 'FormItem',
          },
          age: {
            type: 'number',
            'x-component': 'NumberInput',
            'x-decorator': 'FormItem',
          },
          active: {
            type: 'boolean',
            'x-component': 'Checkbox',
            'x-decorator': 'FormItem',
          },
        },
      };

      const components = {
        Input,
        NumberInput,
        Checkbox,
        FormItem,
      };

      expect(() => validateSchemaComponents(schema, components)).not.toThrow();
    });

    it('should pass validation for schema without x-component', () => {
      const schema: ISchema = {
        type: 'object',
        properties: {
          name: {
            type: 'string',
          },
        },
      };

      const components = {};

      expect(() => validateSchemaComponents(schema, components)).not.toThrow();
    });

    it('should pass validation for schema without x-decorator', () => {
      const schema: ISchema = {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            'x-component': 'Input',
          },
        },
      };

      const components = {
        Input,
      };

      expect(() => validateSchemaComponents(schema, components)).not.toThrow();
    });

    it('should pass validation for nested schema', () => {
      const schema: ISchema = {
        type: 'object',
        properties: {
          user: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                'x-component': 'Input',
                'x-decorator': 'FormItem',
              },
            },
          },
        },
      };

      const components = {
        Input,
        FormItem,
      };

      expect(() => validateSchemaComponents(schema, components)).not.toThrow();
    });

    it('should pass validation for deeply nested schema', () => {
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
                    'x-component': 'Input',
                  },
                },
              },
            },
          },
        },
      };

      const components = {
        Input,
      };

      expect(() => validateSchemaComponents(schema, components)).not.toThrow();
    });

    it('should pass validation for array items schema', () => {
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
                  'x-component': 'Input',
                },
              },
            },
          },
        },
      };

      const components = {
        Input,
      };

      expect(() => validateSchemaComponents(schema, components)).not.toThrow();
    });

    it('should pass validation for empty schema', () => {
      const schema: ISchema = {};
      const components = {};

      expect(() => validateSchemaComponents(schema, components)).not.toThrow();
    });
  });

  describe('invalid component names', () => {
    it('should throw error when x-component is not registered', () => {
      const schema: ISchema = {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            'x-component': 'UnregisteredInput',
          },
        },
      };

      const components = {
        Input,
      };

      expect(() => validateSchemaComponents(schema, components)).toThrow(
        /Component 'UnregisteredInput'.*is not registered in the provided components/u,
      );
    });

    it('should throw error for multiple unregistered components', () => {
      const schema: ISchema = {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            'x-component': 'UnregisteredInput',
          },
          age: {
            type: 'number',
            'x-component': 'UnregisteredNumber',
          },
        },
      };

      const components = {
        Input,
      };

      expect(() => validateSchemaComponents(schema, components)).toThrow(
        /Schema validation failed/u,
      );
    });

    it('should include path information in error message', () => {
      const schema: ISchema = {
        type: 'object',
        properties: {
          user: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                'x-component': 'InvalidComponent',
              },
            },
          },
        },
      };

      const components = {
        Input,
      };

      expect(() => validateSchemaComponents(schema, components)).toThrow(/at path/u);
    });
  });

  describe('invalid decorator names', () => {
    it('should throw error when x-decorator is not registered', () => {
      const schema: ISchema = {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            'x-component': 'Input',
            'x-decorator': 'UnregisteredDecorator',
          },
        },
      };

      const components = {
        Input,
        FormItem,
      };

      expect(() => validateSchemaComponents(schema, components)).toThrow(
        /Decorator 'UnregisteredDecorator'.*is not registered in the provided components/u,
      );
    });

    it('should throw error when multiple decorators are unregistered', () => {
      const schema: ISchema = {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            'x-component': 'Input',
            'x-decorator': 'UnregisteredDecorator1',
          },
          email: {
            type: 'string',
            'x-component': 'Input',
            'x-decorator': 'UnregisteredDecorator2',
          },
        },
      };

      const components = {
        Input,
        FormItem,
      };

      expect(() => validateSchemaComponents(schema, components)).toThrow(
        /Schema validation failed/u,
      );
    });
  });

  describe('edge cases', () => {
    it('should handle schema with both valid and invalid components in nested structure', () => {
      const schema: ISchema = {
        type: 'object',
        properties: {
          valid: {
            type: 'string',
            'x-component': 'Input',
          },
          user: {
            type: 'object',
            properties: {
              invalid: {
                type: 'string',
                'x-component': 'InvalidComponent',
              },
            },
          },
        },
      };

      const components = {
        Input,
      };

      expect(() => validateSchemaComponents(schema, components)).toThrow(
        /InvalidComponent/u,
      );
    });

    it('should allow multiple field types with different components', () => {
      const schema: ISchema = {
        type: 'object',
        properties: {
          textField: {
            type: 'string',
            'x-component': 'Input',
          },
          selectField: {
            type: 'string',
            'x-component': 'Select',
          },
        },
      };

      const components = {
        Input,
        Select,
      };

      expect(() => validateSchemaComponents(schema, components)).not.toThrow();
    });

    it('should collect all validation errors before throwing', () => {
      const schema: ISchema = {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            'x-component': 'UnregisteredComponent1',
            'x-decorator': 'UnregisteredDecorator1',
          },
          age: {
            type: 'number',
            'x-component': 'UnregisteredComponent2',
          },
        },
      };

      const components = {
        Input,
      };

      const error = (() => {
        try {
          validateSchemaComponents(schema, components);
          return undefined;
        } catch (e) {
          return e as Error;
        }
      })();

      expect(error).toBeDefined();
      expect(error?.message).toMatch(/Schema validation failed/u);
      // Should contain multiple errors
      expect(error?.message.match(/is not registered/gu)?.length).toBeGreaterThan(1);
    });

    it('should handle schema with only type definition (no x-component)', () => {
      const schema: ISchema = {
        type: 'object',
        properties: {
          field: {
            type: 'customType',
          },
        },
      };

      const components = {
        CustomComponent,
      };

      expect(() => validateSchemaComponents(schema, components)).not.toThrow();
    });

    it('should validate schema with mixed registered and unregistered decorators', () => {
      const schema: ISchema = {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            'x-component': 'Input',
            'x-decorator': 'FormItem',
          },
          email: {
            type: 'string',
            'x-component': 'Input',
            'x-decorator': 'InvalidDecorator',
          },
        },
      };

      const components = {
        Input,
        FormItem,
      };

      expect(() => validateSchemaComponents(schema, components)).toThrow();
    });
  });
});
