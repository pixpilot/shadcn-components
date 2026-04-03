import type { Meta, StoryObj } from '@storybook/react';
import type { FileMetadata } from '../src/file-upload/types';
import { useState } from 'react';
import { Button } from '../src';
import { FileUploadRoot } from '../src/file-upload-root/FileUploadRoot';
import { delay, handleUpload } from './utils/file-upload';

const meta = {
  title: 'shadcn-ui/FileUploadRoot',
  component: FileUploadRoot,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 420 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FileUploadRoot>;

export default meta;
type Story = StoryObj<typeof FileUploadRoot>;

export const Default: Story = {
  args: {},
  render: function DefaultFileUpload(args) {
    return (
      <FileUploadRoot {...args} onUpload={handleUpload}>
        <Button size="sm">Upload file</Button>
      </FileUploadRoot>
    );
  },
};

export const WithValue: Story = {
  args: {},
  render: function WithValueFileUpload(args) {
    const [files, setFiles] = useState<FileMetadata[]>([
      {
        name: 'document.pdf',
        size: 1024 * 45,
        type: 'application/pdf',
        url: `${window.location.origin}/document.pdf`,
        lastModified: 1625247600000,
      },
    ]);

    const handleChange = (newFiles: FileMetadata[]) => {
      setFiles(newFiles);
    };

    return (
      <FileUploadRoot
        {...args}
        value={files}
        multiple={true}
        onChange={handleChange}
        onUpload={handleUpload}
      >
        <Button size="sm">Choose files</Button>
      </FileUploadRoot>
    );
  },
};

export const WithUploadSuccess: Story = {
  args: {},
  render: function WithUploadSuccessFileUpload(args) {
    const [successCount, setSuccessCount] = useState(0);
    const [lastSuccess, setLastSuccess] = useState<FileMetadata | null>(null);

    const handleSuccess = (fileMeta: FileMetadata) => {
      setSuccessCount((count) => count + 1);
      setLastSuccess(fileMeta);
    };

    return (
      <>
        <FileUploadRoot
          disabled={args.disabled}
          multiple={true}
          onUpload={handleUpload}
          onFileSuccess={handleSuccess}
        >
          <Button size="sm">Upload file</Button>
        </FileUploadRoot>
        <div style={{ marginTop: 12 }}>
          <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
            onSuccess called: {successCount} {successCount === 1 ? 'time' : 'times'}
          </div>
          {lastSuccess != null && (
            <pre>
              {JSON.stringify(
                {
                  name: lastSuccess.name,
                  size: lastSuccess.size,
                  type: lastSuccess.type,
                },
                null,
                2,
              )}
            </pre>
          )}
        </div>
      </>
    );
  },
};

export const WithUploadError: Story = {
  args: {},
  render: function WithUploadErrorFileUpload(args) {
    const [uploadError, setUploadError] = useState<string | null>(null);

    async function handleUploadWithError(
      uploadFiles: File[],
      options: {
        onProgress: (f: File, p: number) => void;
        onError: (f: File, e: Error) => void;
      },
    ) {
      for (const uploadFile of uploadFiles) {
        // eslint-disable-next-line no-await-in-loop
        await delay(500);
        options.onProgress(uploadFile, 0);
        options.onError(uploadFile, new Error('Upload failed due to network error.'));
      }
    }

    return (
      <div>
        <FileUploadRoot
          disabled={args.disabled}
          multiple={false}
          onUpload={handleUploadWithError}
          onFileError={(_file, error) => {
            setUploadError(error);
          }}
        >
          <Button size="sm">Upload file</Button>
        </FileUploadRoot>
        {uploadError != null && (
          <p className="mt-2 text-sm text-destructive">Error: {uploadError}</p>
        )}
      </div>
    );
  },
};
