import type { Meta, StoryObj } from '@storybook/react';
import type { FileMetadata, FileUploadProgressCallBacks } from '../src';
import type { AvatarUploadProps } from '../src/avatar-upload/AvatarUpload';
import { useCallback, useState } from 'react';
import { AvatarUpload } from '../src/avatar-upload/AvatarUpload';
import { delay, handleUpload } from './utils/file-upload';

/**
 * Alert component for displaying important messages to users.
 * Supports multiple variants for different message types.
 */
const meta = {
  title: 'shadcn-ui/AvatarUpload',
  component: AvatarUpload,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Size of the avatar upload component',
      defaultValue: 'md',
    },
    value: {
      control: 'object',
      description: 'The current avatar file or URL',
      defaultValue: null,
    },
  },
} satisfies Meta<typeof AvatarUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

function Uploader(args: AvatarUploadProps) {
  const [files, setFiles] = useState<FileMetadata | null>(null);

  const handleChange = useCallback((fileMeta: FileMetadata) => {
    setFiles(fileMeta);
  }, []);

  return (
    <div className="flex flex-col items-center space-y-4">
      <AvatarUpload {...args} onUpload={handleUpload} onChange={handleChange} />
      {files && (
        <div className="">
          <p className="text-sm text-muted-foreground">Uploaded file: {files.name}</p>
          <p className="text-xs text-muted-foreground">
            {files.size} bytes, {files.type}
          </p>
        </div>
      )}
    </div>
  );
}

export const Default: Story = {
  args: {},
  render: Uploader,
};

export const WithImage: Story = {
  args: {
    value: {
      name: 'avatar.png',
      size: 1024,
      type: 'image/png',
      url: `${window.location.origin}/avatar.png`,
      lastModified: 1625247600000,
    },
  },
  render: Uploader,
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

    return <AvatarUpload {...args} value={null} onUpload={handleUploadWithError} />;
  },
};
