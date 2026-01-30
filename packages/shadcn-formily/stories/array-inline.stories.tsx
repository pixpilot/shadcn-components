/* eslint-disable no-alert */
/* eslint-disable no-magic-numbers */

import type { Meta, StoryObj } from '@storybook/react';
import { createForm, Form, SchemaField } from '../src';
import { createStories } from './array-stories';

const meta: Meta<typeof Form> = {
  title: 'Formily/Array Inline',
  component: Form,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[800px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Form>;

const storyConfig = {
  componentName: 'ArrayInline',
  displayTitle: 'ArrayInline',
  componentProps: {
    className: 'space-y-2',
  },
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

export const InlineDeleteOnly: Story = {
  render: () => {
    const form = createForm({
      values: {
        contacts: [
          { name: 'Bob Builder', email: 'bob@example.com' },
          { name: 'Jane Smith', email: 'jane@example.com' },
        ],
      },
    });

    return (
      <Form
        form={form}
        className="space-y-6"
        onSubmit={(values) => {
          alert(JSON.stringify(values, null, 2));
        }}
      >
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">ArrayInline (Inline inputs + delete)</h2>
          <p className="text-muted-foreground">
            Each row renders inputs inline with a sortable handle and a delete button.
          </p>
        </div>

        <SchemaField>
          <SchemaField.Array
            name="contacts"
            x-component="ArrayInline"
            x-component-props={{
              sortable: true,
              actions: ['remove'],
              className: 'space-y-2',
            }}
          >
            <SchemaField.Object>
              <SchemaField.String
                name="name"
                title="Name"
                required
                x-decorator="FormItem"
                x-component="Input"
                x-component-props={{ placeholder: 'Enter name' }}
              />
              <SchemaField.String
                name="email"
                title="Email"
                required
                x-decorator="FormItem"
                x-component="Input"
                x-component-props={{ placeholder: 'Enter email', type: 'email' }}
              />
            </SchemaField.Object>
            <SchemaField.Void x-component="ArrayInline.Addition" title="Add Contact" />
          </SchemaField.Array>
        </SchemaField>

        <button
          type="submit"
          className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground"
        >
          Submit
        </button>
      </Form>
    );
  },
};
