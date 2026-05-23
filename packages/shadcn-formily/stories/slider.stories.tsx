/* eslint-disable no-console */
/* eslint-disable no-alert */
import type { Meta, StoryObj } from '@storybook/react';
import { onFieldInputValueChange } from '@formily/core';
import { observer } from '@formily/react';
import { useMemo } from 'react';
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
    const Component = observer(() => {
      const form = useMemo(
        () =>
          createForm({
            effects: () => {
              onFieldInputValueChange('*', (field) => {
                console.log('Field changed:', field.value);
              });
            },
          }),
        [],
      );

      const schema = {
        type: 'object',
        properties: {
          volume: {
            type: 'number',
            title: 'Volume',
            default: 50,
            'x-decorator': 'FormItem',
            'x-component': 'Slider',
            'x-component-props': {
              max: 100,
              step: 1,
            },
          },
        },
      };

      return (
        <Form
          id="slider"
          form={form}
          className="w-[400px]"
          onSubmit={(values) => {
            console.log('Form submitted:', values);
            alert(JSON.stringify(values, null, 2));
          }}
        >
          <SchemaField schema={schema} />
          <pre id="slider-pre-1" className="mt-4 text-sm">
            {JSON.stringify(form.values, null, 2)}
          </pre>
          <button
            id="slider-button-1"
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

export const MultipleSliders: Story = {
  render: () => {
    const Component = observer(() => {
      const form = useMemo(() => createForm(), []);

      const schema = {
        type: 'object',
        properties: {
          brightness: {
            type: 'number',
            title: 'Brightness',
            default: 70,
            'x-decorator': 'FormItem',
            'x-component': 'Slider',
            'x-component-props': {
              max: 100,
              step: 5,
            },
          },
          contrast: {
            type: 'number',
            title: 'Contrast',
            default: 40,
            'x-decorator': 'FormItem',
            'x-component': 'Slider',
            'x-component-props': {
              max: 100,
              step: 1,
            },
          },
          saturation: {
            type: 'number',
            title: 'Saturation',
            default: 50,
            'x-decorator': 'FormItem',
            'x-component': 'Slider',
            'x-component-props': {
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
          <pre id="slider-pre-2" className="mt-4 text-sm">
            {JSON.stringify(form.values, null, 2)}
          </pre>
          <button
            id="slider-button-2"
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

export const SliderWithRange: Story = {
  render: () => {
    const Component = observer(() => {
      const form = useMemo(() => createForm(), []);

      const schema = {
        type: 'object',
        properties: {
          temperature: {
            type: 'number',
            title: 'Temperature (°C)',
            'x-decorator': 'FormItem',
            'x-component': 'Slider',
            default: 15,
            'x-component-props': {
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
            default: 500,
            'x-component-props': {
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
          <pre id="slider-pre-3" className="mt-4 text-sm">
            {JSON.stringify(form.values, null, 2)}
          </pre>
          <button
            id="slider-button-3"
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

export const DeclarativeSlider: Story = {
  render: () => {
    const Component = observer(() => {
      const form = useMemo(
        () =>
          createForm({
            values: {
              volume: 75,
              brightness: 50,
            },
          }),
        [],
      );

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
          <div id="slider-div-1" className="space-y-6">
            <h3 id="slider-h3-1" className="text-lg font-semibold">
              Audio & Display Settings
            </h3>

            <SchemaField>
              <SchemaField.Number
                name="volume"
                title="Volume"
                x-decorator="FormItem"
                x-component="Slider"
                x-component-props={{
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
                  max: MAX_BRIGHTNESS,
                  step: 5,
                }}
              />
              <SchemaField.Number
                name="contrast"
                title="Contrast"
                x-decorator="FormItem"
                x-component="Slider"
                default={20}
                x-component-props={{
                  max: 100,
                  step: 1,
                }}
              />
            </SchemaField>
          </div>
          <pre id="slider-pre-4" className="mt-4 text-sm">
            {JSON.stringify(form.values, null, 2)}
          </pre>
          <button
            id="slider-button-4"
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

export const SliderWithTwoKnobs: Story = {
  render: () => {
    const Component = observer(() => {
      const form = useMemo(() => createForm(), []);

      const schema = {
        type: 'object',
        properties: {
          range: {
            type: 'array',
            title: 'Price Range',
            default: [200, 800],
            'x-decorator': 'FormItem',
            'x-component': 'Slider',
            'x-component-props': {
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
          <pre id="slider-pre-5" className="mt-4 text-sm">
            {JSON.stringify(form.values, null, 2)}
          </pre>
          <button
            id="slider-button-5"
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

export const SliderWithThreeKnobs: Story = {
  render: () => {
    const Component = observer(() => {
      const form = useMemo(() => createForm(), []);

      const schema = {
        type: 'object',
        properties: {
          levels: {
            type: 'array',
            title: 'Audio Levels',
            default: [20, 50, 80],
            'x-decorator': 'FormItem',
            'x-component': 'Slider',
            'x-component-props': {
              min: 0,
              max: 100,
              step: 5,
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
          <pre id="slider-pre-6" className="mt-4 text-sm">
            {JSON.stringify(form.values, null, 2)}
          </pre>
          <button
            id="slider-button-6"
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
