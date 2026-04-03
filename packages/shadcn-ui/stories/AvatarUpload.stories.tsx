import type { Meta, StoryObj } from '@storybook/react';
import type { AvatarUploadProps } from '../src/avatar-upload/AvatarUpload';
import type { FileMetadata, FileUploadProgressCallBacks } from '../src/file-upload/types';
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
    clearable: {
      control: 'boolean',
      description: 'Show the × button to clear the current avatar',
      defaultValue: true,
    },
  },
} satisfies Meta<typeof AvatarUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

function Uploader(args: AvatarUploadProps) {
  const [file, setFile] = useState<FileMetadata | null>(args.value ?? null);

  const handleSuccess = useCallback((fileMeta: FileMetadata) => {
    setFile(fileMeta);
  }, []);

  const handleChange = useCallback((fileMeta: FileMetadata | null) => {
    setFile(fileMeta);
  }, []);

  return (
    <div className="flex flex-col items-center space-y-4">
      <AvatarUpload
        {...args}
        value={file}
        onUpload={handleUpload}
        onFileSuccess={handleSuccess}
        onChange={handleChange}
      />
      {file != null && (
        <div>
          <p className="text-sm text-muted-foreground">Selected file: {file.name}</p>
          <p className="text-xs text-muted-foreground">
            {file.size} bytes, {file.type}
          </p>
        </div>
      )}
      {file == null && (
        <p className="text-xs text-muted-foreground italic">No avatar selected</p>
      )}
    </div>
  );
}

export const Default: Story = {
  args: {},
  render: Uploader,
};

export const ShowFileNameOnChange: Story = {
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

export const WithUploadSuccess: Story = {
  args: {},
  render: function WithUploadSuccessAvatarUpload(args) {
    const [successCount, setSuccessCount] = useState(0);
    const [lastSuccess, setLastSuccess] = useState<FileMetadata | null>(null);

    const handleSuccess = (fileMeta: FileMetadata) => {
      setSuccessCount((count) => count + 1);
      setLastSuccess(fileMeta);
    };

    return (
      <div className="flex flex-col items-center space-y-4">
        <AvatarUpload {...args} onUpload={handleUpload} onFileSuccess={handleSuccess} />
        <div>
          <p className="text-sm font-medium">
            onSuccess called: {successCount} {successCount === 1 ? 'time' : 'times'}
          </p>
          {lastSuccess != null && (
            <p className="text-xs text-muted-foreground">
              {lastSuccess.name}, {lastSuccess.size} bytes, {lastSuccess.type}
            </p>
          )}
        </div>
      </div>
    );
  },
};

export const WithUploadError: Story = {
  args: {},
  render: function WithUploadErrorFileUpload(args) {
    const [uploadError, setUploadError] = useState<string | null>(null);

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
      <div className="flex flex-col items-center space-y-4">
        <AvatarUpload
          {...args}
          value={null}
          onUpload={handleUploadWithError}
          onFileError={(_file, error) => {
            setUploadError(error);
          }}
        />
        {uploadError != null && (
          <p className="text-sm text-destructive">Error: {uploadError}</p>
        )}
      </div>
    );
  },
};

export const WithClearDisabled: Story = {
  args: {
    clearable: false,
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
