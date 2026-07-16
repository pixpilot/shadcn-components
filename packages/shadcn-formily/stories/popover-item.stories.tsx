import type { Meta, StoryObj } from '@storybook/react';
import type { ISchema } from '../src';
import { observer } from '@formily/react';
import { useMemo } from 'react';
import { createForm, defaultComponentRegistry, JsonSchemaFormRenderer } from '../src';
import { BasePopoverItem } from '../src/components/popover-item';

const meta: Meta<typeof BasePopoverItem> = {
  title: 'Formily/Popover Item',
  component: BasePopoverItem,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-100">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof BasePopoverItem>;

const JSON_INDENT = 2;

/**
 * Schema `default`s on the fields inside the popover. Because the inputs stay
 * mounted (hidden) while it is closed, the defaults land in `form.values`
 * without the popover ever being opened — the preview below shows them on load,
 * and the trigger reads "Edit" rather than "Add" because the field holds data.
 */
export const DefaultValues: Story = {
  render: () => {
    const Component = observer(() => {
      const form = useMemo(() => createForm(), []);
      const schema: ISchema = {
        type: 'object',
        properties: {
          profile: {
            type: 'object',
            title: 'Profile',
            description: 'Every field below has a default.',
            'x-decorator': 'PopoverItem',
            'x-decorator-props': {
              modal: true,
              'data-testid': 'profile-decorator',
            },
            'x-component-props': {
              variant: 'flat',
              label: false,
              description: false,
            },
            properties: {
              firstName: {
                type: 'string',
                title: 'First Name',
                default: 'Ada',
                'x-decorator-props': {
                  'data-testid': 'first-name-decorator',
                },
              },
              age: {
                type: 'number',
                title: 'Age',
                default: 36,
                'x-decorator-props': {
                  'data-testid': 'age-decorator',
                },
              },
              country: {
                type: 'string',
                title: 'Country',
                enum: ['United Kingdom', 'Germany', 'France'],
                default: 'United Kingdom',
                'x-decorator-props': {
                  'data-testid': 'country-decorator',
                },
              },
              subscribed: {
                type: 'boolean',
                title: 'Subscribed',
                default: true,
                'x-decorator-props': {
                  'data-testid': 'subscribed-decorator',
                },
              },
            },
          },
        },
      };

      return (
        <JsonSchemaFormRenderer
          form={form}
          components={{
            fields: defaultComponentRegistry,
          }}
          schema={schema}
        >
          <pre className="bg-muted text-muted-foreground mt-6 rounded-md p-3 text-xs">
            {JSON.stringify(form.values, null, JSON_INDENT)}
          </pre>
        </JsonSchemaFormRenderer>
      );
    });

    return <Component />;
  },
};

/**
 * A single field's default, with the form's `initialValues` overriding it —
 * `bio` shows the initial value, `nickname` falls back to its schema default.
 */
export const DefaultValuesOnSingleFields: Story = {
  render: () => {
    const Component = observer(() => {
      const form = useMemo(
        () =>
          createForm({
            initialValues: {
              bio: 'Loaded from initialValues.',
            },
          }),
        [],
      );
      const schema: ISchema = {
        type: 'object',
        properties: {
          bio: {
            type: 'string',
            title: 'Bio',
            description: 'initialValues wins over the schema default.',
            default: 'This default is overridden.',
            'x-decorator': 'PopoverItem',
            'x-decorator-props': {
              'data-testid': 'bio-decorator',
            },
            'x-component': 'Textarea',
          },
          nickname: {
            type: 'string',
            title: 'Nickname',
            description: 'No initial value, so the schema default applies.',
            default: 'Countess',
            'x-decorator': 'PopoverItem',
            'x-decorator-props': {
              'data-testid': 'nickname-decorator',
            },
            'x-component': 'Input',
          },
        },
      };

      return (
        <JsonSchemaFormRenderer
          form={form}
          components={{
            fields: defaultComponentRegistry,
          }}
          schema={schema}
        >
          <pre className="bg-muted text-muted-foreground mt-6 rounded-md p-3 text-xs">
            {JSON.stringify(form.values, null, JSON_INDENT)}
          </pre>
        </JsonSchemaFormRenderer>
      );
    });

    return <Component />;
  },
};

export const JsonSchemaForm: Story = {
  render: () => {
    const form = createForm();
    const schema: ISchema = {
      type: 'object',
      properties: {
        age: {
          description: 'Enter your age in years.',
          type: 'number',
          title: 'Age',
          default: 25,
          'x-decorator': 'PopoverItem',
          'x-decorator-props': {
            'data-testid': 'age-decorator',
          },
          'x-component': 'NumberInput',
        },
      },
    };

    return (
      <JsonSchemaFormRenderer
        id="popover-item"
        form={form}
        components={{
          fields: defaultComponentRegistry,
        }}
        schema={schema}
      />
    );
  },
};

export const AlongsideFormItemFields: Story = {
  render: () => {
    const form = createForm();
    const schema: ISchema = {
      type: 'object',
      properties: {
        firstName: {
          type: 'string',
          title: 'First Name',
          'x-decorator-props': {
            'data-testid': 'first-name-decorator',
          },
        },
        bio: {
          type: 'string',
          title: 'Bio',
          description: 'Tell us about yourself.',
          'x-decorator': 'PopoverItem',
          'x-decorator-props': {
            'data-testid': 'bio-decorator',
          },
          'x-component': 'Textarea',
        },
        lastName: {
          type: 'string',
          title: 'Last Name',
          'x-decorator-props': {
            'data-testid': 'last-name-decorator',
          },
        },
      },
    };

    return (
      <JsonSchemaFormRenderer
        form={form}
        components={{
          fields: defaultComponentRegistry,
        }}
        schema={schema}
      />
    );
  },
};

export const Validation: Story = {
  render: () => {
    const form = createForm();
    const schema: ISchema = {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          title: 'Email',
          description: 'Type an invalid email, then click outside — the popover shakes.',
          required: true,
          format: 'email',
          'x-decorator': 'PopoverItem',
          'x-decorator-props': {
            'data-testid': 'email-decorator',
          },
          'x-component': 'Input',
        },
      },
    };

    return (
      <JsonSchemaFormRenderer
        form={form}
        components={{
          fields: defaultComponentRegistry,
        }}
        schema={schema}
      />
    );
  },
};

