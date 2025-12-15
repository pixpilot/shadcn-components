import type React from 'react';

import { extractFieldsDecorators } from '../../src/utils/extract-fields-decorators';

describe('extractFieldsDecorators', () => {
  it('should be defined', () => {
    expect(extractFieldsDecorators).toBeDefined();
  });

  describe('basic extraction', () => {
    it('should extract single decorator from fields', () => {
      const fields = {
        Input: {
          component: (() => null) as React.ComponentType<any>,
          decorator: 'FormItem',
        },
      };

      const result = extractFieldsDecorators(fields);
      expect(result).toEqual({ Input: 'FormItem' });
    });

    it('should extract multiple decorators from fields', () => {
      const fields = {
        Input: {
          component: (() => null) as React.ComponentType<any>,
          decorator: 'FormItem',
        },
        CustomInput: {
          component: (() => null) as React.ComponentType<any>,
          decorator: 'CustomDecorator',
        },
        Select: {
          component: (() => null) as React.ComponentType<any>,
          decorator: 'FieldDecorator',
        },
      };

      const result = extractFieldsDecorators(fields);
      expect(result).toEqual({
        Input: 'FormItem',
        CustomInput: 'CustomDecorator',
        Select: 'FieldDecorator',
      });
    });

    it('should skip fields without decorator', () => {
      const fields = {
        Input: {
          component: (() => null) as React.ComponentType<any>,
          decorator: 'FormItem',
        },
        CustomInput: {
          component: (() => null) as React.ComponentType<any>,
        },
      };

      const result = extractFieldsDecorators(fields);
      expect(result).toEqual({ Input: 'FormItem' });
    });

    it('should skip fields with undefined decorator', () => {
      const fields = {
        Input: {
          component: (() => null) as React.ComponentType<any>,
          decorator: 'FormItem',
        },
        CustomInput: {
          component: (() => null) as React.ComponentType<any>,
          decorator: undefined,
        },
      };

      const result = extractFieldsDecorators(fields);
      expect(result).toEqual({ Input: 'FormItem' });
    });

    it('should skip fields with null decorator', () => {
      const fields = {
        Input: {
          component: (() => null) as React.ComponentType<any>,
          decorator: 'FormItem',
        },
        CustomInput: {
          component: (() => null) as React.ComponentType<any>,
          decorator: null as any,
        },
      };

      const result = extractFieldsDecorators(fields);
      expect(result).toEqual({ Input: 'FormItem' });
    });
  });

  describe('edge cases', () => {
    it('should return empty object when fields is undefined', () => {
      const result = extractFieldsDecorators(undefined);
      expect(result).toEqual({});
    });

    it('should return empty object when fields is empty', () => {
      const result = extractFieldsDecorators({});
      expect(result).toEqual({});
    });

    it('should return empty object when no fields have decorators', () => {
      const fields = {
        Input: {
          component: (() => null) as React.ComponentType<any>,
        },
        CustomInput: {
          component: (() => null) as React.ComponentType<any>,
        },
      };

      const result = extractFieldsDecorators(fields);
      expect(result).toEqual({});
    });

    it('should handle fields with empty string decorator', () => {
      const fields = {
        Input: {
          component: (() => null) as React.ComponentType<any>,
          decorator: '',
        },
      };

      const result = extractFieldsDecorators(fields);
      expect(result).toEqual({ Input: '' });
    });

    it('should handle fields with special characters in decorator name', () => {
      const fields = {
        Input: {
          component: (() => null) as React.ComponentType<any>,
          decorator: 'Custom_Decorator-01',
        },
      };

      const result = extractFieldsDecorators(fields);
      expect(result).toEqual({ Input: 'Custom_Decorator-01' });
    });
  });

  describe('component types', () => {
    it('should extract decorators regardless of component type', () => {
      const DummyComponent = () => null;

      const fields = {
        CustomComponent: {
          component: DummyComponent as React.ComponentType<any>,
          decorator: 'MyDecorator',
        },
      };

      const result = extractFieldsDecorators(fields);
      expect(result).toEqual({ CustomComponent: 'MyDecorator' });
    });

    it('should handle complex component objects', () => {
      const ComplexComponent = {
        displayName: 'ComplexComponent',
      } as React.ComponentType<any>;

      const fields = {
        ComplexField: {
          component: ComplexComponent,
          decorator: 'ComplexDecorator',
        },
      };

      const result = extractFieldsDecorators(fields);
      expect(result).toEqual({ ComplexField: 'ComplexDecorator' });
    });
  });

  describe('field key handling', () => {
    it('should preserve field keys as-is', () => {
      const fields = {
        MyCustomInput: {
          component: (() => null) as React.ComponentType<any>,
          decorator: 'Decorator1',
        },
        input_field: {
          component: (() => null) as React.ComponentType<any>,
          decorator: 'Decorator2',
        },
        'INPUT-FIELD': {
          component: (() => null) as React.ComponentType<any>,
          decorator: 'Decorator3',
        },
      };

      const result = extractFieldsDecorators(fields);
      expect(result).toEqual({
        MyCustomInput: 'Decorator1',
        input_field: 'Decorator2',
        'INPUT-FIELD': 'Decorator3',
      });
    });

    it('should handle numeric string keys', () => {
      const fields = {
        '0': {
          component: (() => null) as React.ComponentType<any>,
          decorator: 'Decorator0',
        },
        '1': {
          component: (() => null) as React.ComponentType<any>,
          decorator: 'Decorator1',
        },
      };

      const result = extractFieldsDecorators(fields);
      expect(result).toEqual({
        '0': 'Decorator0',
        '1': 'Decorator1',
      });
    });
  });

  describe('return type', () => {
    it('should always return a new object', () => {
      const fields = {
        Input: {
          component: (() => null) as React.ComponentType<any>,
          decorator: 'FormItem',
        },
      };

      const result1 = extractFieldsDecorators(fields);
      const result2 = extractFieldsDecorators(fields);

      expect(result1).not.toBe(result2);
      expect(result1).toEqual(result2);
    });

    it('should not mutate input fields object', () => {
      const fields = {
        Input: {
          component: (() => null) as React.ComponentType<any>,
          decorator: 'FormItem',
        },
      };

      const fieldsCopy = JSON.parse(
        JSON.stringify(fields, (key, value) => {
          if (typeof value === 'function') return '[Function]';
          return value;
        }),
      );

      extractFieldsDecorators(fields);

      expect(
        JSON.parse(
          JSON.stringify(fields, (key, value) => {
            if (typeof value === 'function') return '[Function]';
            return value;
          }),
        ),
      ).toEqual(fieldsCopy);
    });

    it('should return typed Record<string, string | undefined>', () => {
      const fields = {
        Input: {
          component: (() => null) as React.ComponentType<any>,
          decorator: 'FormItem',
        },
      };

      const result = extractFieldsDecorators(fields);

      // Verify it's a plain object
      expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
      // Verify it has the expected properties
      expect(typeof result.Input).toBe('string');
    });
  });

  describe('integration scenarios', () => {
    it('should work with realistic field configuration', () => {
      const fields = {
        Input: {
          component: (() => null) as React.ComponentType<any>,
          decorator: 'FormItem',
        },
        NumberInput: {
          component: (() => null) as React.ComponentType<any>,
          decorator: 'FormItem',
        },
        Checkbox: {
          component: (() => null) as React.ComponentType<any>,
          decorator: 'FormItem',
        },
        CustomPicker: {
          component: (() => null) as React.ComponentType<any>,
          decorator: 'CustomFieldWrapper',
        },
        HiddenField: {
          component: (() => null) as React.ComponentType<any>,
          // No decorator for hidden field
        },
      };

      const result = extractFieldsDecorators(fields);

      expect(result).toEqual({
        Input: 'FormItem',
        NumberInput: 'FormItem',
        Checkbox: 'FormItem',
        CustomPicker: 'CustomFieldWrapper',
      });
      expect(result.HiddenField).toBeUndefined();
    });

    it('should handle mixed decorator types', () => {
      const fields = {
        StandardField: {
          component: (() => null) as React.ComponentType<any>,
          decorator: 'FormItem',
        },
        GridField: {
          component: (() => null) as React.ComponentType<any>,
          decorator: 'GridItem',
        },
        CardField: {
          component: (() => null) as React.ComponentType<any>,
          decorator: 'CardWrapper',
        },
      };

      const result = extractFieldsDecorators(fields);

      expect(Object.keys(result).length).toBe(3);
      expect(result.StandardField).toBe('FormItem');
      expect(result.GridField).toBe('GridItem');
      expect(result.CardField).toBe('CardWrapper');
    });
  });
});
