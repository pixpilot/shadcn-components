/* eslint-disable no-console */
/* eslint-disable no-alert */
/* eslint-disable no-magic-numbers */
import type { Meta, StoryObj } from '@storybook/react';
import { Eye, EyeOff, Moon, Pause, Play, Sun, Volume2, VolumeX } from 'lucide-react';
import { createForm, Form, SchemaField } from '../src';

const meta: Meta<typeof Form> = {
  title: 'Formily/IconToggle',
  component: Form,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Form>;

/**
 * Basic visibility toggle with Eye icons
 */
export const BasicVisibilityToggle: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        showPassword: {
          type: 'boolean',
          title: 'Show Password',
          'x-decorator': 'FormItem',
          'x-component': 'IconToggle',
          'x-component-props': {
            checkedIcon: <Eye />,
            uncheckedIcon: <EyeOff />,
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
 * Multiple icon toggles with different use cases
 */
export const MultipleIconToggles: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        visibility: {
          type: 'boolean',
          title: 'Show Sensitive Data',
          'x-decorator': 'FormItem',
          'x-component': 'IconToggle',
          'x-component-props': {
            checkedIcon: <Eye />,
            uncheckedIcon: <EyeOff />,
          },
        },
        darkMode: {
          type: 'boolean',
          title: 'Dark Mode',
          'x-decorator': 'FormItem',
          'x-component': 'IconToggle',
          'x-component-props': {
            checkedIcon: <Moon />,
            uncheckedIcon: <Sun />,
          },
        },
        sound: {
          type: 'boolean',
          title: 'Sound Effects',
          'x-decorator': 'FormItem',
          'x-component': 'IconToggle',
          'x-component-props': {
            checkedIcon: <Volume2 />,
            uncheckedIcon: <VolumeX />,
          },
        },
        autoPlay: {
          type: 'boolean',
          title: 'Auto Play',
          'x-decorator': 'FormItem',
          'x-component': 'IconToggle',
          'x-component-props': {
            checkedIcon: <Play />,
            uncheckedIcon: <Pause />,
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
 * Icon toggle with default value
 */
export const WithDefaultValue: Story = {
  render: () => {
    const form = createForm({
      initialValues: {
        notifications: true,
      },
    });

    const schema = {
      type: 'object',
      properties: {
        notifications: {
          type: 'boolean',
          title: 'Enable Notifications',
          'x-decorator': 'FormItem',
          'x-component': 'IconToggle',
          'x-component-props': {
            checkedIcon: <Volume2 />,
            uncheckedIcon: <VolumeX />,
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
 * Using SVG markup strings as icons
 * Icons can be passed as SVG strings, useful for dynamic or custom icons
 */
export const WithSVGStrings: Story = {
  render: () => {
    const form = createForm();

    const eyeOpenSvg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>';
    const eyeClosedSvg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>';

    const schema = {
      type: 'object',
      properties: {
        passwordVisibility: {
          type: 'boolean',
          title: 'Show Password',
          description: 'Toggle password visibility using SVG string icons',
          'x-decorator': 'FormItem',
          'x-component': 'IconToggle',
          'x-component-props': {
            checkedIcon: eyeOpenSvg,
            uncheckedIcon: eyeClosedSvg,
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
 * Mix of React components and SVG strings in a single form
 */
export const MixedIconTypes: Story = {
  render: () => {
    const form = createForm();

    const heartFilledSvg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
    const heartOutlineSvg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';

    const schema = {
      type: 'object',
      properties: {
        notifications: {
          type: 'boolean',
          title: 'Notifications',
          description: 'Using React component icons',
          'x-decorator': 'FormItem',
          'x-component': 'IconToggle',
          'x-component-props': {
            checkedIcon: <Volume2 />,
            uncheckedIcon: <VolumeX />,
          },
        },
        favorite: {
          type: 'boolean',
          title: 'Favorite',
          description: 'Using SVG string icons',
          'x-decorator': 'FormItem',
          'x-component': 'IconToggle',
          'x-component-props': {
            checkedIcon: heartFilledSvg,
            uncheckedIcon: heartOutlineSvg,
          },
        },
        darkMode: {
          type: 'boolean',
          title: 'Dark Mode',
          description: 'Using React component icons',
          'x-decorator': 'FormItem',
          'x-component': 'IconToggle',
          'x-component-props': {
            checkedIcon: <Moon />,
            uncheckedIcon: <Sun />,
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
 * Different size variants
 */
export const SizeVariants: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        smallToggle: {
          type: 'boolean',
          title: 'Small Toggle',
          'x-decorator': 'FormItem',
          'x-component': 'IconToggle',
          'x-component-props': {
            size: 'sm',
            checkedIcon: <Eye />,
            uncheckedIcon: <EyeOff />,
          },
        },
        defaultToggle: {
          type: 'boolean',
          title: 'Default Toggle',
          'x-decorator': 'FormItem',
          'x-component': 'IconToggle',
          'x-component-props': {
            size: 'default',
            checkedIcon: <Eye />,
            uncheckedIcon: <EyeOff />,
          },
        },
        largeToggle: {
          type: 'boolean',
          title: 'Large Toggle',
          'x-decorator': 'FormItem',
          'x-component': 'IconToggle',
          'x-component-props': {
            size: 'lg',
            checkedIcon: <Eye />,
            uncheckedIcon: <EyeOff />,
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
 * Different style variants
 */
export const StyleVariants: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        defaultVariant: {
          type: 'boolean',
          title: 'Default Variant',
          'x-decorator': 'FormItem',
          'x-component': 'IconToggle',
          'x-component-props': {
            variant: 'default',
            checkedIcon: <Eye />,
            uncheckedIcon: <EyeOff />,
          },
        },
        outlineVariant: {
          type: 'boolean',
          title: 'Outline Variant',
          'x-decorator': 'FormItem',
          'x-component': 'IconToggle',
          'x-component-props': {
            variant: 'outline',
            checkedIcon: <Eye />,
            uncheckedIcon: <EyeOff />,
          },
        },
        ghostVariant: {
          type: 'boolean',
          title: 'Ghost Variant',
          'x-decorator': 'FormItem',
          'x-component': 'IconToggle',
          'x-component-props': {
            variant: 'ghost',
            checkedIcon: <Eye />,
            uncheckedIcon: <EyeOff />,
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
 * With validation - required field
 */
export const WithValidation: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        termsAccepted: {
          type: 'boolean',
          title: 'Accept Terms & Conditions',
          'x-decorator': 'FormItem',
          'x-component': 'IconToggle',
          'x-component-props': {
            checkedIcon: <Eye />,
            uncheckedIcon: <EyeOff />,
          },
          'x-validator': [
            {
              required: true,
              message: 'You must accept the terms',
            },
          ],
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
 * With description text
 */
export const WithDescription: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        passwordVisibility: {
          type: 'boolean',
          title: 'Password Visibility',
          description: 'Toggle to show or hide your password',
          'x-decorator': 'FormItem',
          'x-component': 'IconToggle',
          'x-component-props': {
            checkedIcon: <Eye />,
            uncheckedIcon: <EyeOff />,
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
        premiumFeature: true,
      },
    });

    const schema = {
      type: 'object',
      properties: {
        premiumFeature: {
          type: 'boolean',
          title: 'Premium Feature',
          description: 'This feature requires a premium subscription',
          'x-decorator': 'FormItem',
          'x-component': 'IconToggle',
          'x-component-props': {
            checkedIcon: <Eye />,
            uncheckedIcon: <EyeOff />,
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

/**
 * Practical example: Settings form with various toggles
 */
export const SettingsForm: Story = {
  render: () => {
    const form = createForm({
      initialValues: {
        emailNotifications: true,
        darkMode: false,
        autoPlay: true,
        showSensitiveData: false,
      },
    });

    const schema = {
      type: 'object',
      properties: {
        appearance: {
          type: 'void',
          'x-component': 'h3',
          'x-content': 'Appearance',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            asterisk: false,
          },
        },
        darkMode: {
          type: 'boolean',
          title: 'Dark Mode',
          description: 'Enable dark theme across the application',
          'x-decorator': 'FormItem',
          'x-component': 'IconToggle',
          'x-component-props': {
            checkedIcon: <Moon />,
            uncheckedIcon: <Sun />,
          },
        },
        separator1: {
          type: 'void',
          'x-component': 'Separator',
          'x-component-props': {
            className: 'my-4',
          },
        },
        notifications: {
          type: 'void',
          'x-component': 'h3',
          'x-content': 'Notifications',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            asterisk: false,
          },
        },
        emailNotifications: {
          type: 'boolean',
          title: 'Email Notifications',
          description: 'Receive email updates about your account',
          'x-decorator': 'FormItem',
          'x-component': 'IconToggle',
          'x-component-props': {
            checkedIcon: <Volume2 />,
            uncheckedIcon: <VolumeX />,
          },
        },
        separator2: {
          type: 'void',
          'x-component': 'Separator',
          'x-component-props': {
            className: 'my-4',
          },
        },
        privacy: {
          type: 'void',
          'x-component': 'h3',
          'x-content': 'Privacy',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            asterisk: false,
          },
        },
        showSensitiveData: {
          type: 'boolean',
          title: 'Show Sensitive Data',
          description: 'Display sensitive information in the interface',
          'x-decorator': 'FormItem',
          'x-component': 'IconToggle',
          'x-component-props': {
            checkedIcon: <Eye />,
            uncheckedIcon: <EyeOff />,
          },
        },
        separator3: {
          type: 'void',
          'x-component': 'Separator',
          'x-component-props': {
            className: 'my-4',
          },
        },
        playback: {
          type: 'void',
          'x-component': 'h3',
          'x-content': 'Playback',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            asterisk: false,
          },
        },
        autoPlay: {
          type: 'boolean',
          title: 'Auto Play',
          description: 'Automatically play media content',
          'x-decorator': 'FormItem',
          'x-component': 'IconToggle',
          'x-component-props': {
            checkedIcon: <Play />,
            uncheckedIcon: <Pause />,
          },
        },
      },
    };

    return (
      <Form
        form={form}
        className="w-[500px]"
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
          Save Settings
        </button>
      </Form>
    );
  },
};