export const SubmitMarksTriggerInvalid: Story = {
  render: () => {
    const form = createForm();
    const schema: ISchema = {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          title: 'Email',
          description: 'Submit without opening the popover — the trigger turns red.',
          required: true,
          format: 'email',
          'x-decorator': 'PopoverItem',
          'x-decorator-props': {
            'data-testid': 'email-decorator',
          },
          'x-component': 'Input',
        },
      },
    };

    return (
      <JsonSchemaFormRenderer
        form={form}
        components={{
          fields: defaultComponentRegistry,
        }}
        schema={schema}
        onSubmit={(values) => {
          // eslint-disable-next-line no-console
          console.log('Form submitted:', values);
        }}
      >
        <button
          type="submit"
          data-testid="submit-button"
          className="bg-primary text-primary-foreground mt-6 w-full rounded-md px-4 py-2"
        >
          Submit
        </button>
      </JsonSchemaFormRenderer>
    );
  },
};

export const TriggerLabelFromReaction: Story = {
  render: () => {
    const form = createForm();
    const schema: ISchema = {
      type: 'object',
      properties: {
        bio: {
          type: 'string',
          title: 'Bio',
          description: 'The trigger text follows the value typed in the popover.',
          'x-decorator': 'PopoverItem',
          'x-decorator-props': {
            'data-testid': 'bio-decorator',
          },
          'x-component': 'Textarea',
          // Decorator props come from decoratorProps, not componentProps.
          'x-reactions': {
            fulfill: {
              state: {
                decoratorProps: {
                  trigger: {
                    label:
                      "{{$self.value ? $self.value.length + ' characters written' : 'Write a bio'}}",
                  },
                },
              },
            },
          },
        },
      },
    };

    return (
      <JsonSchemaFormRenderer
        form={form}
        components={{
          fields: defaultComponentRegistry,
        }}
        schema={schema}
      />
    );
  },
};

