/* eslint-disable no-console */
/* eslint-disable no-alert */
/* eslint-disable no-magic-numbers */
import type { Meta, StoryObj } from '@storybook/react';
import { createForm, Form, SchemaFieldExtended } from '../src';

const meta: Meta<typeof Form> = {
  title: 'Formily/Rating',
  component: Form,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Form>;

export const BasicRating: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        productRating: {
          type: 'number',
          title: 'Product Rating',
          'x-decorator': 'FormItem',
          'x-component': 'Rating',
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

export const RatingWithDefaultValue: Story = {
  render: () => {
    const form = createForm({
      initialValues: {
        serviceRating: 4,
      },
    });

    const schema = {
      type: 'object',
      properties: {
        serviceRating: {
          type: 'number',
          title: 'Service Rating',
          'x-decorator': 'FormItem',
          'x-component': 'Rating',
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

export const RatingWithCustomMax: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        experienceRating: {
          type: 'number',
          title: 'Experience Rating (1-10)',
          'x-decorator': 'FormItem',
          'x-component': 'Rating',
          'x-component-props': {
            max: 10,
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

export const RatingWithLabels: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        satisfactionRating: {
          type: 'number',
          title: 'How satisfied are you?',
          'x-decorator': 'FormItem',
          'x-component': 'Rating',
          'x-component-props': {
            labels: [
              'Very Dissatisfied',
              'Dissatisfied',
              'Neutral',
              'Satisfied',
              'Very Satisfied',
            ],
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

export const RatingWithCircleIcon: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        qualityRating: {
          type: 'number',
          title: 'Quality Rating',
          'x-decorator': 'FormItem',
          'x-component': 'Rating',
          'x-component-props': {
            iconType: 'circle',
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

export const RatingWithDifferentSizes: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        smallRating: {
          type: 'number',
          title: 'Small Rating',
          'x-decorator': 'FormItem',
          'x-component': 'Rating',
          'x-component-props': {
            size: 'sm',
          },
        },
        defaultRating: {
          type: 'number',
          title: 'Default Rating',
          'x-decorator': 'FormItem',
          'x-component': 'Rating',
        },
        largeRating: {
          type: 'number',
          title: 'Large Rating',
          'x-decorator': 'FormItem',
          'x-component': 'Rating',
          'x-component-props': {
            size: 'lg',
          },
        },
        extraLargeRating: {
          type: 'number',
          title: 'Extra Large Rating',
          'x-decorator': 'FormItem',
          'x-component': 'Rating',
          'x-component-props': {
            size: 'xl',
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

export const MultipleRatings: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        productQuality: {
          type: 'number',
          title: 'Product Quality',
          'x-decorator': 'FormItem',
          'x-component': 'Rating',
          'x-component-props': {
            labels: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
          },
        },
        customerService: {
          type: 'number',
          title: 'Customer Service',
          'x-decorator': 'FormItem',
          'x-component': 'Rating',
          'x-component-props': {
            labels: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
          },
        },
        shippingSpeed: {
          type: 'number',
          title: 'Shipping Speed',
          'x-decorator': 'FormItem',
          'x-component': 'Rating',
          'x-component-props': {
            labels: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
          },
        },
        valueForMoney: {
          type: 'number',
          title: 'Value for Money',
          'x-decorator': 'FormItem',
          'x-component': 'Rating',
          'x-component-props': {
            labels: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
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

export const RatingWithValidation: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        requiredRating: {
          type: 'number',
          title: 'Required Rating',
          required: true,
          'x-decorator': 'FormItem',
          'x-component': 'Rating',
          'x-validator': [
            {
              required: true,
              message: 'Please provide a rating',
            },
            {
              minimum: 1,
              message: 'Rating must be at least 1',
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

export const RatingInNestedObject: Story = {
  render: () => {
    const form = createForm();

    const schema = {
      type: 'object',
      properties: {
        productReview: {
          type: 'object',
          title: 'Product Review',
          properties: {
            overallRating: {
              type: 'number',
              title: 'Overall Rating',
              'x-decorator': 'FormItem',
              'x-component': 'Rating',
            },
            qualityRating: {
              type: 'number',
              title: 'Quality Rating',
              'x-decorator': 'FormItem',
              'x-component': 'Rating',
            },
            comment: {
              type: 'string',
              title: 'Comment',
              'x-decorator': 'FormItem',
              'x-component': 'Textarea',
            },
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

export const CompleteReviewForm: Story = {
  render: () => {
    const form = createForm({
      initialValues: {
        reviewerName: '',
        email: '',
        ratings: {
          overall: 0,
          quality: 0,
          service: 0,
        },
        wouldRecommend: false,
        comments: '',
      },
    });

    const schema = {
      type: 'object',
      properties: {
        reviewerName: {
          type: 'string',
          title: 'Your Name',
          required: true,
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-validator': [
            {
              required: true,
              message: 'Please enter your name',
            },
          ],
        },
        email: {
          type: 'string',
          title: 'Email',
          required: true,
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-validator': [
            {
              required: true,
              message: 'Please enter your email',
            },
            {
              format: 'email',
              message: 'Please enter a valid email',
            },
          ],
        },
        ratings: {
          type: 'object',
          title: 'Ratings',
          properties: {
            overall: {
              type: 'number',
              title: 'Overall Experience',
              required: true,
              'x-decorator': 'FormItem',
              'x-component': 'Rating',
              'x-component-props': {
                labels: ['Terrible', 'Poor', 'Average', 'Good', 'Excellent'],
                size: 'lg',
              },
              'x-validator': [
                {
                  minimum: 1,
                  message: 'Please provide an overall rating',
                },
              ],
            },
            quality: {
              type: 'number',
              title: 'Product Quality',
              'x-decorator': 'FormItem',
              'x-component': 'Rating',
              'x-component-props': {
                labels: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
              },
            },
            service: {
              type: 'number',
              title: 'Customer Service',
              'x-decorator': 'FormItem',
              'x-component': 'Rating',
              'x-component-props': {
                labels: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
              },
            },
          },
        },
        wouldRecommend: {
          type: 'boolean',
          title: 'Would you recommend this to a friend?',
          'x-decorator': 'FormItem',
          'x-component': 'Checkbox',
        },
        comments: {
          type: 'string',
          title: 'Additional Comments',
          'x-decorator': 'FormItem',
          'x-component': 'Textarea',
          'x-component-props': {
            placeholder: 'Tell us more about your experience...',
            rows: 4,
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
        <SchemaFieldExtended schema={schema} />
        <button
          type="submit"
          className="mt-4 w-full rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          Submit Review
        </button>
      </Form>
    );
  },
};
