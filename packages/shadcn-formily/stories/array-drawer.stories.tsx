/* eslint-disable no-alert */
/* eslint-disable no-magic-numbers */

import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@pixpilot/shadcn';
import React from 'react';

import { createForm, Form, SchemaField } from '../src';
import { createStories } from './array-stories';

const meta: Meta<typeof Form> = {
  title: 'Formily/Array Drawer',
  component: Form,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Form>;

const storyConfig = {
  componentName: 'ArrayDrawer',
  displayTitle: 'ArrayDrawer',
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
  WithItemClassName,
  WithItemClassNameDeclarative,
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
  WithItemClassName,
  WithItemClassNameDeclarative,
  WithItemReactionTitle,
  WithJSONSchema,
  WithJsonSchemaForm,
  WithMaxMinItems,
  WithTruncatedLabels,
};

export const LongDrawer: Story = {
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
          'x-component': 'ArrayDrawer',
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
            },
          },
          properties: {
            addition: {
              type: 'void',
              title: 'Add Item',
              'x-component': 'ArrayDrawer.Addition',
            },
          },
        },
      },
    };

    return (
      <Form id="array-drawer" form={form} className="space-y-6 w-[720px]">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Long Drawer Array</h2>
          <p className="text-muted-foreground">
            This array drawer contains many fields to demonstrate scrolling behavior in
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

export const SideDrawer: Story = {
  render: () => {
    const form = createForm({
      values: {
        items: [{ name: 'Locked Item', description: 'Edited in a right-side drawer.' }],
      },
    });

    const schema = {
      type: 'object',
      properties: {
        items: {
          type: 'array',
          'x-component': 'ArrayDrawer',
          'x-component-props': {
            drawerProps: { direction: 'right' },
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
              name: {
                type: 'string',
                title: 'Name',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
              },
              description: {
                type: 'string',
                title: 'Description',
                'x-decorator': 'FormItem',
                'x-component': 'Textarea',
                'x-component-props': { rows: 4 },
              },
            },
          },
          properties: {
            addition: {
              type: 'void',
              title: 'Add Item',
              'x-component': 'ArrayDrawer.Addition',
            },
          },
        },
      },
    };

    return (
      <Form form={form} className="space-y-6 w-[720px]">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Array Drawer (side panel)</h2>
          <p className="text-muted-foreground">
            Each item is edited in a drawer anchored to the right edge via{' '}
            <code>drawerProps.side</code>.
          </p>
        </div>

        <SchemaField schema={schema} />
      </Form>
    );
  },
};