export const ReactionTogglesVisibility: Story = {
  render: () => {
    const form = createForm();
    const schema: ISchema = {
      type: 'object',
      properties: {
        hasPet: {
          type: 'boolean',
          title: 'I have a pet',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            'data-testid': 'has-pet-decorator',
          },
          'x-component': 'Switch',
        },
        petName: {
          type: 'string',
          title: 'Pet Name',
          description: 'Only shown while the switch above is on.',
          'x-decorator': 'PopoverItem',
          'x-decorator-props': {
            'data-testid': 'pet-name-decorator',
          },
          'x-component': 'Input',
          'x-reactions': {
            dependencies: ['hasPet'],
            fulfill: {
              state: {
                visible: '{{!!$deps[0]}}',
              },
            },
          },
        },
      },
    };

    return (
      <JsonSchemaFormRenderer
        form={form}
        components={{
          fields: defaultComponentRegistry,
        }}
        schema={schema}
      />
    );
  },
};

/**
 * The decorator on an array: the whole ArrayCards list — add, remove, sort, and
 * each item's fields — lives in the popover. The trigger reads "Add Contacts"
 * until the list has an item, then "Edit Contacts".
 */
export const ArrayCardsInPopover: Story = {
  render: () => {
    const form = createForm();
    const schema: ISchema = {
      type: 'object',
      properties: {
        contacts: {
          type: 'array',
          title: 'Contacts',
          description: 'The list is managed inside the popover.',
          'x-decorator': 'PopoverItem',
          'x-decorator-props': {
            // Cards need more room than the trigger's width, and modal keeps
            // clicks inside the popover while editing the list.
            modal: true,
            'data-testid': 'contacts-decorator',
            popover: {
              slots: { content: { className: 'w-96' } },
            },
          },
          'x-component': 'ArrayCards',
          items: {
            type: 'object',
            'x-reactions': {
              fulfill: {
                state: {
                  title: "{{$self.value?.name || 'Contact'}}",
                },
              },
            },
            properties: {
              name: {
                type: 'string',
                title: 'Name',
                required: true,
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  'data-testid': 'contact-name-decorator',
                },
                'x-component': 'Input',
              },
              email: {
                type: 'string',
                title: 'Email',
                format: 'email',
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  'data-testid': 'contact-email-decorator',
                },
                'x-component': 'Input',
              },
            },
          },
          properties: {
            addition: {
              type: 'void',
              title: 'Add Contact',
              'x-component': 'ArrayCards.Addition',
            },
          },
        },
      },
    };

    return (
      <JsonSchemaFormRenderer
        form={form}
        components={{
          fields: defaultComponentRegistry,
        }}
        schema={schema}
        onSubmit={(values) => {
          // eslint-disable-next-line no-console
          console.log('Form submitted:', values);
        }}
      >
        <button
          type="submit"
          data-testid="submit-button"
          className="bg-primary text-primary-foreground mt-6 w-full rounded-md px-4 py-2"
        >
          Submit
        </button>
      </JsonSchemaFormRenderer>
    );
  },
};

export const SelectInsidePopover: Story = {
  render: () => {
    const form = createForm();
    const schema: ISchema = {
      type: 'object',
      properties: {
        country: {
          type: 'string',
          title: 'Country',
          description: 'A Select rendered inside the popover.',
          enum: ['United Kingdom', 'Germany', 'France'],
          'x-decorator': 'PopoverItem',
          'x-decorator-props': {
            modal: true,
            'data-testid': 'country-decorator',
          },
          'x-component': 'Select',
        },
      },
    };

    return (
      <JsonSchemaFormRenderer
        form={form}
        components={{
          fields: defaultComponentRegistry,
        }}
        schema={schema}
      />
    );
  },
};
