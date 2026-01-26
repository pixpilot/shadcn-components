/* eslint-disable no-alert */
/* eslint-disable no-magic-numbers */

/**
 * Shared story generators for array components (ArrayCards, ArrayCollapse, ArrayDialog, ArrayPopover)
 * This file provides reusable story creation functions to avoid duplication across array component story files.
 */

import type { StoryObj } from '@storybook/react';
import type { ISchema } from '../src';
import { Button } from '@pixpilot/shadcn';
import { InfoIcon, PinIcon } from 'lucide-react';
import { createForm, Form, SchemaField } from '../src';

type Story = StoryObj<typeof Form>;

interface StoryConfig {
  /**
   * The component name (e.g., 'ArrayCards', 'ArrayCollapse', 'ArrayDialog', 'ArrayPopover')
   */
  componentName: string;
  /**
   * Display title for the component
   */
  displayTitle: string;
  /**
   * Optional component-specific props
   */
  componentProps?: Record<string, unknown>;
}

const JSON_INDENT = 2;

export function createStories(config: StoryConfig) {
  return {
    EmptyArray: createEmptyArrayStory(config),
    WithActions: createWithActions(config),
    WithComponentClassName: createWithComponentClassNameStory(config),
    WithDescription: createWithDescriptionStory(config),
    Declarative: createDeclarativeStory(config),
    WithJSONSchema: createWithJsonSchemaStory(config),
    WithItemReactionTitle: createWithItemReactionTitleStory(config),
    WithTruncatedLabels: createWithTruncatedLabelsStory(config),
    Sortable: createSortableStory(config),
    SortableNested: createSortableNestedStory(config),
    SortableDisabledInForm: createSortableDisabledInFormStory(config),
    SortableDisabledForArray: createSortableDisabledForArrayStory(config),
    AutoSave: createAutoSaveStory(config),
    ManualSave: createManualSaveStory(config),
  };
}

/**
 * Creates an EmptyArray story for the given array component
 */
