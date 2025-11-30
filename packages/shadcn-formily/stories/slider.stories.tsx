/* eslint-disable no-console */
/* eslint-disable no-alert */
import type { Meta, StoryObj } from '@storybook/react';
import { createForm, Form, SchemaField } from '../src';

const meta: Meta<typeof Form> = {
  title: 'Formily/Slider',
  component: Form,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Form>;

export const BasicSlider: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        volume: {
          type: 'number',
          title: 'Volume',
          'x-decorator': 'FormItem',
          'x-component': 'Slider',
          'x-component-props': {
            defaultValue: [50],
            max: 100,
            step: 1,
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

export const MultipleSliders: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        brightness: {
          type: 'number',
          title: 'Brightness',
          'x-decorator': 'FormItem',
          'x-component': 'Slider',
          'x-component-props': {
            defaultValue: [75],
            max: 100,
            step: 5,
          },
        },
        contrast: {
          type: 'number',
          title: 'Contrast',
          'x-decorator': 'FormItem',
          'x-component': 'Slider',
          'x-component-props': {
            defaultValue: [50],
            max: 100,
            step: 1,
          },
        },
        saturation: {
          type: 'number',
          title: 'Saturation',
          'x-decorator': 'FormItem',
          'x-component': 'Slider',
          'x-component-props': {
            defaultValue: [60],
            max: 100,
            step: 1,
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

export const SliderWithRange: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        temperature: {
          type: 'number',
          title: 'Temperature (°C)',
          'x-decorator': 'FormItem',
          'x-component': 'Slider',
          'x-component-props': {
            defaultValue: [20],
            min: -10,
            max: 40,
            step: 1,
          },
        },
        price: {
          type: 'number',
          title: 'Price ($)',
          'x-decorator': 'FormItem',
          'x-component': 'Slider',
          'x-component-props': {
            defaultValue: [500],
            min: 0,
            max: 1000,
            step: 10,
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

export const DeclarativeSlider: Story = {
  render: () => {
    const form = createForm({
      values: {
        volume: 75,
        brightness: 50,
      },
    });

    const MAX_VOLUME = 100;
    const MAX_BRIGHTNESS = 100;

    return (
      <Form
        form={form}
        className="w-[400px]"
        onSubmit={(values) => {
          console.log('Form submitted:', values);
          alert(JSON.stringify(values, null, 2));
        }}
      >
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Audio & Display Settings</h3>

          <SchemaField>
            <SchemaField.Number
              name="volume"
              title="Volume"
              x-decorator="FormItem"
              x-component="Slider"
              x-component-props={{
                defaultValue: [75],
                max: MAX_VOLUME,
                step: 1,
              }}
            />
            <SchemaField.Number
              name="brightness"
              title="Brightness"
              x-decorator="FormItem"
              x-component="Slider"
              x-component-props={{
                defaultValue: [50],
                max: MAX_BRIGHTNESS,
                step: 5,
              }}
            />
            <SchemaField.Number
              name="contrast"
              title="Contrast"
              x-decorator="FormItem"
              x-component="Slider"
              x-component-props={{
                defaultValue: [50],
                max: 100,
                step: 1,
              }}
            />
          </SchemaField>
        </div>
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
