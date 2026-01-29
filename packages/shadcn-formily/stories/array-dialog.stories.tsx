/* eslint-disable no-alert */
/* eslint-disable no-magic-numbers */

import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@pixpilot/shadcn';

import { createForm, Form, SchemaField } from '../src';
import { createStories } from './array-stories';

const meta: Meta<typeof Form> = {
  title: 'Formily/Array Dialog',
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
type Story = StoryObj<typeof Form>;

const storyConfig = {
  componentName: 'ArrayDialog',
  displayTitle: 'ArrayDialog',
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
  WithTruncatedLabels,
};

export const LongDialog: Story = {
  render: () => {
    const form = createForm({
      values: {
        items: [
          {
            name: 'Sample Item 1',
            description: 'This is a sample description for the first item.',
          },
        ],
      },
    });

    const schema = {
      type: 'object',
      properties: {
        items: {
          type: 'array',
          'x-component': 'ArrayDialog',
          'x-component-props': {
            className: 'max-h-[80vh] overflow-y-auto',
          },
          items: {
            type: 'object',
            'x-reactions': {
              fulfill: {
                state: {
                  title: "{{$self.value?.name || 'Item'}}",
                },
              },
            },
            properties: {
              ...Array.from({ length: 30 }, (_, i) => ({
                [`field${i + 1}`]: {
                  type: 'string',
                  title: `Field ${i + 1}`,
                  required: i < 2, // Make first two fields required
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                  'x-component-props': {
                    placeholder: `Enter value for field ${i + 1}`,
                  },
                },
              })).reduce((acc, curr) => ({ ...acc, ...curr }), {}),
              description: {
                type: 'string',
                title: 'Description',
                'x-decorator': 'FormItem',
                'x-component': 'Textarea',
                'x-component-props': {
                  placeholder: 'Enter a detailed description',
                  rows: 4,
                },
              },
              notes: {
                type: 'string',
                title: 'Additional Notes',
                'x-decorator': 'FormItem',
                'x-component': 'Textarea',
                'x-component-props': {
                  placeholder: 'Any additional notes or comments',
                  rows: 3,
                },
              },
            },
          },
          properties: {
            addition: {
              type: 'void',
              title: 'Add Item',
              'x-component': 'ArrayDialog.Addition',
            },
          },
        },
      },
    };

    return (
      <Form form={form} className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Long Dialog Array</h2>
          <p className="text-muted-foreground">
            This array dialog contains many fields to demonstrate scrolling behavior in
            long forms.
          </p>
        </div>

        <SchemaField schema={schema} />

        <div className="border-t pt-4">
          <Button
            type="button"
            onClick={() => alert(JSON.stringify(form.values, null, 2))}
          >
            View Data
          </Button>
        </div>
      </Form>
    );
  },
};
