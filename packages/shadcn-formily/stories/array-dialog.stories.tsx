/* eslint-disable no-alert */
/* eslint-disable no-magic-numbers */

import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@pixpilot/shadcn';
import React from 'react';

import { createForm, Form, SchemaField } from '../src';
import { createStories } from './array-stories';

const meta: Meta<typeof Form> = {
  title: 'Formily/Array Dialog',
  component: Form,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  // decorators: [
  //   (Story) => (
  //     <div className="w-[700px]">
  //       <Story />
  //     </div>
  //   ),
  // ],
};

export default meta;
type Story = StoryObj<typeof Form>;

const storyConfig = {
  componentName: 'ArrayDialog',
  displayTitle: 'ArrayDialog',
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

export const LongDialog: Story = {
  render: () => {
    const form = createForm({
      values: {
        items: [
          {
            name: 'Sample Item 1',
            description: 'This is a sample description for the first item.',
          },
        ],
      },
    });

    const schema = {
      type: 'object',
      properties: {
        items: {
          type: 'array',
          'x-component': 'ArrayDialog',
          'x-component-props': {
            className: 'max-h-[80vh] overflow-y-auto',
          },
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
              ...Array.from({ length: 30 }, (_, i) => ({
                [`field${i + 1}`]: {
                  type: 'string',
                  title: `Field ${i + 1}`,
                  required: i < 2, // Make first two fields required
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                  'x-component-props': {
                    placeholder: `Enter value for field ${i + 1}`,
                  },
                },
              })).reduce((acc, curr) => ({ ...acc, ...curr }), {}),
              description: {
                type: 'string',
                title: 'Description',
                'x-decorator': 'FormItem',
                'x-component': 'Textarea',
                'x-component-props': {
                  placeholder: 'Enter a detailed description',
                  rows: 4,
                },
              },
              notes: {
                type: 'string',
                title: 'Additional Notes',
                'x-decorator': 'FormItem',
                'x-component': 'Textarea',
                'x-component-props': {
                  placeholder: 'Any additional notes or comments',
                  rows: 3,
                },
              },
            },
          },
          properties: {
            addition: {
              type: 'void',
              title: 'Add Item',
              'x-component': 'ArrayDialog.Addition',
            },
          },
        },
      },
    };

    return (
      <Form form={form} className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Long Dialog Array</h2>
          <p className="text-muted-foreground">
            This array dialog contains many fields to demonstrate scrolling behavior in
            long forms.
          </p>
        </div>

        <SchemaField schema={schema} />

        <div className="border-t pt-4">
          <Button
            type="button"
            onClick={() => alert(JSON.stringify(form.values, null, 2))}
          >
            View Data
          </Button>
        </div>
      </Form>
    );
  },
};

function DialogInsideContainerSettingsContent() {
  const [container, setContainer] = React.useState<HTMLElement | null>(null);
  const containerRef = React.useCallback((node: HTMLDivElement | null) => {
    setContainer(node);
  }, []);

  const form = React.useMemo(
    () =>
      createForm({
        values: {
          items: [
            {
              name: 'Container Item',
              description: 'This dialog is rendered inside the bordered container.',
            },
          ],
        },
      }),
    [],
  );

  const schema = {
    type: 'object',
    properties: {
      items: {
        type: 'array',
        'x-component': 'ArrayDialog',
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
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
            description: {
              type: 'string',
              title: 'Description',
              'x-decorator': 'FormItem',
              'x-component': 'Textarea',
              'x-component-props': {
                rows: 4,
              },
            },
          },
        },
        properties: {
          addition: {
            type: 'void',
            title: 'Add Item',
            'x-component': 'ArrayDialog.Addition',
          },
        },
      },
    },
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Array Dialog In Container</h2>
        <p className="text-muted-foreground max-w-xl">
          This story uses <code>settings.dialog.container</code> on the form so the dialog
          portal mounts inside the bordered box instead of the document body.
        </p>
      </div>

      <div
        ref={containerRef}
        className="relative h-[360px] overflow-hidden rounded-lg border bg-muted/20 p-4"
      >
        <Form
          form={form}
          className="space-y-4"
          settings={{
            dialog: {
              container,
            },
          }}
        >
          <SchemaField schema={schema} />
        </Form>
      </div>
    </div>
  );
}

export const DialogInsideContainerSettings: Story = {
  render: () => <DialogInsideContainerSettingsContent />,
};

export const PreventBackdropDismiss: Story = {
  render: () => {
    const form = createForm({
      values: {
        items: [
          {
            name: 'Locked Item',
            description: 'Click the backdrop to verify the dialog stays open.',
          },
        ],
      },
    });

    const schema = {
      type: 'object',
      properties: {
        items: {
          type: 'array',
          'x-component': 'ArrayDialog',
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
                'x-decorator': 'FormItem',
                'x-component': 'Input',
              },
              description: {
                type: 'string',
                title: 'Description',
                'x-decorator': 'FormItem',
                'x-component': 'Textarea',
                'x-component-props': {
                  rows: 4,
                },
              },
            },
          },
          properties: {
            addition: {
              type: 'void',
              title: 'Add Item',
              'x-component': 'ArrayDialog.Addition',
            },
          },
        },
      },
    };

    return (
      <Form
        form={form}
        className="space-y-6 w-[720px]"
        settings={{
          dialog: {
            disableOutsideClick: true,
          },
        }}
      >
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Array Dialog Without Backdrop Dismiss</h2>
          <p className="text-muted-foreground">
            Open the item editor and click outside the dialog. The backdrop click should
            not close it because the setting is enabled through
            <code>settings.dialog.preventBackdropClickClose</code>.
          </p>
        </div>

        <SchemaField schema={schema} />
      </Form>
    );
  },
};