export function createEmptyArrayStory(config: StoryConfig): Story {
  const { componentName } = config;

  return {
    render: () => {
      const form = createForm({});

      return (
        <Form
          form={form}
          className="w-[600px]"
          onSubmit={(values) => {
            // eslint-disable-next-line no-console
            console.log('Form submitted:', values);

            alert(JSON.stringify(values, null, JSON_INDENT));
          }}
        >
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Contacts</h3>

            <SchemaField>
              <SchemaField.Array
                name="contacts"
                x-component={componentName}
                x-component-props={{
                  className: 'space-y-4',
                  ...config.componentProps,
                }}
              >
                <SchemaField.Object
                  x-reactions={{
                    fulfill: {
                      state: {
                        title: "{{$self.value?.name || 'User'}}",
                      },
                    },
                  }}
                >
                  <SchemaField.String
                    name="name"
                    title="Name"
                    required
                    x-decorator="FormItem"
                    x-component="Input"
                    x-component-props={{ placeholder: 'Enter name' }}
                  />
                </SchemaField.Object>
              </SchemaField.Array>
            </SchemaField>
          </div>

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
}

/**
 * Creates a WithHeaderActions story for the given array component
 */
/**
 * Creates a Story configuration with custom array item actions for Formily forms.
 *
 * @param config - The story configuration object containing the component name, display title, and optional component props.
 * @returns A Story object with a render function that displays a form with array fields and custom actions.
 *
 * @remarks
 * - The `actions` defined in the `settings.array.item.actions` property will override all default array actions and create new actions for array items.
 * - Custom actions can include built-in actions (e.g., 'remove') and user-defined actions (e.g., 'toggle', 'info') with custom icons, tooltips, and handlers.
 * - The example includes two array fields (`users` and `contacts`) with different sets of actions to demonstrate customization.
 */
export function createWithActions(config: StoryConfig): Story {
  const { componentName, displayTitle } = config;

  return {
    render: () => {
      const form = createForm({
        values: {
          contacts: [{ name: 'Bob Builder' }],
          users: [{ name: 'Alice Johnson' }],
        },
      });

      return (
        <Form
          form={form}
          className="space-y-6 w-[700px]"
          settings={{
            array: {
              item: {
                actions: [
                  'remove',
                  {
                    type: 'toggle',
                    key: 'pin',
                    inactiveTooltip: 'Pin item',
                    activeTooltip: 'Unpin item',
                    icon: <PinIcon className="size-4" />,
                    activeIcon: <PinIcon className="size-4" fill="currentColor" />,
                    isActive: ({ record }) => {
                      return Boolean((record as { pinned?: boolean } | null)?.pinned);
                    },
                    onToggle: ({ array, index }, nextActive) => {
                      const currentValue = array.field.value;
                      const currentArray = Array.isArray(currentValue)
                        ? (currentValue as unknown[])
                        : [];
                      const nextValue = [...currentArray];

                      const currentItem = (nextValue[index] ?? {}) as Record<
                        string,
                        unknown
                      >;

                      nextValue[index] = {
                        ...currentItem,
                        pinned: nextActive,
                      };

                      array.field.setValue(nextValue as any[]);
                    },
                  },
                  {
                    key: 'info',
                    tooltip: 'Show info',
                    icon: <InfoIcon className="size-4" />,
                    onClick: ({ index, itemField }) => {
                      const address = (
                        itemField as { address?: { toString?: () => string } } | null
                      )?.address;

                      alert(
                        `Info clicked for index ${index}\nField: ${String(
                          address?.toString?.() ?? '',
                        )}`,
                      );
                    },
                  },
                ],
              },
            },
          }}
        >
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">{displayTitle} (Header actions)</h2>
            <p className="text-muted-foreground">
              Custom actions render in the header. Can be added to the form settings to
              apply globally. Or can be set via x-component-props on individual array
              fields. If both are set, the x-component-props actions will override the
              global settings.
            </p>
          </div>

          <SchemaField>
            <SchemaField.Array name="users" x-component={componentName}>
              <SchemaField.Object
                x-reactions={{
                  fulfill: {
                    state: {
                      title: "{{$self.value?.name || 'User'}}",
                    },
                  },
                }}
              >
                <SchemaField.String
                  name="name"
                  title="Name"
                  x-decorator="FormItem"
                  x-component="Input"
                />
              </SchemaField.Object>
            </SchemaField.Array>

            <SchemaField.Array
              name="contacts"
              x-component={componentName}
              x-component-props={{
                ...config.componentProps,
                // the action will override all actions
                actions: ['up', 'down', 'edit', 'remove'],
              }}
            >
              <SchemaField.Object
                x-reactions={{
                  fulfill: {
                    state: {
                      title: "{{$self.value?.name || 'User'}}",
                    },
                  },
                }}
              >
                <SchemaField.String
                  name="name"
                  title="Name"
                  x-decorator="FormItem"
                  x-component="Input"
                />
              </SchemaField.Object>
            </SchemaField.Array>
          </SchemaField>

          <div className="pt-4">
            <Button
              type="button"
              onClick={() => alert(JSON.stringify(form.values, null, 2))}
            >
              View Values
            </Button>
          </div>
        </Form>
      );
    },
  };
}

/**
 * Creates a WithComponentClassName story for the given array component
 */
export function createWithComponentClassNameStory(config: StoryConfig): Story {
  const { componentName, displayTitle } = config;
  const itemComponent = `${componentName}.Item`;

  return {
    render: () => {
      const form = createForm({
        values: {
          contacts: [
            { name: 'John Doe', email: 'john@example.com' },
            { name: 'Jane Smith', email: 'jane@example.com' },
          ],
        },
      });

      const schema = {
        type: 'object',
        properties: {
          contacts: {
            type: 'array',
            'x-component': componentName,
            'x-component-props': {
              className: 'space-y-4 bg-slate-200 p-3 rounded-md',
              ...config.componentProps,
            },
            items: {
              type: 'object',
              'x-component': itemComponent,
              'x-component-props': {
                className: 'bg-slate-500 text-white',
              },
              'x-reactions': {
                fulfill: {
                  state: {
                    title: "{{$self.value?.name || 'User'}}",
                  },
                },
              },
              properties: {
                name: {
                  type: 'string',
                  title: 'Name',
                  required: true,
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                  'x-component-props': {
                    placeholder: 'Enter name',
                  },
                },
                email: {
                  type: 'string',
                  title: 'Email',
                  required: true,
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                  'x-component-props': {
                    placeholder: 'Enter email',
                    type: 'email',
                  },
                },
              },
            },
            properties: {
              addition: {
                type: 'void',
                title: 'Add Contact',
                'x-component': `${componentName}.Addition`,
              },
            },
          },
        },
      };

      return (
        <Form form={form} className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{displayTitle} (ClassName propagation)</h2>
            <p className="text-muted-foreground">
              Verifies that component className is applied to real DOM nodes.
            </p>
          </div>

          <SchemaField schema={schema} />
        </Form>
      );
    },
  };
}

/**
 * Creates a WithDescription story for the given array component
 */
export function createWithDescriptionStory(config: StoryConfig): Story {
  const { componentName } = config;

  return {
    render: () => {
      const form = createForm({
        values: {
          contacts: [
            {
              name: 'John Doe',
              email: 'john@example.com',
              phones: [
                {
                  number: '555-0100',
                  type: 'home',
                },
              ],
            },
          ],
        },
      });

      const schema: ISchema = {
        type: 'object',
        properties: {
          contacts: {
            type: 'array',
            title: 'Contact List',
            description: 'Add multiple contacts with their details',
            'x-decorator': 'FormItem',
            'x-component': componentName,
            'x-component-props': config.componentProps,
            items: {
              type: 'object',
              title: 'Contact',
              description:
                'Enter contact information including name, email, and phone numbers',
              'x-reactions': {
                fulfill: {
                  state: {
                    title: "{{$self.value?.name || 'User'}}",
                  },
                },
              },
              properties: {
                name: {
                  type: 'string',
                  title: 'Name',
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                  'x-component-props': { placeholder: 'Enter name' },
                  required: true,
                },
                email: {
                  type: 'string',
                  title: 'Email',
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                  'x-component-props': { placeholder: 'Enter email', type: 'email' },
                },
                phones: {
                  type: 'array',
                  title: 'Phone Numbers',
                  description: 'Add multiple phone numbers for this contact',
                  'x-decorator': 'FormItem',
                  'x-component': componentName,
                  'x-component-props': config.componentProps,
                  items: {
                    type: 'object',
                    title: 'Phone Number',
                    description: 'Enter phone number and type',
                    properties: {
                      number: {
                        type: 'string',
                        title: 'Phone Number',
                        'x-decorator': 'FormItem',
                        'x-component': 'Input',
                        'x-component-props': { placeholder: 'Enter phone number' },
                      },
                      type: {
                        type: 'string',
                        title: 'Type',
                        'x-decorator': 'FormItem',
                        'x-component': 'Select',
                        enum: [
                          { label: 'Home', value: 'home' },
                          { label: 'Work', value: 'work' },
                          { label: 'Mobile', value: 'mobile' },
                        ],
                      },
                    },
                  },
                },
              },
            },
          },
        },
      };

      return (
        <Form
          form={form}
          className="w-[600px]"
          onSubmit={(values) => {
            // eslint-disable-next-line no-console
            console.log('Form submitted:', values);

            alert(JSON.stringify(values, null, JSON_INDENT));
          }}
        >
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Contacts</h3>

            <SchemaField schema={schema} />
          </div>

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
}

/**
 * Creates a WithJSXSchema/Declarative story for the given array component
 */
export function createDeclarativeStory(config: StoryConfig): Story {
  const { componentName, displayTitle } = config;

  return {
    render: () => {
      const form = createForm({
        values: {
          contacts: [
            {
              name: 'John Doe',
              email: 'john@example.com',
              phone: '555-0100',
            },
            {
              name: 'Jane Smith',
              email: 'jane@example.com',
              phone: '555-0101',
            },
          ],
        },
      });

      return (
        <Form form={form} className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Contact List ({displayTitle})</h2>
            <p className="text-muted-foreground">
              Click on a contact to expand and edit inline. Keep your list organized and
              compact.
            </p>
          </div>

          <SchemaField>
            <SchemaField.Array
              name="contacts"
              maxItems={10}
              x-component={componentName}
              x-component-props={config.componentProps}
            >
              <SchemaField.Object
                x-reactions={{
                  fulfill: {
                    state: {
                      title: "{{$self.value?.name || 'User'}}",
                    },
                  },
                }}
              >
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
                <SchemaField.String
                  name="phone"
                  title="Phone"
                  x-decorator="FormItem"
                  x-component="Input"
                  x-component-props={{ placeholder: 'Enter phone' }}
                />
              </SchemaField.Object>
              <SchemaField.Void
                x-component={`${componentName}.Addition`}
                title="Add Contact"
              />
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
}

/**
 * Creates a WithJsonSchema story for the given array component
 */
export function createWithJsonSchemaStory(config: StoryConfig): Story {
  const { componentName, displayTitle } = config;

  return {
    render: () => {
      const form = createForm({
        values: {
          contacts: [
            {
              name: 'John Doe',
              email: 'john@example.com',
              phone: '555-0100',
            },
          ],
        },
      });

      const schema: ISchema = {
        type: 'object',
        properties: {
          contacts: {
            type: 'array',
            title: 'Contacts',
            maxItems: 10,
            description: 'List of user contacts',
            'x-decorator': 'FormItem',
            'x-component': componentName,
            'x-component-props': config.componentProps,
            items: {
              type: 'object',
              'x-reactions': {
                fulfill: {
                  state: {
                    title: "{{$self.value?.name || 'User'}}",
                  },
                },
              },
              properties: {
                name: {
                  type: 'string',
                  title: 'Name',
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                  'x-component-props': { placeholder: 'Enter name' },
                  required: true,
                },
                email: {
                  type: 'string',
                  title: 'Email',
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                  'x-component-props': { type: 'email', placeholder: 'Enter email' },
                  required: true,
                },
                phone: {
                  type: 'string',
                  title: 'Phone',
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                  'x-component-props': { placeholder: 'Enter phone' },
                },
              },
            },
            properties: {
              addition: {
                type: 'void',
                title: 'Add Contact',
                'x-component': `${componentName}.Addition`,
              },
            },
          },
        },
      };

      return (
        <Form
          form={form}
          className="space-y-6"
          settings={{
            label: {
              useFieldNameAsLabel: true,
            },
          }}
        >
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">JSON Schema {displayTitle} Form</h2>
            <p className="text-muted-foreground">
              This form uses JSON schema to define an array with {componentName}{' '}
              component, demonstrating declarative form definition.
            </p>
          </div>

          <SchemaField schema={schema} />

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
}

/**
 * Creates a WithItemReactionTitle story for the given array component
 */
export function createWithItemReactionTitleStory(config: StoryConfig): Story {
  const { componentName, displayTitle } = config;

  return {
    render: () => {
      const form = createForm({
        values: {
          users: [
            { name: 'John Doe', email: 'john@example.com' },
            { name: 'Jane Smith', email: 'jane@example.com' },
          ],
        },
      });

      const schema = {
        type: 'object',
        properties: {
          users: {
            type: 'array',
            'x-component': componentName,
            'x-component-props': config.componentProps,
            items: {
              type: 'object',
              'x-reactions': {
                fulfill: {
                  state: {
                    title: "{{$self.value?.name || 'User'}}",
                  },
                },
              },
              properties: {
                name: {
                  type: 'string',
                  title: 'Name',
                  required: true,
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                  'x-component-props': {
                    placeholder: 'Enter name',
                  },
                },
                email: {
                  type: 'string',
                  title: 'Email',
                  required: true,
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                  'x-component-props': {
                    placeholder: 'Enter email',
                    type: 'email',
                  },
                },
              },
            },
            properties: {
              addition: {
                type: 'void',
                title: 'Add User',
                'x-component': `${componentName}.Addition`,
              },
            },
          },
        },
      };

      return (
        <Form form={form} className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{displayTitle} (Item Reaction Title)</h2>
            <p className="text-muted-foreground">
              Dynamic titles based on field values using x-reactions.
            </p>
          </div>

          <SchemaField schema={schema} />

          <div className="pt-4">
            <Button
              type="button"
              onClick={() => alert(JSON.stringify(form.values, null, 2))}
            >
              View Values
            </Button>
          </div>
        </Form>
      );
    },
  };
}

/**
 * Creates a WithTruncatedLabels story for the given array component
 */
export function createWithTruncatedLabelsStory(config: StoryConfig): Story {
  const { componentName, displayTitle } = config;

  return {
    render: () => {
      const form = createForm({
        values: {
          items: [
            { name: 'This is a very long item name that should be truncated properly' },
            { name: 'Another extremely lengthy item name to test truncation' },
          ],
        },
      });

      const schema = {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            'x-component': componentName,
            'x-component-props': config.componentProps,
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
                  required: true,
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                  'x-component-props': {
                    placeholder: 'Enter name',
                    className: 'w-64',
                  },
                },
              },
            },
            properties: {
              addition: {
                type: 'void',
                title: 'Add Item',
                'x-component': `${componentName}.Addition`,
              },
            },
          },
        },
      };

      return (
        <Form form={form} className="space-y-6 w-80">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{displayTitle} (Truncated Labels)</h2>
            <p className="text-muted-foreground">
              Long labels are truncated with ellipsis for better UI.
            </p>
          </div>

          <SchemaField schema={schema} />

          <div className="pt-4">
            <Button
              type="button"
              onClick={() => alert(JSON.stringify(form.values, null, 2))}
            >
              View Values
            </Button>
          </div>
        </Form>
      );
    },
  };
}

/**
 * Creates a Sortable story for the given array component
 * Demonstrates drag-and-drop reordering with a simple array
 */
export function createSortableStory(config: StoryConfig): Story {
  const { componentName, displayTitle } = config;

  return {
    render: () => {
      const form = createForm({
        values: {
          tasks: [
            { title: 'Design homepage mockup', priority: 'High' },
            { title: 'Implement user authentication', priority: 'High' },
            { title: 'Write unit tests', priority: 'Medium' },
            { title: 'Update documentation', priority: 'Low' },
            { title: 'Review pull requests', priority: 'Medium' },
          ],
        },
      });

      const schema = {
        type: 'object',
        properties: {
          tasks: {
            type: 'array',
            'x-component': componentName,
            'x-component-props': config.componentProps,
            items: {
              'x-reactions': [
                {
                  fulfill: {
                    state: {
                      title: "{{$self.value?.title || 'Task'}}",
                    },
                  },
                },
              ],
              type: 'object',
              properties: {
                title: {
                  type: 'string',
                  title: 'Task Title',
                  required: true,
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                  'x-component-props': { placeholder: 'Enter task title' },
                },
                priority: {
                  type: 'string',
                  title: 'Priority',
                  required: true,
                  'x-decorator': 'FormItem',
                  'x-component': 'Select',
                  enum: [
                    { label: 'High', value: 'High' },
                    { label: 'Medium', value: 'Medium' },
                    { label: 'Low', value: 'Low' },
                  ],
                },
              },
            },
            properties: {
              addition: {
                type: 'void',
                title: 'Add Task',
                'x-component': `${componentName}.Addition`,
              },
            },
          },
        },
      };

      return (
        <Form form={form} className="space-y-6 w-[700px]">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{displayTitle} (Sortable)</h2>
            <p className="text-muted-foreground">
              Drag items using the grip icon on the left to reorder. Changes are
              immediately reflected in the form state.
            </p>
          </div>

          <SchemaField schema={schema} />

          <div className="border-t pt-4">
            <Button
              onClick={() => {
                alert(JSON.stringify(form.values, null, 2));
              }}
            >
              View Values
            </Button>
          </div>
        </Form>
      );
    },
  };
}

/**
 * Creates a SortableNested story for the given array component
 * Demonstrates drag-and-drop reordering with nested arrays
 */
export function createSortableNestedStory(config: StoryConfig): Story {
  const { componentName, displayTitle } = config;

  return {
    render: () => {
      const form = createForm({
        values: {
          projects: [
            {
              name: 'Website Redesign',
              tasks: [
                { title: 'Create wireframes' },
                { title: 'Design mockups' },
                { title: 'Implement frontend' },
              ],
            },
            {
              name: 'Mobile App',
              tasks: [
                { title: 'Setup project structure' },
                { title: 'Implement navigation' },
              ],
            },
          ],
        },
      });

      return (
        <Form form={form} className="space-y-6 w-[800px]">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{displayTitle} (Sortable Nested)</h2>
            <p className="text-muted-foreground">
              Drag to reorder both projects and tasks within each project. Each level has
              independent sorting.
            </p>
          </div>

          <SchemaField>
            <SchemaField.Array
              name="projects"
              x-component={componentName}
              x-component-props={config.componentProps}
            >
              <SchemaField.Object
                x-reactions={{
                  fulfill: {
                    state: {
                      title: "{{$self.value?.name || 'Project'}}",
                    },
                  },
                }}
              >
                <SchemaField.String
                  name="name"
                  title="Project Name"
                  required
                  x-decorator="FormItem"
                  x-component="Input"
                  x-component-props={{ placeholder: 'Enter project name' }}
                />
                <SchemaField.Array
                  name="tasks"
                  title="Tasks"
                  x-component={componentName}
                  x-component-props={config.componentProps}
                >
                  <SchemaField.Object
                    x-reactions={{
                      fulfill: {
                        state: {
                          title: "{{$self.value?.title || 'Task'}}",
                        },
                      },
                    }}
                  >
                    <SchemaField.String
                      name="title"
                      title="Task Title"
                      required
                      x-decorator="FormItem"
                      x-component="Input"
                      x-component-props={{ placeholder: 'Enter task title' }}
                    />
                  </SchemaField.Object>
                  <SchemaField.Void
                    x-component={`${componentName}.Addition`}
                    title="Add Task"
                  />
                </SchemaField.Array>
              </SchemaField.Object>
              <SchemaField.Void
                x-component={`${componentName}.Addition`}
                title="Add Project"
              />
            </SchemaField.Array>
          </SchemaField>

          <div className="border-t pt-4">
            <Button
              onClick={() => {
                alert(JSON.stringify(form.values, null, 2));
              }}
            >
              View Values
            </Button>
          </div>
        </Form>
      );
    },
  };
}

/**
 * Creates a SortableDisabledInForm story for the given array component
 * Demonstrates disabling sortable functionality using form settings
 */
export function createSortableDisabledInFormStory(config: StoryConfig): Story {
  const { componentName, displayTitle } = config;

  return {
    render: () => {
      const form = createForm({
        values: {
          tasks: [
            { title: 'Design homepage mockup', priority: 'High' },
            { title: 'Implement user authentication', priority: 'High' },
            { title: 'Write unit tests', priority: 'Medium' },
            { title: 'Update documentation', priority: 'Low' },
            { title: 'Review pull requests', priority: 'Medium' },
          ],
        },
      });

      return (
        <Form
          form={form}
          className="space-y-6 w-[700px]"
          settings={{
            array: {
              sortable: false,
              item: {
                actions: ['up', 'down', 'edit', 'remove'],
              },
            },
          }}
        >
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{displayTitle} (Sortable Disabled)</h2>
            <p className="text-muted-foreground">
              Sorting is disabled via form settings. No drag handles are shown.
            </p>
          </div>

          <SchemaField>
            <SchemaField.Array
              name="tasks"
              x-component={componentName}
              x-component-props={config.componentProps}
            >
              <SchemaField.Object
                x-reactions={{
                  fulfill: {
                    state: {
                      title: "{{$self.value?.title || 'Task'}}",
                    },
                  },
                }}
              >
                <SchemaField.String
                  name="title"
                  title="Task Title"
                  required
                  x-decorator="FormItem"
                  x-component="Input"
                  x-component-props={{ placeholder: 'Enter task title' }}
                />
                <SchemaField.String
                  name="priority"
                  title="Priority"
                  required
                  x-decorator="FormItem"
                  x-component="Select"
                  enum={[
                    { label: 'High', value: 'High' },
                    { label: 'Medium', value: 'Medium' },
                    { label: 'Low', value: 'Low' },
                  ]}
                />
              </SchemaField.Object>
              <SchemaField.Void
                x-component={`${componentName}.Addition`}
                title="Add Task"
              />
            </SchemaField.Array>
          </SchemaField>

          <div className="border-t pt-4">
            <Button
              onClick={() => {
                alert(JSON.stringify(form.values, null, 2));
              }}
            >
              View Values
            </Button>
          </div>
        </Form>
      );
    },
  };
}

/**
 * Creates a SortableDisabledForArray story for the given array component
 * Demonstrates disabling sortable and using up/down actions instead
 */
export function createSortableDisabledForArrayStory(config: StoryConfig): Story {
  const { componentName, displayTitle } = config;

  return {
    render: () => {
      const form = createForm({
        values: {
          tasks: [
            { title: 'Design homepage mockup', priority: 'High' },
            { title: 'Implement user authentication', priority: 'High' },
            { title: 'Write unit tests', priority: 'Medium' },
            { title: 'Update documentation', priority: 'Low' },
            { title: 'Review pull requests', priority: 'Medium' },
          ],
        },
      });

      return (
        <Form form={form} className="space-y-6 w-[700px]">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{displayTitle} (Up/Down Actions)</h2>
            <p className="text-muted-foreground">
              Sorting is disabled, but up/down buttons are provided for reordering.
            </p>
          </div>

          <SchemaField>
            <SchemaField.Array
              name="tasks"
              x-component={componentName}
              x-component-props={{
                ...config.componentProps,
                sortable: false,
                actions: ['up', 'down', 'remove'],
              }}
            >
              <SchemaField.Object
                x-reactions={{
                  fulfill: {
                    state: {
                      title: "{{$self.value?.title || 'Task'}}",
                    },
                  },
                }}
              >
                <SchemaField.String
                  name="title"
                  title="Task Title"
                  required
                  x-decorator="FormItem"
                  x-component="Input"
                  x-component-props={{ placeholder: 'Enter task title' }}
                />
                <SchemaField.String
                  name="priority"
                  title="Priority"
                  required
                  x-decorator="FormItem"
                  x-component="Select"
                  enum={[
                    { label: 'High', value: 'High' },
                    { label: 'Medium', value: 'Medium' },
                    { label: 'Low', value: 'Low' },
                  ]}
                />
              </SchemaField.Object>
              <SchemaField.Void
                x-component={`${componentName}.Addition`}
                title="Add Task"
              />
            </SchemaField.Array>
          </SchemaField>

          <div className="border-t pt-4">
            <Button
              onClick={() => {
                alert(JSON.stringify(form.values, null, 2));
              }}
            >
              View Values
            </Button>
          </div>
        </Form>
      );
    },
  };
}

/**
 * Creates an AutoSave story for Dialog/Popover components with immediate changes
 */
export function createAutoSaveStory(config: StoryConfig): Story {
  const { componentName, displayTitle } = config;

  // Only applicable for ArrayDialog and ArrayPopover
  if (!componentName.includes('Dialog') && !componentName.includes('Popover')) {
    return {
      render: () => (
        <div className="p-4">
          <p className="text-muted-foreground">
            AutoSave is only applicable for ArrayDialog and ArrayPopover components.
          </p>
        </div>
      ),
    };
  }

  return {
    render: () => {
      const form = createForm({
        values: {
          contacts: [
            { name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin' },
            { name: 'Bob Smith', email: 'bob@example.com', role: 'User' },
          ],
        },
      });

      return (
        <Form
          form={form}
          className="w-[700px]"
          onSubmit={(values) => {
            // eslint-disable-next-line no-console
            console.log('Form submitted:', values);
            alert(JSON.stringify(values, null, JSON_INDENT));
          }}
        >
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold">{displayTitle} (Auto-Save Mode)</h2>
              <p className="text-muted-foreground mt-2">
                Changes are applied immediately as you type. No Save/Cancel buttons are
                shown. The dialog/popover stays open until you click outside or press ESC.
              </p>
            </div>

            <SchemaField>
              <SchemaField.Array
                name="contacts"
                x-component={componentName}
                x-component-props={{
                  autoSave: true,
                  ...config.componentProps,
                }}
              >
                <SchemaField.Object
                  x-reactions={{
                    fulfill: {
                      state: {
                        title: "{{$self.value?.name || 'Contact'}}",
                      },
                    },
                  }}
                >
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
                  <SchemaField.String
                    name="role"
                    title="Role"
                    x-decorator="FormItem"
                    x-component="Select"
                    enum={[
                      { label: 'Admin', value: 'Admin' },
                      { label: 'User', value: 'User' },
                      { label: 'Guest', value: 'Guest' },
                    ]}
                  />
                </SchemaField.Object>
              </SchemaField.Array>
            </SchemaField>

            <div className="border-t pt-4">
              <Button
                type="button"
                onClick={() => {
                  alert(JSON.stringify(form.values, null, JSON_INDENT));
                }}
              >
                View Current Values
              </Button>
            </div>
          </div>
        </Form>
      );
    },
  };
}

/**
 * Creates a ManualSave story for Dialog/Popover components with Save/Cancel buttons
 */
export function createManualSaveStory(config: StoryConfig): Story {
  const { componentName, displayTitle } = config;

  // Only applicable for ArrayDialog and ArrayPopover
  if (!componentName.includes('Dialog') && !componentName.includes('Popover')) {
    return {
      render: () => (
        <div className="p-4">
          <p className="text-muted-foreground">
            Manual Save is only applicable for ArrayDialog and ArrayPopover components.
          </p>
        </div>
      ),
    };
  }

  return {
    render: () => {
      const form = createForm({
        values: {
          tasks: [
            {
              title: 'Complete project proposal',
              description: 'Write and submit the Q1 project proposal',
              priority: 'High',
            },
            {
              title: 'Review code changes',
              description: 'Review pull requests from team members',
              priority: 'Medium',
            },
          ],
        },
      });

      return (
        <Form
          form={form}
          className="w-[700px]"
          onSubmit={(values) => {
            // eslint-disable-next-line no-console
            console.log('Form submitted:', values);
            alert(JSON.stringify(values, null, JSON_INDENT));
          }}
        >
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold">{displayTitle} (Manual Save Mode)</h2>
              <p className="text-muted-foreground mt-2">
                Changes are only applied when you click the Save button. The
                dialog/popover will shake if you try to close with unsaved changes. Click
                Cancel to discard changes.
              </p>
            </div>

            <SchemaField>
              <SchemaField.Array
                name="tasks"
                x-component={componentName}
                x-component-props={{
                  autoSave: false,
                  ...config.componentProps,
                }}
              >
                <SchemaField.Object
                  x-reactions={{
                    fulfill: {
                      state: {
                        title: "{{$self.value?.title || 'Task'}}",
                      },
                    },
                  }}
                >
                  <SchemaField.String
                    name="title"
                    title="Title"
                    required
                    x-decorator="FormItem"
                    x-component="Input"
                    x-component-props={{ placeholder: 'Enter task title' }}
                  />
                  <SchemaField.String
                    name="description"
                    title="Description"
                    x-decorator="FormItem"
                    x-component="Textarea"
                    x-component-props={{
                      placeholder: 'Enter task description',
                      rows: 3,
                    }}
                  />
                  <SchemaField.String
                    name="priority"
                    title="Priority"
                    required
                    x-decorator="FormItem"
                    x-component="Select"
                    enum={[
                      { label: 'High', value: 'High' },
                      { label: 'Medium', value: 'Medium' },
                      { label: 'Low', value: 'Low' },
                    ]}
                  />
                </SchemaField.Object>
              </SchemaField.Array>
            </SchemaField>

            <div className="border-t pt-4">
              <Button
                type="button"
                onClick={() => {
                  alert(JSON.stringify(form.values, null, JSON_INDENT));
                }}
              >
                View Current Values
              </Button>
            </div>
          </div>
        </Form>
      );
    },
  };
}
