# mcp

This package provides a local stdio MCP server for coding assistants that support the Model Context Protocol.

## Usage

To start the MCP server, run the following command:

```ts
type ComponentOwnProps = OwnProps<MyComponent, 'div'>;

export const meta: ComponentMeta<ComponentOwnProps> = {
  name: 'MyComponent',
  category: 'Actions',
  description:
    'An example component that demonstrates how to define metadata for a component in a TypeScript project.',
  htmlElement: 'div',
  props: defineProps<ButtonOwnProps>({
    prop1: {
      type: 'string',
      description: 'A string prop for the component.',
      defaultValue: 'default value',
    },
  }),
  examples: [
    {
      title: 'Default Component',
      code: '<MyComponent>Hello World</MyComponent>',
    },
  ],
  keywords: ['component', 'example', 'typescript'],
};
```
