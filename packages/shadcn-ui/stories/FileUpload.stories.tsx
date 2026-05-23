import type { Meta, StoryObj } from '@storybook/react';
import type { FileMetadata, FileUploadProgressCallBacks } from '../src/file-upload/types';
import { useState } from 'react';
import { FileUpload } from '../src/file-upload';
import { delay, handleUpload } from './utils/file-upload';

interface StoryArgs {
  disabled?: boolean;
  id?: string;
}

const meta = {
  title: 'shadcn-ui/FileUpload',
  component: FileUpload,
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
      <div id="file-upload-div-1" style={{ width: 350 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: function DefaultFileUpload(args: StoryArgs) {
    return <FileUpload {...args} multiple={false} value={null} onUpload={handleUpload} />;
  },
};

/**
 * File upload with pre-selected file
 */
export const WithValue: Story = {
  args: {},
  render: function WithValueFileUpload(args: StoryArgs) {
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
        <FileUpload
          {...args}
          value={files}
          multiple={true}
          onChange={handleChange}
          onUpload={handleUpload}
        />
        <div id="file-upload-div-2" style={{ marginTop: 12 }}>
          <div id="file-upload-div-3" style={{ fontWeight: 'bold', marginBottom: 4 }}>
            onChange called: {changeCount} {changeCount === 1 ? 'time' : 'times'}
          </div>
          <pre id="file-upload-pre-1">
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
 * File upload with success callback tracking
 */
export const WithUploadSuccess: Story = {
  args: {},
  render: function WithUploadSuccessFileUpload(args: StoryArgs) {
    const [successCount, setSuccessCount] = useState(0);
    const [lastSuccess, setLastSuccess] = useState<FileMetadata | null>(null);

    const handleSuccess = (fileMeta: FileMetadata) => {
      setSuccessCount((count) => count + 1);
      setLastSuccess(fileMeta);
    };

    return (
      <>
        <FileUpload
          disabled={args.disabled}
          multiple={true}
          onUpload={handleUpload}
          onFileSuccess={handleSuccess}
        />
        <div id="file-upload-div-4" style={{ marginTop: 12 }}>
          <div id="file-upload-div-5" style={{ fontWeight: 'bold', marginBottom: 4 }}>
            onSuccess called: {successCount} {successCount === 1 ? 'time' : 'times'}
          </div>
          {lastSuccess != null && (
            <pre id="file-upload-pre-2">
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
  render: function WithUploadErrorFileUpload(args: StoryArgs) {
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
      <FileUpload
        {...args}
        value={null}
        multiple={false}
        onUpload={handleUploadWithError}
        onChange={(_file: FileMetadata | null) => {
          // handle single file change
        }}
      />
    );
  },
};
