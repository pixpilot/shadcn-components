import type { Meta, StoryObj } from '@storybook/react';
import type { ISchema } from '../src';
import { createForm, defaultComponentRegistry, JsonSchemaFormRenderer } from '../src';
import { BaseDrawerItem } from '../src/components/drawer-item';

const meta: Meta<typeof BaseDrawerItem> = {
  title: 'Formily/Drawer Item',
  component: BaseDrawerItem,
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
type Story = StoryObj<typeof BaseDrawerItem>;

const LONG_FORM_FIELD_COUNT = 24;
/** Every Nth field is required, to give validation something to catch. */
const REQUIRED_FIELD_INTERVAL = 6;

function buildLongFormProperties(): Record<string, ISchema> {
  const properties: Record<string, ISchema> = {};

  for (let index = 1; index <= LONG_FORM_FIELD_COUNT; index += 1) {
    properties[`field${index}`] = {
      type: 'string',
      title: `Field ${index}`,
      required: index % REQUIRED_FIELD_INTERVAL === 0,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    };
  }

  return properties;
}

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
          'x-decorator': 'DrawerItem',
          'x-decorator-props': {
            'data-testid': 'age-decorator',
          },
          'x-component': 'NumberInput',
        },
      },
    };

    return (
      <JsonSchemaFormRenderer
        id="drawer-item"
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
          description: 'Type an invalid email, then try to close — the drawer shakes.',
          required: true,
          format: 'email',
          'x-decorator': 'DrawerItem',
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

export const CustomTriggerAndDrawerText: Story = {
  render: () => {
    const form = createForm();
    const schema: ISchema = {
      type: 'object',
      properties: {
        notes: {
          type: 'string',
          title: 'Notes',
          'x-decorator': 'DrawerItem',
          'x-decorator-props': {
            'data-testid': 'notes-decorator',
            trigger: { label: 'Open the notes editor…' },
            drawer: {
              title: 'Notes',
              description: 'Markdown is not supported yet.',
            },
            doneLabel: 'Close',
          },
          'x-component': 'Textarea',
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
 * The drawer can anchor to any edge via `drawer.slots.content.side`.
 */
export const SideDrawer: Story = {
  render: () => {
    const form = createForm();
    const schema: ISchema = {
      type: 'object',
      properties: {
        bio: {
          type: 'string',
          title: 'Bio',
          description: 'Opens in a drawer anchored to the right edge.',
          'x-decorator': 'DrawerItem',
          'x-decorator-props': {
            'data-testid': 'bio-decorator',
            drawer: { direction: 'right' },
          },
          'x-component': 'Textarea',
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
 * The decorator on an object: a whole long form lives in the drawer, which
 * scrolls its body while the header and footer stay put. Every 6th field is
 * required, so closing with them empty shakes rather than closing.
 */
export const LongFormInDrawer: Story = {
  render: () => {
    const form = createForm();
    const schema: ISchema = {
      type: 'object',
      properties: {
        profile: {
          type: 'object',
          title: 'Profile',
          description: `${LONG_FORM_FIELD_COUNT} fields, edited in one drawer.`,
          'x-decorator': 'DrawerItem',
          'x-decorator-props': {
            'data-testid': 'profile-decorator',
          },
          'x-component-props': {
            variant: 'flat',
            label: false,
            description: false,
          },
          properties: buildLongFormProperties(),
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
