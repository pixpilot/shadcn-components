import type { Meta, StoryObj } from '@storybook/react';

import { createForm, Form, JsonSchemaFormExtended } from '../src';
import { createStories } from './array-stories';

type Story = StoryObj<typeof Form>;

const meta: Meta<typeof Form> = {
  title: 'Formily/Array Popover',
  component: Form,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  // decorators: [
  //   (Story) => (
  //     <div className="w-[700px]">
  //       <Story />
  //     </div>
  //   ),
  // ],
};

export default meta;
// type Story = StoryObj<typeof Form>;

const storyConfig = {
  componentName: 'ArrayPopover',
  displayTitle: 'ArrayPopover',
};

const {
  Declarative,
  EmptyArray,
  Sortable,
  SortableDisabledInForm,
  SortableNested,
  SortableDisabledForArray,
  WithActions,
  WithComponentClassName,
  WithDescription,
  WithItemReactionTitle,
  WithJSONSchema,
  WithJsonSchemaForm,
  WithTruncatedLabels,
  AutoSave,
  ManualSave,
  WithMaxMinItems,
} = createStories(storyConfig);

export {
  AutoSave,
  Declarative,
  EmptyArray,
  ManualSave,
  Sortable,
  SortableDisabledForArray,
  SortableDisabledInForm,
  SortableNested,
  WithActions,
  WithComponentClassName,
  WithDescription,
  WithItemReactionTitle,
  WithJSONSchema,
  WithJsonSchemaForm,
  WithMaxMinItems,
  WithTruncatedLabels,
};

export const WithModalDisabled: Story = {
  render: () => {
    const form = createForm({});

    const schema = {
      type: 'object',
      properties: {
        contacts: {
          type: 'array',
          title: 'Contacts',
          'x-decorator': 'FormItem',
          'x-component': 'ArrayPopover',
          'x-component-props': {
            className: 'space-y-4',
            popoverProps: {
              modal: false,
            },
          },
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
                required: true,
              },
              email: {
                type: 'string',
                title: 'Email',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
              },
            },
          },
        },
      },
    };

    return (
      <JsonSchemaFormExtended
        form={form}
        schema={schema}
        className="space-y-6"
        onSubmit={(values) => {
          // eslint-disable-next-line no-console
          console.log('Form submitted:', values);
        }}
      >
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Array Popover with Overlay</h2>
          <p className="text-muted-foreground">
            This form demonstrates the ArrayPopover component with overlay enabled.
          </p>
        </div>

        <button
          type="submit"
          className="mt-6 w-full rounded-md bg-primary px-4 py-2 text-primary-foreground"
        >
          Submit
        </button>
      </JsonSchemaFormExtended>
    );
  },
};
