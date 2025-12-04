import { transformSchema } from '../../src/utils/transform-schema';

describe('transformSchema', () => {
  it('should be defined', () => {
    expect(transformSchema).toBeDefined();
  });

  it('should test', () => {
    const schema = {
      type: 'object',
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
    };

    const transformedSchema = transformSchema(schema);
    expect(transformedSchema).toEqual(schema);
  });
});
