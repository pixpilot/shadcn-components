import type { ISchema } from '@formily/react';

import { validateSchemaShape } from '../../src/utils/validate-schema-shape';

describe('validateSchemaShape', () => {
  it('should be defined', () => {
    expect(validateSchemaShape).toBeDefined();
  });

  describe('valid schemas', () => {
    it('should pass for a plain typed field', () => {
      const schema: ISchema = {
        type: 'object',
        properties: {
          name: { type: 'string' },
        },
      };

      expect(() => validateSchemaShape(schema)).not.toThrow();
    });

    it('should allow a combinator when the node also has a concrete type', () => {
      const schema: ISchema = {
        type: 'object',
        properties: {
          key: {
            type: 'string',
            anyOf: [{ minLength: 1 }, { maxLength: 10 }],
          } as ISchema,
        },
      };

      expect(() => validateSchemaShape(schema)).not.toThrow();
    });

    it('should allow a combinator node when an explicit x-component is set', () => {
      const schema: ISchema = {
        type: 'object',
        properties: {
          key: {
            'x-component': 'Input',
            anyOf: [{ type: 'string' }, { type: 'null' }],
          } as ISchema,
        },
      };

      expect(() => validateSchemaShape(schema)).not.toThrow();
    });

    it('should ignore empty combinator arrays', () => {
      const schema: ISchema = {
        type: 'object',
        properties: {
          key: { anyOf: [] } as unknown as ISchema,
        },
      };

      expect(() => validateSchemaShape(schema)).not.toThrow();
    });
  });

  describe('invalid schemas', () => {
    it('should throw on a typeless anyOf field node (the zod .or(literal) case)', () => {
      const schema: ISchema = {
        type: 'object',
        properties: {
          key: {
            anyOf: [
              { type: 'string', pattern: '^[a-z0-9_]+$' },
              { type: 'string', const: '' },
            ],
          } as unknown as ISchema,
        },
      };

      expect(() => validateSchemaShape(schema)).toThrow(/anyOf/u);
      expect(() => validateSchemaShape(schema)).toThrow(/key/u);
    });

    it('should throw on a typeless oneOf field node', () => {
      const schema: ISchema = {
        type: 'object',
        properties: {
          value: {
            oneOf: [{ type: 'string' }, { type: 'number' }],
          } as unknown as ISchema,
        },
      };

      expect(() => validateSchemaShape(schema)).toThrow(/oneOf/u);
    });

    it('should include the json pointer path in the message', () => {
      const schema: ISchema = {
        type: 'object',
        properties: {
          nested: {
            type: 'object',
            properties: {
              broken: {
                anyOf: [{ type: 'string' }, { type: 'null' }],
              } as unknown as ISchema,
            },
          },
        },
      };

      expect(() => validateSchemaShape(schema)).toThrow(
        /properties\/nested\/properties\/broken/u,
      );
    });

    it('should collect multiple offending nodes into one error', () => {
      const schema: ISchema = {
        type: 'object',
        properties: {
          a: { anyOf: [{ type: 'string' }, { type: 'null' }] } as unknown as ISchema,
          b: { oneOf: [{ type: 'number' }, { type: 'null' }] } as unknown as ISchema,
        },
      };

      let message = '';
      try {
        validateSchemaShape(schema);
      } catch (error) {
        message = (error as Error).message;
      }

      expect(message).toMatch(/anyOf/u);
      expect(message).toMatch(/oneOf/u);
    });
  });
});
