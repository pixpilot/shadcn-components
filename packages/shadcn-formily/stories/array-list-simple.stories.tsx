/* eslint-disable no-alert */
/* eslint-disable no-magic-numbers */
/* eslint-disable ts/no-misused-promises */
import type { Meta, StoryObj } from '@storybook/react';
import { ArrayField } from '@formily/react';
import { Button } from '@internal/shadcn';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  EditIcon,
  PlusIcon,
  Trash2Icon,
} from 'lucide-react';
import React from 'react';
import { createForm, Field, Form, FormItem, Input, Textarea } from '../src';

const meta: Meta<typeof Form> = {
  title: 'Formily/Array Items (List)',
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

/**
 * Basic list of items with move up/down, edit, and remove functionality
 * Uses ArrayField with custom list rendering
 */
export const BasicListImplementation: Story = {
  render: () => {
    const form = createForm({
      initialValues: {
        tasks: [
          { title: 'Task 1', description: 'Description for task 1' },
          { title: 'Task 2', description: 'Description for task 2' },
          { title: 'Task 3', description: 'Description for task 3' },
        ],
      },
    });

    return (
      <Form form={form} className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Task List</h2>
          <p className="text-muted-foreground">
            Custom list implementation with move up/down, edit, and remove controls
          </p>
        </div>

        <ArrayField name="tasks">
          {(field) => {
            const [editingIndex, setEditingIndex] = React.useState<number | null>(null);

            return (
              <div className="space-y-2">
                {field.value?.map((_: unknown, index: number) => (
                  <div key={index} className="relative">
                    <div className="border-input bg-card hover:bg-accent/50 flex items-center gap-2 rounded-md border p-3 transition-colors">
                      {/* Left: Move up/down buttons */}
                      <div className="flex flex-col gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-7"
                          disabled={index === 0}
                          onClick={async () => field.moveUp(index)}
                        >
                          <ChevronUpIcon className="size-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-7"
                          disabled={index === (field.value?.length ?? 0) - 1}
                          onClick={async () => field.moveDown(index)}
                        >
                          <ChevronDownIcon className="size-4" />
                        </Button>
                      </div>

                      {/* Center: Item label */}
                      <div className="text-foreground flex-1 font-medium">
                        <span className="font-medium">#{index + 1}</span> Item
                      </div>

                      {/* Right: Edit and Remove buttons */}
                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          onClick={() => setEditingIndex(index)}
                        >
                          <EditIcon className="size-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          onClick={async () => field.remove(index)}
                        >
                          <Trash2Icon className="size-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Edit inline form */}
                    {editingIndex === index && (
                      <div className="bg-muted mt-2 space-y-4 rounded-lg border p-4">
                        <h4 className="font-semibold">Edit Item #{index + 1}</h4>
                        <Field
                          name={`tasks.${index}.title`}
                          title="Title"
                          required
                          decorator={[FormItem]}
                          component={[Input, { placeholder: 'Task title' }]}
                        />
                        <Field
                          name={`tasks.${index}.description`}
                          title="Description"
                          decorator={[FormItem]}
                          component={[Textarea, { placeholder: 'Task description' }]}
                        />
                        <div className="flex justify-end">
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => setEditingIndex(null)}
                          >
                            Done
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Add button */}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={async () => field.push({ title: '', description: '' })}
                >
                  <PlusIcon className="mr-2 size-4" />
                  Add Task
                </Button>
              </div>
            );
          }}
        </ArrayField>

        <div className="border-t pt-4">
          <Button
            type="button"
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

/**
 * Simple tags list
 */
export const SimpleTagsList: Story = {
  render: () => {
    const form = createForm({
      initialValues: {
        tags: ['React', 'TypeScript', 'Tailwind', 'Formily'],
      },
    });

    return (
      <Form form={form} className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Tags</h2>
          <p className="text-muted-foreground">Simple string array with reordering</p>
        </div>

        <ArrayField name="tags">
          {(field) => (
            <div className="space-y-2">
              {field.value?.map((tag: string, index: number) => (
                <div
                  key={index}
                  className="border-input bg-card hover:bg-accent/50 flex items-center gap-2 rounded-md border p-3 transition-colors"
                >
                  {/* Left: Move up/down buttons */}
                  <div className="flex flex-col gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      disabled={index === 0}
                      onClick={async () => field.moveUp(index)}
                    >
                      <ChevronUpIcon className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      disabled={index === (field.value?.length ?? 0) - 1}
                      onClick={async () => field.moveDown(index)}
                    >
                      <ChevronDownIcon className="size-4" />
                    </Button>
                  </div>

                  {/* Center: Tag value */}
                  <div className="text-foreground flex-1">
                    <span className="font-medium">#{index + 1}</span> {tag}
                  </div>

                  {/* Right: Remove button */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={async () => field.remove(index)}
                  >
                    <Trash2Icon className="size-4" />
                  </Button>
                </div>
              ))}

              {/* Add button */}
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={async () => {
                  const newTag = prompt('Enter tag name:');
                  if (newTag != null) await field.push(newTag);
                }}
              >
                <PlusIcon className="mr-2 size-4" />
                Add Tag
              </Button>
            </div>
          )}
        </ArrayField>

        <div className="border-t pt-4">
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
