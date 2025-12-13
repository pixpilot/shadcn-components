import type { Meta, StoryObj } from '@storybook/react';
import type { FileMetadata, FileUploadProgressCallBacks } from '../src/file-upload';
import { useState } from 'react';
import { FileUpload } from '../src/file-upload';
import { delay, handleUpload } from './utils/file-upload';

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
      <div style={{ width: 350 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FileUpload>;

export default meta;
type Story = StoryObj<typeof FileUpload>;

export const Default: Story = {
  args: {},
  render: function DefaultFileUpload(args) {
    return <FileUpload {...args} onUpload={handleUpload} />;
  },
};

/**
 * File upload with pre-selected file
 */
export const WithValue: Story = {
  args: {},
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
        <FileUpload
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

export const WithUploadError: Story = {
  args: {},
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
      <FileUpload
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
