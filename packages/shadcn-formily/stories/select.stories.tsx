/* eslint-disable no-console */
/* eslint-disable no-alert */
import type { Meta, StoryObj } from '@storybook/react';
import { observer } from '@formily/react';
import { useMemo } from 'react';
import { createForm, Form, SchemaField } from '../src';

const JSON_INDENT = 2;

const meta: Meta<typeof Form> = {
  title: 'Formily/Select',
  component: Form,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Form>;

export const BasicSelect: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        employmentType: {
          type: 'string',
          title: 'Employment Type',
          enum: [
            'full-time',
            'part-time',
            'contract',
            'freelance',
            'internship',
            'temporary',
          ],
          'x-decorator': 'FormItem',
          'x-component': 'Select',
        },
      },
    };

    return (
      <Form
        form={form}
        className="w-[400px]"
        onSubmit={(values) => {
          console.log('Form submitted:', values);
          alert(JSON.stringify(values, null, JSON_INDENT));
        }}
      >
        <SchemaField schema={schema} />
        <button
          type="submit"
          className="mt-4 w-full rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          Submit
        </button>
      </Form>
    );
  },
};

export const SelectWithDefaultValue: Story = {
  render: () => {
    const form = createForm({
      initialValues: {
        priority: 'medium',
      },
    });

    const schema = {
      type: 'object',
      properties: {
        priority: {
          type: 'string',
          title: 'Priority Level',
          enum: ['low', 'medium', 'high', 'urgent'],
          'x-decorator': 'FormItem',
          'x-component': 'Select',
        },
      },
    };

    return (
      <Form
        form={form}
        className="w-[400px]"
        onSubmit={(values) => {
          console.log('Form submitted:', values);
          alert(JSON.stringify(values, null, JSON_INDENT));
        }}
      >
        <SchemaField schema={schema} />
        <button
          type="submit"
          className="mt-4 w-full rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          Submit
        </button>
      </Form>
    );
  },
};

export const SelectInNestedObject: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        userProfile: {
          type: 'object',
          title: 'User Profile',
          properties: {
            country: {
              type: 'string',
              title: 'Country',
              enum: [
                'United States',
                'Canada',
                'United Kingdom',
                'Germany',
                'France',
                'Japan',
              ],
              'x-decorator': 'FormItem',
              'x-component': 'Select',
            },
            language: {
              type: 'string',
              title: 'Preferred Language',
              enum: ['English', 'Spanish', 'French', 'German', 'Japanese', 'Chinese'],
              'x-decorator': 'FormItem',
              'x-component': 'Select',
            },
          },
        },
      },
    };

    return (
      <Form
        form={form}
        className="w-[400px]"
        onSubmit={(values) => {
          console.log('Form submitted:', values);
          alert(JSON.stringify(values, null, JSON_INDENT));
        }}
      >
        <SchemaField schema={schema} />
        <button
          type="submit"
          className="mt-4 w-full rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          Submit
        </button>
      </Form>
    );
  },
};

export const RequiredSelect: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        department: {
          type: 'string',
          title: 'Department',
          required: true,
          enum: ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'],
          'x-decorator': 'FormItem',
          'x-component': 'Select',
        },
        role: {
          type: 'string',
          title: 'Role',
          required: true,
          enum: ['Manager', 'Senior', 'Junior', 'Intern'],
          'x-decorator': 'FormItem',
          'x-component': 'Select',
        },
      },
    };

    return (
      <Form
        form={form}
        className="w-[400px]"
        onSubmit={(values) => {
          console.log('Form submitted:', values);
          alert(JSON.stringify(values, null, JSON_INDENT));
        }}
      >
        <SchemaField schema={schema} />
        <button
          type="submit"
          className="mt-4 w-full rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          Submit
        </button>
      </Form>
    );
  },
};

export const SelectWithFormattedLabels: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          title: 'Status',
          enum: ['pending-approval', 'in-progress', 'completed', 'cancelled'],
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            mapOption: (option: { value: string | number; label: string }) => ({
              ...option,
              label: option.value
                .toString()
                .split('-')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' '),
            }),
          },
        },
      },
    };

    return (
      <Form
        form={form}
        className="w-[400px]"
        onSubmit={(values) => {
          console.log('Form submitted:', values);
          alert(JSON.stringify(values, null, JSON_INDENT));
        }}
      >
        <SchemaField schema={schema} />
        <button
          type="submit"
          className="mt-4 w-full rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          Submit
        </button>
      </Form>
    );
  },
};

export const DeclarativeSelect: Story = {
  render: () => {
    const Component = observer(() => {
      const form = useMemo(
        () =>
          createForm({
            values: {
              country: 'us',
              language: 'en',
            },
          }),
        [],
      );

      return (
        <Form
          form={form}
          className="w-[400px]"
          onSubmit={(values) => {
            console.log('Form submitted:', values);
            alert(JSON.stringify(values, null, JSON_INDENT));
          }}
        >
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">User Preferences</h3>

            <SchemaField>
              <SchemaField.String
                name="country"
                title="Country"
                x-decorator="FormItem"
                x-component="Select"
                enum={['us', 'ca', 'uk', 'de', 'fr', 'jp']}
                x-component-props={{
                  mapOption: (option: { value: string | number; label: string }) => {
                    const countryNames: Record<string, string> = {
                      us: 'United States',
                      ca: 'Canada',
                      uk: 'United Kingdom',
                      de: 'Germany',
                      fr: 'France',
                      jp: 'Japan',
                    };
                    return {
                      ...option,
                      label: countryNames[option.value.toString()] ?? option.label,
                    };
                  },
                }}
              />
              <SchemaField.String
                name="language"
                title="Language"
                x-decorator="FormItem"
                x-component="Select"
                enum={['en', 'es', 'fr', 'de', 'ja', 'zh']}
                x-component-props={{
                  mapOption: (option: { value: string | number; label: string }) => {
                    const languageNames: Record<string, string> = {
                      en: 'English',
                      es: 'Spanish',
                      fr: 'French',
                      de: 'German',
                      ja: 'Japanese',
                      zh: 'Chinese',
                    };
                    return {
                      ...option,
                      label: languageNames[option.value.toString()] ?? option.label,
                    };
                  },
                }}
              />
              <SchemaField.String
                name="theme"
                title="Theme"
                x-decorator="FormItem"
                x-component="Select"
                enum={['light', 'dark', 'auto']}
                default="auto"
              />
            </SchemaField>
          </div>
          <pre className="mt-4 text-sm">
            {JSON.stringify(form.values, null, JSON_INDENT)}
          </pre>
          <button
            type="submit"
            className="mt-4 w-full rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
          >
            Submit
          </button>
        </Form>
      );
    });
    return <Component />;
  },
};
