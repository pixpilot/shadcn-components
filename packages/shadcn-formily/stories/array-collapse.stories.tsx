/* eslint-disable no-alert */
/* eslint-disable no-magic-numbers */

import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@pixpilot/shadcn';
import { createForm, Form, SchemaField } from '../src';
import { createStories } from './array-stories';

const meta: Meta<typeof Form> = {
  title: 'Formily/Array Collapse',
  component: Form,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[700px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Form>;

const storyConfig = {
  componentName: 'ArrayCollapse',
  displayTitle: 'ArrayCollapse',
};

const {
  EmptyArray,
  WithActions,
  Declarative,
  WithTruncatedLabels,
  WithJSONSchema,
  WithItemReactionTitle,
  WithComponentClassName,
  Sortable,
  SortableNested,
} = createStories(storyConfig);

export {
  Declarative,
  EmptyArray,
  Sortable,
  SortableNested,
  WithActions,
  WithComponentClassName,
  WithItemReactionTitle,
  WithJSONSchema,
  WithTruncatedLabels,
};

export const AccordionMode: Story = {
  render: () => {
    const form = createForm({
      values: {
        contacts: [
          {
            name: 'Bob Builder',
            email: 'bob@example.com',
          },
          {
            name: 'Jane Smith',
            email: 'jane@example.com',
          },
        ],
      },
    });

    return (
      <Form form={form} className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Contact List (Collapse)</h2>
          <p className="text-muted-foreground">
            Click on a contact to expand and edit inline. The collapse keeps your list
            organized and compact.
          </p>
        </div>

        <SchemaField>
          <SchemaField.Array
            name="contacts"
            maxItems={10}
            x-component="ArrayCollapse"
            x-component-props={{
              mode: 'accordion',
              actions: ['up', 'down', 'remove'],
            }}
          >
            <SchemaField.Object x-component="ArrayCollapse.Item">
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
                x-component-props={{
                  placeholder: 'Enter email',
                  type: 'email',
                }}
              />
            </SchemaField.Object>
            <SchemaField.Void x-component="ArrayCollapse.Addition" title="Add Contact" />
          </SchemaField.Array>
        </SchemaField>

        <div className="border-t pt-4">
          <Button
            onClick={() => {
              form
                .submit()
                .then(() => {
                  alert(JSON.stringify(form.values, null, 2));
                })
                .catch(console.error);
            }}
          >
            Submit
          </Button>
        </div>
      </Form>
    );
  },
};
