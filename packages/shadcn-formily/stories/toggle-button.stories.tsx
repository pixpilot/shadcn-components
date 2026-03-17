/* eslint-disable no-console */
/* eslint-disable no-alert */
/* eslint-disable no-magic-numbers */
import type { Meta, StoryObj } from '@storybook/react';
import { Moon, Pause, Play, Sun, Volume2, VolumeX } from 'lucide-react';
import { createForm, Form, SchemaField } from '../src';

const meta: Meta<typeof Form> = {
  title: 'Formily/ToggleButton',
  component: Form,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Form>;

/**
 * Basic toggle button using textual content
 */
export const BasicToggle: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        showAdvanced: {
          type: 'boolean',
          title: 'Show Advanced',
          'x-decorator': 'FormItem',
          'x-component': 'ToggleButton',
        },
      },
    };

    return (
      <Form
        form={form}
        className="w-[400px]"
        onSubmit={(values) => {
          console.log('Form submitted:', values);
          alert(JSON.stringify(values, null, 2));
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

/**
 * Multiple toggle buttons showing various contents
 */
export const MultipleToggles: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        playback: {
          type: 'boolean',
          title: 'Playback',
          'x-decorator': 'FormItem',
          'x-component': 'ToggleButton',
          'x-component-props': {
            checkedContent: <Play />,
            uncheckedContent: <Pause />,
          },
        },
        sound: {
          type: 'boolean',
          title: 'Sound',
          'x-decorator': 'FormItem',
          'x-component': 'ToggleButton',
          'x-component-props': {
            checkedContent: <Volume2 />,
            uncheckedContent: <VolumeX />,
          },
        },
        darkMode: {
          type: 'boolean',
          title: 'Dark Mode',
          'x-decorator': 'FormItem',
          'x-component': 'ToggleButton',
          'x-component-props': {
            checkedContent: <Moon />,
            uncheckedContent: <Sun />,
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
          alert(JSON.stringify(values, null, 2));
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

/**
 * Toggle with default value
 */
export const WithDefaultValue: Story = {
  render: () => {
    const form = createForm({
      initialValues: {
        featureEnabled: true,
      },
    });

    const schema = {
      type: 'object',
      properties: {
        featureEnabled: {
          type: 'boolean',
          title: 'Enable Feature',
          'x-decorator': 'FormItem',
          'x-component': 'ToggleButton',
          'x-component-props': {
            checkedContent: <span>Enabled</span>,
            uncheckedContent: <span>Disabled</span>,
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
          alert(JSON.stringify(values, null, 2));
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

/**
 * Different size variants using checkedProps/uncheckedProps
 */
export const SizeVariants: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        smallToggle: {
          type: 'boolean',
          title: 'Small',
          'x-decorator': 'FormItem',
          'x-component': 'ToggleButton',
          'x-component-props': {
            checkedContent: <span>On</span>,
            uncheckedContent: <span>Off</span>,
            checkedProps: { size: 'sm' },
            uncheckedProps: { size: 'sm' },
          },
        },
        defaultToggle: {
          type: 'boolean',
          title: 'Default',
          'x-decorator': 'FormItem',
          'x-component': 'ToggleButton',
          'x-component-props': {
            checkedContent: <span>On</span>,
            uncheckedContent: <span>Off</span>,
          },
        },
        largeToggle: {
          type: 'boolean',
          title: 'Large',
          'x-decorator': 'FormItem',
          'x-component': 'ToggleButton',
          'x-component-props': {
            checkedContent: <span>On</span>,
            uncheckedContent: <span>Off</span>,
            checkedProps: { size: 'lg' },
            uncheckedProps: { size: 'lg' },
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
          alert(JSON.stringify(values, null, 2));
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

/**
 * Disabled state
 */
export const Disabled: Story = {
  render: () => {
    const form = createForm({
      initialValues: {
        lockedFeature: true,
      },
    });

    const schema = {
      type: 'object',
      properties: {
        lockedFeature: {
          type: 'boolean',
          title: 'Locked Feature',
          description: 'This feature is locked for your account',
          'x-decorator': 'FormItem',
          'x-component': 'ToggleButton',
          'x-component-props': {
            checkedContent: <span>On</span>,
            uncheckedContent: <span>Off</span>,
            disabled: true,
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
          alert(JSON.stringify(values, null, 2));
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
