import type { Meta, StoryObj } from '@storybook/react';
import type { FileMetadata, FileUploadProgressCallBacks } from '../src';
import { useState } from 'react';
import { FileUploadInline } from '../src';
import { delay, handleUpload } from './utils/file-upload';

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
type Story = StoryObj<typeof FileUploadInline>;

/**
 * Default file upload input
 */
export const Default: Story = {
  args: {
    buttonText: 'Browse file',
    showIcon: true,
  },
  render: function DefaultFileUpload(args) {
    return <FileUploadInline {...args} onUpload={handleUpload} />;
  },
};

/**
 * File upload with custom button text
 */
export const CustomButtonText: Story = {
  args: {
    buttonText: 'Select a document',
    showIcon: true,
  },
  render: function CustomButtonFileUpload(args) {
    return <FileUploadInline {...args} onUpload={handleUpload} />;
  },
};

/**
 * File upload without icon
 */
export const WithoutIcon: Story = {
  args: {
    buttonText: 'Choose file',
    showIcon: false,
  },
  render: function WithoutIconFileUpload(args) {
    return <FileUploadInline {...args} onUpload={handleUpload} />;
  },
};

/**
 * File upload without clear button
 */
export const WithoutClearButton: Story = {
  args: {
    buttonText: 'Browse file',
    showIcon: true,
  },
  render: function WithoutClearFileUpload(args) {
    return <FileUploadInline {...args} onUpload={handleUpload} />;
  },
};

/**
 * Disabled file upload
 */
export const Disabled: Story = {
  args: {
    buttonText: 'Browse file',
    showIcon: true,

    disabled: true,
  },
  render: function DisabledFileUpload(args) {
    return <FileUploadInline {...args} onUpload={handleUpload} />;
  },
};

/**
 * File upload with pre-selected file
 */
export const WithValue: Story = {
  args: {
    buttonText: 'Browse file',
    showIcon: true,
  },
  render: function WithValueFileUpload(args) {
    const [files, setFiles] = useState<FileMetadata | null>({
      name: 'avatar.png',
      size: 1024,
      type: 'image/png',
      url: `${window.location.origin}/avatar.png`,
      lastModified: 1625247600000,
    });

    const handleChange = (newFiles: FileMetadata | null) => {
      setFiles(newFiles);
    };

    return (
      <FileUploadInline
        {...args}
        value={files}
        multiple={false}
        onChange={handleChange}
        onUpload={handleUpload}
      />
    );
  },
};

/**
 * File upload with pre-selected file
 */
export const WithMultipleAndValue: Story = {
  args: {
    buttonText: 'Browse file',
    showIcon: true,
    multiple: true,
  },
  render: function WithValueFileUpload(args) {
    const [files, setFiles] = useState<FileMetadata[]>([
      {
        name: 'avatar.png',
        size: 1024,
        type: 'image/png',
        url: `${window.location.origin}/avatar.png`,
        lastModified: 1625247600000,
      },
    ]);
    const [changeCount, setChangeCount] = useState(0);

    const handleChange = (newFiles: FileMetadata[]) => {
      setFiles(newFiles);
      setChangeCount((c) => c + 1);
    };

    return (
      <>
        <FileUploadInline
          {...args}
          value={files}
          multiple={true}
          onChange={handleChange}
          onUpload={handleUpload}
        />
        <div style={{ marginTop: 12 }}>
          <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
            onChange called: {changeCount} {changeCount === 1 ? 'time' : 'times'}
          </div>
          <pre>
            {JSON.stringify(
              files.map((x) => ({ name: x.name, size: x.size })),
              null,
              2,
            )}
          </pre>
        </div>
      </>
    );
  },
};

/**
 * File upload with accept attribute for specific file types
 */
export const ImagesOnly: Story = {
  args: {
    buttonText: 'Select image',
    showIcon: true,

    accept: 'image/*',
  },
  render: function ImagesOnlyFileUpload(args) {
    return <FileUploadInline {...args} onUpload={handleUpload} />;
  },
};

/**
 * File upload with accept attribute for PDFs only
 */
export const PDFOnly: Story = {
  args: {
    buttonText: 'Select PDF',
    showIcon: true,

    accept: 'application/pdf',
  },
  render: function PDFOnlyFileUpload(args) {
    return <FileUploadInline {...args} onUpload={handleUpload} />;
  },
};

/**
 * File upload with API mock integration
 * Demonstrates uploading files to a mocked /api/upload endpoint with progress tracking
 */
export const WithMockedUpload: Story = {
  args: {
    buttonText: 'Upload file',
    showIcon: true,
  },
  render: function WithMockedUploadFileUpload(args) {
    return <FileUploadInline {...args} onUpload={handleUpload} />;
  },
};

export const MultipleFiles: Story = {
  args: {
    buttonText: 'Browse files',
    showIcon: true,

    multiple: true,
  },
  render: function MultipleFilesUpload(args) {
    return <FileUploadInline {...args} onUpload={handleUpload} />;
  },
};

export const WithUploadError: Story = {
  args: {
    buttonText: 'Upload file',
    showIcon: true,
  },
  render: function WithUploadErrorFileUpload(args) {
    function handleUploadWithError(
      uploadFiles: File[],
      options: FileUploadProgressCallBacks,
    ) {
      for (const uploadFile of uploadFiles) {
        // eslint-disable-next-line no-void
        void (async () => {
          // Simulate upload time
          await delay(500);

          options.onProgress(uploadFile, 0);

          options.onError(uploadFile, new Error('Upload failed due to network error.'));
        })();
      }
    }

    return (
      <FileUploadInline
        {...args}
        value={null}
        multiple={false}
        onUpload={handleUploadWithError}
        onChange={(_file) => {
          // handle single file change
        }}
      />
    );
  },
};
