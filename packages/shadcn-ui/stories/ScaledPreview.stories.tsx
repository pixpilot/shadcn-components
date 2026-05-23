import type { Meta, StoryObj } from '@storybook/react';
import { ScaledPreview } from '../src/ScaledPreview';

/**
 * A component that scales its children to fit within a specified preview size,
 * useful for displaying page previews or scaled content.
 */
const meta = {
  title: 'shadcn-ui/ScaledPreview',
  component: ScaledPreview,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    scaleFactor: {
      control: 'number',
      description: 'Scale factor for preview box (e.g., 0.5 = 50% of baseSize).',
    },
    previewBoxSize: {
      control: 'object',
      description: 'Explicit preview box size. If provided, ignores scaleFactor.',
    },
    baseSize: {
      control: 'object',
      description: 'Base content dimensions. Defaults to 1000×1000.',
    },
    padding: {
      control: 'number',
      description: 'Padding in pixels (reduces available space for content scaling).',
    },
    forceScale: {
      control: 'number',
      description: 'Manual content scale override (bypasses automatic fit calculation).',
    },
    children: {
      control: 'text',
      description: 'Content to be scaled and displayed',
    },
  },
} satisfies Meta<typeof ScaledPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default scaled preview with sample content
 */
export const Default: Story = {
  args: {
    scaleFactor: 1,
    children: (
      <div
        id="scaled-preview-div-1"
        style={{
          width: '816px',
          height: '1056px',
          background: 'white',
          border: '1px solid #ccc',
          padding: '10px',
          color: '#333',
        }}
      >
        <h1 id="scaled-preview-h1-1">Sample Page</h1>
        <p id="scaled-preview-p-1">
          This is a sample page content that will be scaled to fit the preview size.
        </p>
        <p id="scaled-preview-p-2">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua.
        </p>
      </div>
    ),
  },
};

/**
 * Small preview size
 */
export const Small: Story = {
  args: {
    scaleFactor: 0.5,
    children: (
      <div
        id="scaled-preview-div-2"
        style={{
          width: '816px',
          height: '1056px',
          background: 'lightblue',
          border: '1px solid #ccc',
          padding: '10px',
        }}
      >
        <h2 id="scaled-preview-h2-1">Small Preview</h2>
        <p id="scaled-preview-p-3">Content scaled down for a smaller preview.</p>
      </div>
    ),
  },
};

/**
 * Large preview size
 */
export const Large: Story = {
  args: {
    scaleFactor: 3,
    padding: 40,
    children: (
      <div
        id="scaled-preview-div-3"
        style={{
          width: '816px',
          height: '1056px',
          background: 'lightgreen',
          border: '1px solid #ccc',
          padding: '10px',
        }}
      >
        <h1 id="scaled-preview-h1-2">Large Preview</h1>
        <p id="scaled-preview-p-4">This preview is larger, showing more detail.</p>
        <ul id="scaled-preview-ul-1">
          <li id="scaled-preview-li-1">Item 1</li>
          <li id="scaled-preview-li-2">Item 2</li>
          <li id="scaled-preview-li-3">Item 3</li>
        </ul>
      </div>
    ),
  },
};

/**
 * Manual scale factor
 */
export const ManualScale: Story = {
  args: {
    scaleFactor: 2,
    forceScale: 0.5,
    children: (
      <div
        id="scaled-preview-div-4"
        style={{
          width: '816px',
          height: '1056px',
          background: 'lightcoral',
          border: '1px solid #ccc',
          padding: '10px',
        }}
      >
        <h1 id="scaled-preview-h1-3">Manual Scale</h1>
        <p id="scaled-preview-p-5">
          This preview uses a manual scale factor of 0.5, making the content appear at 50%
          of its original size.
        </p>
        <p id="scaled-preview-p-6">
          The automatic scaling is overridden by the scale prop.
        </p>
      </div>
    ),
  },
};

/**
 * Custom size override
 */
export const CustomSize: Story = {
  args: {
    scaleFactor: 1, // This will be ignored since previewBoxSize is provided
    previewBoxSize: { width: 500, height: 700 },
    children: (
      <div
        id="scaled-preview-div-5"
        style={{
          width: '816px',
          height: '1056px',
          background: 'lightgreen',
          border: '1px solid #ccc',
          padding: '10px',
        }}
      >
        <h1 id="scaled-preview-h1-4">Custom Size</h1>
        <p id="scaled-preview-p-7">
          This preview uses a custom size of 500x700 pixels, overriding the scaleFactor
          calculation.
        </p>
        <p id="scaled-preview-p-8">
          The previewBoxSize prop takes precedence over scaleFactor.
        </p>
      </div>
    ),
  },
};
