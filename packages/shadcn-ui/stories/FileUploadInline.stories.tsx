import type { Meta, StoryObj } from '@storybook/react';
import type { FileUploadProgressCallBacks } from '../src';
import { useState } from 'react';
import { FileUploadInline } from '../src';

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

export async function delay(val: number) {
  await new Promise((resolve) => {
    setTimeout(resolve, val);
  });
}

function handleUpload(
  files: File[],
  options: { onProgress: (file: File, progress: number) => void },
) {
  const maxProgress = 90;
  const progressIncrement = 5;
  const minIncrement = 1;
  const intervalMs = 200;
  const minDelay = 2000;
  const delayRange = 2000;
  const finalProgress = 100;

  for (const uploadFile of files) {
    // eslint-disable-next-line no-void
    void (async () => {
      let progress = 0;
      const intervalId = setInterval(() => {
        progress += Math.random() * progressIncrement + minIncrement; // Increase progress gradually
        if (progress > maxProgress) progress = maxProgress;
        options.onProgress(uploadFile, progress);
      }, intervalMs); // Update every 200ms for smoother progress

      // Simulate upload time with random delay
      await delay(minDelay + Math.random() * delayRange); // 2-4 seconds

      clearInterval(intervalId);
      options.onProgress(uploadFile, finalProgress);
    })();
  }
}

/**
 * File upload with API mock integration
 * Demonstrates uploading files to a mocked /api/upload endpoint with progress tracking
 */
export const WithMockedUpload: Story = {
  args: {
    buttonText: 'Upload file',
    showIcon: true,
    showClear: true,
  },
  render: function WithMockedUploadFileUpload(args) {
    const [files, setFiles] = useState<File | File[] | null>(null);

    return (
      <FileUploadInline
        {...args}
        value={files}
        onChange={setFiles}
        onUpload={handleUpload}
      />
    );
  },
};

export const MultipleFiles: Story = {
  args: {
    buttonText: 'Browse files',
    showIcon: true,
    showClear: true,
    multiple: true,
  },
  render: function MultipleFilesUpload(args) {
    const [files, setFiles] = useState<File | File[] | null>(null);

    return (
      <FileUploadInline
        {...args}
        value={files}
        onChange={setFiles}
        onUpload={handleUpload}
      />
    );
  },
};

export const WithUploadError: Story = {
  args: {
    buttonText: 'Upload file',
    showIcon: true,
    showClear: true,
  },
  render: function WithUploadErrorFileUpload(args) {
    const [files, setFiles] = useState<File | File[] | null>(null);

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
        value={files}
        onChange={setFiles}
        onUpload={handleUploadWithError}
      />
    );
  },
};
