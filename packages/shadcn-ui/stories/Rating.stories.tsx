import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Rating } from '../src/Rating';

/**
 * A customizable rating component for displaying and collecting user ratings.
 * Supports stars or circles, custom options, hover previews, and various sizes.
 */
const meta = {
  title: 'shadcn-ui/Rating',
  component: Rating,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    max: {
      control: { type: 'number', min: 1, max: 10 },
      description: 'Maximum rating value (number of items)',
      defaultValue: 5,
    },
    iconType: {
      control: 'select',
      options: ['star', 'circle'],
      description: 'Type of icon to display',
      defaultValue: 'star',
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg', 'xl'],
      description: 'Size of the rating icons',
      defaultValue: 'default',
    },
    color: {
      control: 'select',
      options: [
        'default',
        'primary',
        'secondary',
        'destructive',
        'foreground',
        'accent',
        'muted',
        'ring',
      ],
      description: 'Color variant for the rating',
      defaultValue: 'default',
    },
    readOnly: {
      control: 'boolean',
      description: 'Display-only mode (no interaction)',
      defaultValue: false,
    },
    disabled: {
      control: 'boolean',
      description: 'Disables all rating interactions',
      defaultValue: false,
    },
  },
} satisfies Meta<typeof Rating>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default rating with 5 stars
 */
export const Default: Story = {
  args: {
    defaultValue: 0,
  },
};

/**
 * Rating with default value
 */
export const WithDefaultValue: Story = {
  args: {
    defaultValue: 3,
  },
};

/**
 * Interactive rating that shows the current value
 */
export const Interactive: Story = {
  render: function InteractiveRating() {
    const [rating, setRating] = React.useState(0);
    return (
      <div className="flex flex-col items-center gap-4">
        <Rating value={rating} onValueChange={setRating} />
        <p className="text-sm text-muted-foreground">
          Rating: {rating > 0 ? `${rating} / 5` : 'Not rated'}
        </p>
      </div>
    );
  },
};

/**
 * Rating with custom option labels that appear on hover
 */
export const WithLabels: Story = {
  render: function WithLabelsRating() {
    const [rating, setRating] = React.useState(0);
    const options = [
      { label: 'Terrible', value: 1 },
      { label: 'Bad', value: 2 },
      { label: 'Okay', value: 3 },
      { label: 'Good', value: 4 },
      { label: 'Excellent', value: 5 },
    ];
    return (
      <div className="flex flex-col items-center gap-4">
        <Rating value={rating} onValueChange={setRating} options={options} />
        <p className="text-sm text-muted-foreground">
          {rating > 0 ? options[rating - 1]?.label : 'Hover over stars to see labels'}
        </p>
      </div>
    );
  },
};

/**
 * Rating with 10 items instead of default 5
 */
export const CustomMax: Story = {
  render: function CustomMaxRating() {
    const [rating, setRating] = React.useState(0);
    return (
      <div className="flex flex-col items-center gap-4">
        <Rating value={rating} onValueChange={setRating} max={10} />
        <p className="text-sm text-muted-foreground">Rating: {rating} / 10</p>
      </div>
    );
  },
};

/**
 * Rating using circles instead of stars
 */
export const CircleIcon: Story = {
  render: function CircleIconRating() {
    const INITIAL_RATING = 3;
    const [rating, setRating] = React.useState(INITIAL_RATING);
    return (
      <div className="flex flex-col items-center gap-4">
        <Rating value={rating} onValueChange={setRating} iconType="circle" />
        <p className="text-sm text-muted-foreground">Rating: {rating} / 5</p>
      </div>
    );
  },
};

/**
 * Small size rating
 */
export const SmallSize: Story = {
  args: {
    defaultValue: 4,
    size: 'sm',
  },
};

/**
 * Large size rating
 */
export const LargeSize: Story = {
  args: {
    defaultValue: 4,
    size: 'lg',
  },
};

/**
 * Extra large size rating
 */
export const ExtraLargeSize: Story = {
  args: {
    defaultValue: 4,
    size: 'xl',
  },
};

/**
 * Read-only rating for displaying existing ratings
 */
export const ReadOnly: Story = {
  args: {
    value: 4,
    readOnly: true,
  },
};

/**
 * Disabled rating
 */
export const Disabled: Story = {
  args: {
    defaultValue: 3,
    disabled: true,
  },
};

/**
 * Color variations comparison
 */
export const ColorComparison: Story = {
  render: function ColorComparisonRating() {
    const DEFAULT_RATING = 3;
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm font-medium">Default (Yellow)</p>
          <Rating defaultValue={DEFAULT_RATING} color="default" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm font-medium">Primary</p>
          <Rating defaultValue={DEFAULT_RATING} color="primary" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm font-medium">Secondary</p>
          <Rating defaultValue={DEFAULT_RATING} color="secondary" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm font-medium">Destructive</p>
          <Rating defaultValue={DEFAULT_RATING} color="destructive" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm font-medium">Foreground</p>
          <Rating defaultValue={DEFAULT_RATING} color="foreground" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm font-medium">Accent</p>
          <Rating defaultValue={DEFAULT_RATING} color="accent" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm font-medium">Muted</p>
          <Rating defaultValue={DEFAULT_RATING} color="muted" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm font-medium">Ring</p>
          <Rating defaultValue={DEFAULT_RATING} color="ring" />
        </div>
      </div>
    );
  },
};

/**
 * Complete example with all features
 */
export const Complete: Story = {
  render: function CompleteRating() {
    const [rating, setRating] = React.useState(0);
    const options = [
      { label: 'Very Poor', value: 1 },
      { label: 'Poor', value: 2 },
      { label: 'Average', value: 3 },
      { label: 'Good', value: 4 },
      { label: 'Excellent', value: 5 },
    ];

    return (
      <div className="flex flex-col items-center gap-6 p-8">
        <div className="flex flex-col items-center gap-2">
          <h3 className="text-lg font-semibold">Rate your experience</h3>
          <Rating value={rating} onValueChange={setRating} options={options} size="lg" />
          {rating > 0 && (
            <p className="text-sm font-medium text-primary">
              {options[rating - 1]?.label}
            </p>
          )}
        </div>
      </div>
    );
  },
};

/**
 * Different icon types comparison
 */
export const IconTypeComparison: Story = {
  render: function IconTypeComparisonRating() {
    const INITIAL_STAR_RATING = 3;
    const INITIAL_CIRCLE_RATING = 4;
    const [starRating, setStarRating] = React.useState(INITIAL_STAR_RATING);
    const [circleRating, setCircleRating] = React.useState(INITIAL_CIRCLE_RATING);

    return (
      <div className="flex flex-col gap-8">
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm font-medium">Star Rating</p>
          <Rating value={starRating} onValueChange={setStarRating} iconType="star" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm font-medium">Circle Rating</p>
          <Rating
            value={circleRating}
            onValueChange={setCircleRating}
            iconType="circle"
          />
        </div>
      </div>
    );
  },
};

/**
 * Size variations comparison
 */
export const SizeComparison: Story = {
  render: function SizeComparisonRating() {
    const DEFAULT_RATING = 3;
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm font-medium">Small</p>
          <Rating defaultValue={DEFAULT_RATING} size="sm" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm font-medium">Default</p>
          <Rating defaultValue={DEFAULT_RATING} size="default" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm font-medium">Large</p>
          <Rating defaultValue={DEFAULT_RATING} size="lg" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm font-medium">Extra Large</p>
          <Rating defaultValue={DEFAULT_RATING} size="xl" />
        </div>
      </div>
    );
  },
};
