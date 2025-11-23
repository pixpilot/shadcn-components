/* eslint-disable ts/no-misused-promises */
import type { Meta, StoryObj } from '@storybook/react';
import { ArrayField } from '@formily/react';
import React from 'react';
import { createForm, Field, Form, FormItem, Input } from '../src';

const meta: Meta<typeof Form> = {
  title: 'Formily/Array Field',
  component: Form,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Form>;

export const DynamicList: Story = {
  render: () => {
    const form = createForm({
      initialValues: {
        contacts: [{ name: '', email: '' }],
      },
    });

    const JSON_INDENT = 2;

    return (
      <Form
        form={form}
        className="w-[600px]"
        onSubmit={(values) => {
          // eslint-disable-next-line no-console
          console.log('Form submitted:', values);
          // eslint-disable-next-line no-alert
          alert(JSON.stringify(values, null, JSON_INDENT));
        }}
      >
        <ArrayField name="contacts">
          {(field) => (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Contacts</h3>

              {field.value?.map((_: unknown, index: number) => (
                <div key={index} className="flex gap-2 items-start border rounded-lg p-4">
                  <div className="flex-1 space-y-4">
                    <Field
                      name={`contacts.${index}.name`}
                      title="Name"
                      required
                      decorator={[FormItem]}
                      component={[Input, { placeholder: 'Enter name' }]}
                    />
                    <Field
                      name={`contacts.${index}.email`}
                      title="Email"
                      required
                      decorator={[FormItem]}
                      component={[Input, { placeholder: 'Enter email', type: 'email' }]}
                    />
                  </div>
                  <button
                    type="button"
                    className="mt-8 rounded-md border px-3 py-2 hover:bg-muted"
                    onClick={async () => {
                      await field.remove(index);
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}

              <button
                type="button"
                className="w-full rounded-md border px-4 py-2 hover:bg-muted"
                onClick={async () => {
                  await field.push({ name: '', email: '' });
                }}
              >
                + Add Contact
              </button>
            </div>
          )}
        </ArrayField>

        <button
          type="submit"
          className="mt-6 w-full rounded-md bg-primary px-4 py-2 text-primary-foreground"
        >
          Submit
        </button>
      </Form>
    );
  },
};
