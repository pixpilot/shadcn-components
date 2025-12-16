/* eslint-disable no-console */
/* eslint-disable no-alert */
import type { Meta, StoryObj } from '@storybook/react';
import type { IconProvider } from '../src/types';

import faData from '@iconify-json/fa/icons.json';
import mdiData from '@iconify-json/mdi/icons.json';
import { createForm, Form, SchemaFieldExtended } from '../src';
import { iconProviders } from './utils/icon-providers';

/**
 * <p>By default, Iconify uses its own API for icon data.</p>
 * <p>To use your own icon server, create your own provider like:</p>
 * ```js
 * import { addAPIProvider } from '@iconify/react';
 *
 * addAPIProvider('', {
 *   resources: [myServerUrl],
 *   path: '/api/iconify/',
 * });
 * ```
 * <p>Read more: <a href="https://iconify.design/docs/iconify-icon/add-api-provider.html#web-component-function-addapiprovider">here</a></p>
 * <p>In this Storybook setup, we override the default to use the local Storybook server with MSW mocks.</p>
 */
const meta: Meta<typeof Form> = {
  title: 'Formily/IconPicker',
  component: Form,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Form>;

const JSON_INDENT = 2;

export const BasicIconPicker: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        icon: {
          type: 'string',
          title: 'Select Icon',
          'x-decorator': 'FormItem',
          'x-component': 'IconPicker',
        },
      },
    };

    return (
      <Form
        form={form}
        className="w-[500px]"
        settings={{
          iconPicker: {
            providers: iconProviders,
          },
        }}
        onSubmit={(values) => {
          console.log('Form submitted:', values);
          alert(JSON.stringify(values, null, JSON_INDENT));
        }}
      >
        <SchemaFieldExtended schema={schema} />
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

export const IconPickerWithPreselect: Story = {
  render: () => {
    const form = createForm({
      values: {
        icon: 'mdi:home',
      },
    });

    const schema = {
      type: 'object',
      properties: {
        icon: {
          type: 'string',
          title: 'Select Icon',
          'x-decorator': 'FormItem',
          'x-component': 'IconPicker',
        },
      },
    };

    return (
      <Form
        form={form}
        className="w-[500px]"
        settings={{
          iconPicker: {
            providers: iconProviders,
          },
        }}
        onSubmit={(values) => {
          console.log('Form submitted:', values);
          alert(JSON.stringify(values, null, JSON_INDENT));
        }}
      >
        <SchemaFieldExtended schema={schema} />
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

export const DeclarativeIconPicker: Story = {
  render: () => {
    const form = createForm({
      values: {
        primaryIcon: 'mdi:star',
        secondaryIcon: 'mdi:heart',
      },
    });

    return (
      <Form
        form={form}
        className="w-[500px]"
        settings={{
          iconPicker: {
            providers: iconProviders,
          },
        }}
        onSubmit={(values) => {
          console.log('Form submitted:', values);
          alert(JSON.stringify(values, null, JSON_INDENT));
        }}
      >
        <SchemaFieldExtended>
          <SchemaFieldExtended.String
            name="primaryIcon"
            title="Primary Icon"
            required
            x-decorator="FormItem"
            x-component="IconPicker"
          />
          <SchemaFieldExtended.String
            name="secondaryIcon"
            title="Secondary Icon"
            x-decorator="FormItem"
            x-component="IconPicker"
          />
        </SchemaFieldExtended>
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

export const JsonSchemaIconPicker: Story = {
  render: () => {
    const form = createForm({
      values: {
        appIcon: 'mdi:application',
        notificationIcon: 'mdi:bell',
      },
    });

    const schema = {
      type: 'object',
      properties: {
        appIcon: {
          type: 'string',
          title: 'Application Icon',
          description: 'Choose an icon for your application',
          'x-decorator': 'FormItem',
          'x-component': 'IconPicker',
        },
        notificationIcon: {
          type: 'string',
          title: 'Notification Icon',
          description: 'Choose an icon for notifications',
          'x-decorator': 'FormItem',
          'x-component': 'IconPicker',
        },
      },
    };

    return (
      <Form
        form={form}
        className="w-[500px]"
        settings={{
          iconPicker: {
            providers: iconProviders,
          },
        }}
        onSubmit={(values) => {
          console.log('Form submitted:', values);
          alert(JSON.stringify(values, null, JSON_INDENT));
        }}
      >
        <SchemaFieldExtended schema={schema} />
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
 * Async Provider Story
 *
 * This story demonstrates loading icon providers asynchronously.
 * In this example, we simulate loading icon libraries with a delay
 * to demonstrate how the component handles async provider loading.
 *
 * The IconPicker component automatically:
 * - Shows a loading state while providers are being resolved
 * - Loads all providers in parallel for optimal performance
 * - Gracefully handles provider loading errors
 *
 * You can use async providers for:
 * - Loading icons from an API endpoint
 * - Dynamic imports for code splitting
 * - Lazy-loading large icon sets on demand
 */
export const AsyncProviders: Story = {
  render: () => {
    // Async provider loader function
    // Simulates fetching icons from an API with a 2-second delay
    const MATERIAL_DESIGN_LOAD_DELAY = 2000;
    const FONT_AWESOME_LOAD_DELAY = 1500;

    const loadMaterialDesignIconsAsync = async () => {
      return new Promise<IconProvider>((resolve) => {
        setTimeout(() => {
          resolve({
            prefix: mdiData.prefix,
            icons: Object.keys(mdiData.icons),
            name: 'Material Design (Async Loaded)',
          });
        }, MATERIAL_DESIGN_LOAD_DELAY);
      });
    };

    // Another async provider with different delay
    const loadFontAwesomeAsync = async () => {
      return new Promise<IconProvider>((resolve) => {
        setTimeout(() => {
          resolve({
            prefix: faData.prefix,
            icons: Object.keys(faData.icons),
            name: 'Font Awesome (Async Loaded)',
          });
        }, FONT_AWESOME_LOAD_DELAY);
      });
    };

    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        icon: {
          type: 'string',
          title: 'Select Icon',
          description: 'Providers are loading asynchronously...',
          'x-decorator': 'FormItem',
          'x-component': 'IconPicker',
        },
      },
    };

    return (
      <Form
        form={form}
        className="w-[500px]"
        settings={{
          iconPicker: {
            // Mix of async providers
            providers: [loadMaterialDesignIconsAsync, loadFontAwesomeAsync],
          },
        }}
        onSubmit={(values) => {
          console.log('Form submitted:', values);
          alert(JSON.stringify(values, null, JSON_INDENT));
        }}
      >
        <SchemaFieldExtended schema={schema} />
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
