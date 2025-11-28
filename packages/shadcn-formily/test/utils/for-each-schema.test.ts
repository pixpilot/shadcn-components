import { describe, expect, it, vi } from 'vitest';
import { forEachSchema } from '../../src/utils';

describe('forEachSchema', () => {
  describe('basic traversal', () => {
    it('should visit a simple string schema', () => {
      const schema = { type: 'string' } as any;
      const visit = vi.fn();

      forEachSchema(schema, visit);

      expect(visit).toHaveBeenCalledTimes(1);
      expect(visit).toHaveBeenCalledWith(schema, []);
    });

    it('should visit a simple number schema', () => {
      const schema = { type: 'number' } as any;
      const visit = vi.fn();

      forEachSchema(schema, visit);

      expect(visit).toHaveBeenCalledTimes(1);
      expect(visit).toHaveBeenCalledWith(schema, []);
    });
  });

  describe('object properties traversal', () => {
    it('should traverse object properties', () => {
      const schema = {
        type: 'object',
        properties: {
          name: { type: 'string' },
          age: { type: 'number' },
        },
      } as any;
      const visit = vi.fn();

      forEachSchema(schema, visit);

      expect(visit).toHaveBeenCalledTimes(3);
      expect(visit).toHaveBeenNthCalledWith(1, schema, []);
      expect(visit).toHaveBeenNthCalledWith(2, schema.properties!.name, ['name']);
      expect(visit).toHaveBeenNthCalledWith(3, schema.properties!.age, ['age']);
    });

    it('should traverse nested object properties', () => {
      const schema = {
        type: 'object',
        properties: {
          user: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              address: {
                type: 'object',
                properties: {
                  street: { type: 'string' },
                },
              },
            },
          },
        },
      } as any;
      const visit = vi.fn();

      forEachSchema(schema, visit);

      expect(visit).toHaveBeenCalledTimes(5);
      expect(visit).toHaveBeenCalledWith(schema, []);
      expect(visit).toHaveBeenCalledWith(schema.properties!.user, ['user']);
      expect(visit).toHaveBeenCalledWith(schema.properties!.user.properties.name, [
        'user',
        'name',
      ]);
      expect(visit).toHaveBeenCalledWith(schema.properties!.user.properties.address, [
        'user',
        'address',
      ]);
      expect(visit).toHaveBeenCalledWith(
        schema.properties!.user.properties.address.properties.street,
        ['user', 'address', 'street'],
      );
    });

    it('should handle object without properties', () => {
      const schema = { type: 'object' } as any;
      const visit = vi.fn();

      forEachSchema(schema, visit);

      expect(visit).toHaveBeenCalledTimes(1);
      expect(visit).toHaveBeenCalledWith(schema, []);
    });

    it('should handle empty properties object', () => {
      const schema = { type: 'object', properties: {} } as any;
      const visit = vi.fn();

      forEachSchema(schema, visit);

      expect(visit).toHaveBeenCalledTimes(1);
      expect(visit).toHaveBeenCalledWith(schema, []);
    });
  });

  describe('array items traversal', () => {
    it('should traverse array items', () => {
      const schema = {
        type: 'array',
        items: { type: 'string' },
      } as any;
      const visit = vi.fn();

      forEachSchema(schema, visit);

      expect(visit).toHaveBeenCalledTimes(2);
      expect(visit).toHaveBeenNthCalledWith(1, schema, []);
      expect(visit).toHaveBeenNthCalledWith(2, schema.items, ['items']);
    });

    it('should traverse nested array items', () => {
      const schema = {
        type: 'array',
        items: {
          type: 'array',
          items: { type: 'string' },
        },
      } as any;
      const visit = vi.fn();

      forEachSchema(schema, visit);

      expect(visit).toHaveBeenCalledTimes(3);
      expect(visit).toHaveBeenCalledWith(schema, []);
      expect(visit).toHaveBeenCalledWith(schema.items, ['items']);
      expect(visit).toHaveBeenCalledWith(schema.items.items, ['items', 'items']);
    });

    it('should traverse array of objects', () => {
      const schema = {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            age: { type: 'number' },
          },
        },
      } as any;
      const visit = vi.fn();

      forEachSchema(schema, visit);

      expect(visit).toHaveBeenCalledTimes(4);
      expect(visit).toHaveBeenCalledWith(schema, []);
      expect(visit).toHaveBeenCalledWith(schema.items, ['items']);
      expect(visit).toHaveBeenCalledWith(schema.items.properties.name, ['items', 'name']);
      expect(visit).toHaveBeenCalledWith(schema.items.properties.age, ['items', 'age']);
    });

    it('should handle array without items', () => {
      const schema = { type: 'array' } as any;
      const visit = vi.fn();

      forEachSchema(schema, visit);

      expect(visit).toHaveBeenCalledTimes(1);
      expect(visit).toHaveBeenCalledWith(schema, []);
    });

    it('should traverse properties on array schemas', () => {
      const schema = {
        type: 'array',
        properties: {
          length: { type: 'number' },
          description: { type: 'string' },
        },
      } as any;
      const visit = vi.fn();

      forEachSchema(schema, visit);

      expect(visit).toHaveBeenCalledTimes(3);
      expect(visit).toHaveBeenNthCalledWith(1, schema, []);
      expect(visit).toHaveBeenNthCalledWith(2, schema.properties!.length, ['length']);
      expect(visit).toHaveBeenNthCalledWith(3, schema.properties!.description, [
        'description',
      ]);
    });
  });

  describe('combinators (anyOf, oneOf, allOf)', () => {
    it('should traverse anyOf schemas', () => {
      const schema = {
        type: 'string',
        anyOf: [
          { type: 'string', minLength: 5 },
          { type: 'string', maxLength: 10 },
        ],
      } as any;
      const visit = vi.fn();

      forEachSchema(schema, visit);

      expect(visit).toHaveBeenCalledTimes(3);
      expect(visit).toHaveBeenNthCalledWith(1, schema, []);
      expect(visit).toHaveBeenNthCalledWith(2, schema.anyOf[0], ['anyOf', '0']);
      expect(visit).toHaveBeenNthCalledWith(3, schema.anyOf[1], ['anyOf', '1']);
    });

    it('should traverse oneOf schemas', () => {
      const schema = {
        oneOf: [{ type: 'string' }, { type: 'number' }],
      } as any;
      const visit = vi.fn();

      forEachSchema(schema, visit);

      expect(visit).toHaveBeenCalledTimes(3);
      expect(visit).toHaveBeenNthCalledWith(1, schema, []);
      expect(visit).toHaveBeenNthCalledWith(2, schema.oneOf[0], ['oneOf', '0']);
      expect(visit).toHaveBeenNthCalledWith(3, schema.oneOf[1], ['oneOf', '1']);
    });

    it('should traverse allOf schemas', () => {
      const schema = {
        allOf: [
          { type: 'object', properties: { name: { type: 'string' } } },
          { type: 'object', properties: { age: { type: 'number' } } },
        ],
      } as any;
      const visit = vi.fn();

      forEachSchema(schema, visit);

      expect(visit).toHaveBeenCalledTimes(5);
      expect(visit).toHaveBeenCalledWith(schema, []);
      expect(visit).toHaveBeenCalledWith(schema.allOf[0], ['allOf', '0']);
      expect(visit).toHaveBeenCalledWith(schema.allOf[0].properties.name, [
        'allOf',
        '0',
        'name',
      ]);
      expect(visit).toHaveBeenCalledWith(schema.allOf[1], ['allOf', '1']);
      expect(visit).toHaveBeenCalledWith(schema.allOf[1].properties.age, [
        'allOf',
        '1',
        'age',
      ]);
    });

    it('should traverse all combinators together', () => {
      const schema = {
        anyOf: [{ type: 'string' }],
        oneOf: [{ type: 'number' }],
        allOf: [{ type: 'boolean' }],
      } as any;
      const visit = vi.fn();

      forEachSchema(schema, visit);

      expect(visit).toHaveBeenCalledTimes(4);
      expect(visit).toHaveBeenCalledWith(schema, []);
      expect(visit).toHaveBeenCalledWith(schema.anyOf[0], ['anyOf', '0']);
      expect(visit).toHaveBeenCalledWith(schema.oneOf[0], ['oneOf', '0']);
      expect(visit).toHaveBeenCalledWith(schema.allOf[0], ['allOf', '0']);
    });

    it('should handle empty combinator arrays', () => {
      const schema = {
        type: 'string',
        anyOf: [],
        oneOf: [],
        allOf: [],
      } as any;
      const visit = vi.fn();

      forEachSchema(schema, visit);

      expect(visit).toHaveBeenCalledTimes(1);
      expect(visit).toHaveBeenCalledWith(schema, []);
    });
  });

  describe('early termination with return false', () => {
    it('should stop traversal when visit returns false', () => {
      const schema = {
        type: 'object',
        properties: {
          name: { type: 'string' },
          age: { type: 'number' },
        },
      } as any;
      const visit = vi.fn(() => false);

      forEachSchema(schema, visit);

      expect(visit).toHaveBeenCalledTimes(1);
      expect(visit).toHaveBeenCalledWith(schema, []);
    });

    it('should stop traversal at specific node', () => {
      const schema = {
        type: 'object',
        properties: {
          user: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              age: { type: 'number' },
            },
          },
          settings: {
            type: 'object',
            properties: {
              theme: { type: 'string' },
            },
          },
        },
      } as any;
      const visit = vi.fn((s: any, path: string[]) => {
        // Stop at 'user' node
        if (path[0] === 'user') return false;
        return undefined;
      });

      forEachSchema(schema, visit);

      expect(visit).toHaveBeenCalledTimes(4);
      expect(visit).toHaveBeenCalledWith(schema, []);
      expect(visit).toHaveBeenCalledWith(schema.properties!.user, ['user']);
      expect(visit).toHaveBeenCalledWith(schema.properties!.settings, ['settings']);
      expect(visit).toHaveBeenCalledWith(schema.properties!.settings.properties.theme, [
        'settings',
        'theme',
      ]);
    });

    it('should skip nested arrays when instructed', () => {
      const schema = {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            items: { type: 'string' },
          },
          name: { type: 'string' },
        },
      } as any;
      const visit = vi.fn((s: any, path: string[]) => {
        // Skip nested arrays
        if (path.length > 0 && s.type === 'array') return false;
        return undefined;
      });

      forEachSchema(schema, visit);

      expect(visit).toHaveBeenCalledTimes(3);
      expect(visit).toHaveBeenCalledWith(schema, []);
      expect(visit).toHaveBeenCalledWith(schema.properties!.items, ['items']);
      expect(visit).toHaveBeenCalledWith(schema.properties!.name, ['name']);
    });
  });

  describe('complex nested structures', () => {
    it('should traverse complex nested schema', () => {
      const schema = {
        type: 'object',
        properties: {
          users: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                addresses: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      street: { type: 'string' },
                      city: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
      } as any;
      const visit = vi.fn();

      forEachSchema(schema, visit);

      expect(visit).toHaveBeenCalledTimes(8);

      const paths = visit.mock.calls.map((call) => call[1].join('.'));
      expect(paths).toEqual([
        '',
        'users',
        'users.items',
        'users.items.name',
        'users.items.addresses',
        'users.items.addresses.items',
        'users.items.addresses.items.street',
        'users.items.addresses.items.city',
      ]);
    });

    it('should traverse schema with combinators and nested structures', () => {
      const schema = {
        type: 'object',
        properties: {
          data: {
            oneOf: [
              {
                type: 'object',
                properties: {
                  text: { type: 'string' },
                },
              },
              {
                type: 'array',
                items: { type: 'number' },
              },
            ],
          },
        },
      } as any;
      const visit = vi.fn();

      forEachSchema(schema, visit);

      expect(visit).toHaveBeenCalledTimes(6);

      const paths = visit.mock.calls.map((call) => call[1].join('.'));
      expect(paths).toContain('');
      expect(paths).toContain('data');
      expect(paths).toContain('data.oneOf.0');
      expect(paths).toContain('data.oneOf.0.text');
      expect(paths).toContain('data.oneOf.1');
      expect(paths).toContain('data.oneOf.1.items');
    });
  });

  describe('path tracking', () => {
    it('should provide correct paths for all nodes', () => {
      const schema = {
        type: 'object',
        properties: {
          a: {
            type: 'object',
            properties: {
              b: {
                type: 'object',
                properties: {
                  c: { type: 'string' },
                },
              },
            },
          },
        },
      } as any;
      const paths: string[][] = [];
      const visit = vi.fn((s: any, path: string[]) => {
        paths.push([...path]);
      });

      forEachSchema(schema, visit);

      expect(paths).toEqual([[], ['a'], ['a', 'b'], ['a', 'b', 'c']]);
    });

    it('should provide correct paths for array items', () => {
      const schema = {
        type: 'array',
        items: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
      } as any;
      const paths: string[][] = [];
      const visit = vi.fn((s: any, path: string[]) => {
        paths.push([...path]);
      });

      forEachSchema(schema, visit);

      expect(paths).toEqual([[], ['items'], ['items', 'items']]);
    });

    it('should provide correct paths for combinators with indices', () => {
      const schema = {
        anyOf: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }],
      } as any;
      const paths: string[][] = [];
      const visit = vi.fn((s: any, path: string[]) => {
        paths.push([...path]);
      });

      forEachSchema(schema, visit);

      expect(paths).toEqual([[], ['anyOf', '0'], ['anyOf', '1'], ['anyOf', '2']]);
    });
  });

  describe('edge cases', () => {
    it('should handle null/undefined properties gracefully', () => {
      const schema = {
        type: 'object',
        properties: undefined,
      } as any;
      const visit = vi.fn();

      expect(() => forEachSchema(schema, visit)).not.toThrow();
      expect(visit).toHaveBeenCalledTimes(1);
    });

    it('should handle schemas without type', () => {
      const schema = {
        properties: {
          name: { type: 'string' },
        },
      } as any;
      const visit = vi.fn();

      forEachSchema(schema, visit);

      // Visits the root schema and its properties even without type
      expect(visit).toHaveBeenCalledTimes(2);
      expect(visit).toHaveBeenNthCalledWith(1, schema, []);
      expect(visit).toHaveBeenNthCalledWith(2, schema.properties!.name, ['name']);
    });

    it('should handle deeply nested structures', () => {
      let deepSchema: any = { type: 'string' };
      for (let i = 0; i < 10; i++) {
        deepSchema = {
          type: 'object',
          properties: {
            nested: deepSchema,
          },
        };
      }
      const visit = vi.fn();

      expect(() => forEachSchema(deepSchema, visit)).not.toThrow();
      expect(visit).toHaveBeenCalledTimes(11);
    });

    it('should handle visit function that returns undefined (continue)', () => {
      const schema = {
        type: 'object',
        properties: {
          name: { type: 'string' },
        },
      } as any;
      const visit = vi.fn(() => undefined);

      forEachSchema(schema, visit);

      expect(visit).toHaveBeenCalledTimes(2);
    });

    it('should handle visit function that returns true (continue)', () => {
      const schema = {
        type: 'object',
        properties: {
          name: { type: 'string' },
        },
      } as any;
      const visit = vi.fn(() => true);

      forEachSchema(schema, visit);

      expect(visit).toHaveBeenCalledTimes(2);
    });
  });

  describe('comprehensive suite with mockReset', () => {
    describe('1. Basic Traversal (Objects)', () => {
      it('should visit the root node', () => {
        const schema = { type: 'string' } as any;
        const visitMock = vi.fn();

        forEachSchema(schema, visitMock);

        expect(visitMock).toHaveBeenCalledTimes(1);
        expect(visitMock).toHaveBeenCalledWith(schema, []);
      });

      it('should traverse object properties', () => {
        const schema = {
          type: 'object',
          properties: {
            name: { type: 'string' },
            age: { type: 'number' },
          },
        } as any;
        const visitMock = vi.fn();

        forEachSchema(schema, visitMock);

        // Should visit: Root, name, age
        expect(visitMock).toHaveBeenCalledTimes(3);

        // Check specific calls
        expect(visitMock).toHaveBeenCalledWith(schema.properties.name, ['name']);
        expect(visitMock).toHaveBeenCalledWith(schema.properties.age, ['age']);
      });
    });

    describe('2. Array Traversal', () => {
      it('should traverse array items', () => {
        const schema = {
          type: 'array',
          items: {
            type: 'string',
          },
        } as any;
        const visitMock = vi.fn();

        forEachSchema(schema, visitMock);

        expect(visitMock).toHaveBeenCalledWith(schema.items, ['items']);
      });
    });

    describe('3. Combinators (anyOf, oneOf, allOf)', () => {
      it('should traverse oneOf arrays with index in path', () => {
        const schema = {
          type: 'object',
          oneOf: [{ type: 'string' }, { type: 'number' }],
        } as any;
        const visitMock = vi.fn();

        forEachSchema(schema, visitMock);

        // Root + 2 sub-schemas
        expect(visitMock).toHaveBeenCalledTimes(3);

        // Check paths include the key and the index
        expect(visitMock).toHaveBeenCalledWith(schema.oneOf[0], ['oneOf', '0']);
        expect(visitMock).toHaveBeenCalledWith(schema.oneOf[1], ['oneOf', '1']);
      });

      it('should handle multiple combinators in one schema', () => {
        const schema = {
          anyOf: [{ type: 'string' }],
          allOf: [{ type: 'number' }],
        } as any;
        const visitMock = vi.fn();

        forEachSchema(schema, visitMock);

        expect(visitMock).toHaveBeenCalledWith(schema.anyOf[0], ['anyOf', '0']);
        expect(visitMock).toHaveBeenCalledWith(schema.allOf[0], ['allOf', '0']);
      });
    });

    describe('4. Pruning Logic (The "Return False" Feature)', () => {
      it('should stop traversal when visitor returns false', () => {
        const schema = {
          type: 'object',
          properties: {
            keep: { type: 'string' },
            skipMe: {
              type: 'object',
              properties: {
                hidden: { type: 'string' },
              },
            },
          },
        } as any;
        const visitMock = vi.fn((node: any, path: string[]) => {
          // If we hit the 'skipMe' node, return false
          if (path.includes('skipMe')) {
            return false;
          }
          return undefined;
        });

        forEachSchema(schema, visitMock);

        // Verify 'keep' was visited
        expect(visitMock).toHaveBeenCalledWith(schema.properties.keep, ['keep']);

        // Verify 'skipMe' was visited (the node itself)
        expect(visitMock).toHaveBeenCalledWith(schema.properties.skipMe, ['skipMe']);

        // CRITICAL: Verify 'hidden' (child of skipMe) was NEVER visited
        expect(visitMock).not.toHaveBeenCalledWith(
          expect.objectContaining({ type: 'string' }),
          expect.arrayContaining(['skipMe', 'hidden']),
        );
      });

      it('should correctly implement your specific use case: Ignore nested arrays', () => {
        const schema = {
          type: 'object',
          properties: {
            user: { type: 'string' },
            tags: {
              type: 'array',
              items: {
                type: 'object',
                properties: { id: { type: 'number' } },
              },
            },
          },
        } as any;
        const visitMock = vi.fn((node: any, path: string[]) => {
          // Your specific logic: If it's a nested array (has path), stop.
          if (path.length > 0 && node.type === 'array') {
            return false;
          }
          return undefined;
        });

        forEachSchema(schema, visitMock);

        // It should visit the array node itself
        expect(visitMock).toHaveBeenCalledWith(schema.properties.tags, ['tags']);

        // But it should NOT visit the items inside the array
        expect(visitMock).not.toHaveBeenCalledWith(expect.anything(), ['tags', 'items']);
      });
    });

    describe('5. Complex/Deeply Nested Paths', () => {
      it('should track deep paths accurately', () => {
        const schema = {
          type: 'object',
          properties: {
            users: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  details: {
                    oneOf: [
                      {
                        type: 'object',
                        properties: { deepField: { type: 'boolean' } },
                      },
                    ],
                  },
                },
              },
            },
          },
        } as any;
        const visitMock = vi.fn();

        forEachSchema(schema, visitMock);

        const expectedPath = ['users', 'items', 'details', 'oneOf', '0', 'deepField'];
        const deepNode =
          schema.properties.users.items.properties.details.oneOf[0].properties.deepField;

        expect(visitMock).toHaveBeenCalledWith(deepNode, expectedPath);
      });
    });
  });
});
