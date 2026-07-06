import type { ComponentMeta, DocumentedProps } from '@internal/mcp';
import type { FileUploadProps } from './types';
import { defineProps } from '@internal/mcp';

type FileUploadOwnProps = DocumentedProps<FileUploadProps, 'div', 'onChange'>;

export const meta: ComponentMeta<FileUploadOwnProps> = {
  name: 'FileUpload',
  category: 'Forms',
  description:
    'A managed file upload field that stores file metadata, handles duplicate prevention, and renders accepted files with progress/error callbacks.',
  htmlElement: 'div',
  props: defineProps<FileUploadOwnProps>({
    accept:
      'Comma-separated MIME types or file extensions accepted by the hidden file input.',
    asChild: 'Render the root upload behavior through a child element instead of a div.',
    disabled: 'Disables upload interactions.',
    invalid: 'Marks the upload root as invalid for styling and accessibility.',
    label: 'Accessible label for the hidden file input.',
    maxFiles: 'Maximum number of files allowed in the upload list.',
    maxSize: 'Maximum accepted file size in bytes.',
    multiple: {
      description:
        'When true, the component accepts and returns an array of file metadata. When false, it accepts and returns a single file metadata object or null.',
      type: 'boolean',
      defaultValue: 'true',
    },
    name: 'Name applied to the hidden file input.',
    onAccept:
      'Called with accepted File objects before they are converted into component metadata.',
    onChange:
      'Called with FileMetadata[] in multiple mode, or FileMetadata | null in single-file mode.',
    onFileAccept: 'Called by the underlying upload root for each accepted File.',
    onFileError: 'Called when an upload item reports an error.',
    onFileReject: 'Called when a File is rejected with a validation message.',
    onFileSuccess: 'Called when an upload item reports successful completion.',
    onFileValidate:
      'Custom validation hook that returns a rejection message for invalid files.',
    onFilesReject:
      'Called with every rejected File and rejection message from a selection.',
    onUpload: 'Optional upload handler with progress, success, and error callbacks.',
    onValueChange: 'Called by the underlying upload root when its File[] value changes.',
    preventDuplicates: 'When true, skips files already represented in the current value.',
    required: 'Marks the hidden file input as required.',
    transformFile:
      'Optional transform applied to each accepted File before it enters the upload store.',
    value:
      'Controlled FileMetadata value. Use an array in multiple mode or a single item/null in single-file mode.',
  }),
  examples: [
    {
      title: 'Multiple files',
      code: '<FileUpload multiple value={files} onChange={setFiles} maxFiles={10} maxSize={5 * 1024 * 1024} />',
    },
    {
      title: 'Single file',
      code: '<FileUpload value={file} onChange={setFile} multiple={false} accept="image/*" />',
    },
  ],
  keywords: ['file', 'upload', 'form'],
};
