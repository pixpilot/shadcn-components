import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { FileUploadInline } from '../src/FileUploadInline';

/**
 * A simple inline file upload component.
 * Shows a browse button and displays the selected filename with truncation.
 */
const meta = {
  title: 'shadcn-ui/FileUploadInline',
  component: FileUploadInline,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    buttonText: {
      control: 'text',
      description: 'Text to display when no file is selected',
    },
    showIcon: {
      control: 'boolean',
      description: 'Whether to show file icon',
    },
    showClear: {
      control: 'boolean',
      description: 'Whether to show clear button when file is selected',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FileUploadInline>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default file upload input
 */
export const Default: Story = {
  args: {
    buttonText: 'Browse file',
    showIcon: true,
    showClear: true,
  },
  render: function DefaultFileUpload(args) {
    const [file, setFile] = useState<File | File[] | null>(null);

    return <FileUploadInline {...args} value={file} onChange={setFile} />;
  },
};

/**
 * File upload with custom button text
 */
export const CustomButtonText: Story = {
  args: {
    buttonText: 'Select a document',
    showIcon: true,
    showClear: true,
  },
  render: function CustomButtonFileUpload(args) {
    const [file, setFile] = useState<File | File[] | null>(null);

    return <FileUploadInline {...args} value={file} onChange={setFile} />;
  },
};

/**
 * File upload without icon
 */
export const WithoutIcon: Story = {
  args: {
    buttonText: 'Choose file',
    showIcon: false,
    showClear: true,
  },
  render: function WithoutIconFileUpload(args) {
    const [file, setFile] = useState<File | File[] | null>(null);

    return <FileUploadInline {...args} value={file} onChange={setFile} />;
  },
};

/**
 * File upload without clear button
 */
export const WithoutClearButton: Story = {
  args: {
    buttonText: 'Browse file',
    showIcon: true,
    showClear: false,
  },
  render: function WithoutClearFileUpload(args) {
    const [file, setFile] = useState<File | File[] | null>(null);

    return <FileUploadInline {...args} value={file} onChange={setFile} />;
  },
};

/**
 * Disabled file upload
 */
export const Disabled: Story = {
  args: {
    buttonText: 'Browse file',
    showIcon: true,
    showClear: true,
    disabled: true,
  },
  render: function DisabledFileUpload(args) {
    const [file, setFile] = useState<File | File[] | null>(null);

    return <FileUploadInline {...args} value={file} onChange={setFile} />;
  },
};

/**
 * File upload with pre-selected file
 */
export const WithValue: Story = {
  args: {
    buttonText: 'Browse file',
    showIcon: true,
    showClear: true,
  },
  render: function WithValueFileUpload(args) {
    // Create a mock file for demonstration
    const mockFile = new File([''], 'example-document-with-a-very-long-filename.pdf', {
      type: 'application/pdf',
    });
    const [file, setFile] = useState<File | File[] | null>(mockFile);

    return <FileUploadInline {...args} value={file} onChange={setFile} />;
  },
};

/**
 * File upload with accept attribute for specific file types
 */
export const ImagesOnly: Story = {
  args: {
    buttonText: 'Select image',
    showIcon: true,
    showClear: true,
    accept: 'image/*',
  },
  render: function ImagesOnlyFileUpload(args) {
    const [file, setFile] = useState<File | File[] | null>(null);

    return <FileUploadInline {...args} value={file} onChange={setFile} />;
  },
};

/**
 * File upload with accept attribute for PDFs only
 */
export const PDFOnly: Story = {
  args: {
    buttonText: 'Select PDF',
    showIcon: true,
    showClear: true,
    accept: 'application/pdf',
  },
  render: function PDFOnlyFileUpload(args) {
    const [file, setFile] = useState<File | File[] | null>(null);

    return <FileUploadInline {...args} value={file} onChange={setFile} />;
  },
};
