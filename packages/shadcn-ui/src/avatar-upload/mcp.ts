import type { ComponentMeta, DocumentedProps } from '@internal/mcp';
import type { AvatarUploadProps } from './AvatarUpload';
import { defineProps } from '@internal/mcp';

// Derive the documented prop set from the component's own props type so that
// adding a prop to `AvatarUploadProps` is a compile error until it is documented
// here. `AvatarUploadProps` extends the FileUpload base, which itself extends the
// native `div` props, so subtract the native `div` surface. `onChange` is a
// native `div` event name that this component redefines as the file-change
// callback, so re-add it explicitly via the extra-props parameter.
type AvatarUploadOwnProps = DocumentedProps<AvatarUploadProps, 'div', 'onChange'>;

export const meta: ComponentMeta<AvatarUploadOwnProps> = {
  name: 'AvatarUpload',
  category: 'Forms',
  description:
    'A single-image avatar uploader with a circular dropzone, preview, and optional clear button, built on the FileUpload component.',
  props: defineProps<AvatarUploadOwnProps>({
    value:
      'Controlled single-file metadata for the current avatar (null/empty when none).',
    onChange: 'Called with the new file metadata, or null when the avatar is cleared.',
    onAccept: 'Called with the accepted File(s) when a new image is selected.',
    messages:
      'Overrides the dropzone labels, e.g. `{ upload: "Upload", change: "Change" }`.',
    size: {
      description: 'Controls the avatar and dropzone sizing.',
      type: '"sm" | "md" | "lg"',
      defaultValue: '"md"',
    },
    clearable: {
      description: 'Shows a small × button to clear the avatar when an image is present.',
      type: 'boolean',
      defaultValue: 'true',
    },
    onValueChange:
      'Low-level callback fired with the raw `File[]` whenever the underlying upload value changes.',
    onFileAccept:
      'Called for each individual file that passes validation and is accepted.',
    onFileReject:
      'Called when a single file is rejected, with the file and a reason message.',
    onFilesReject:
      'Called when multiple files are rejected at once, with each file and its reason.',
    onFileValidate:
      'Custom per-file validator; return an error message string to reject the file, or null/undefined to accept it.',
    transformFile:
      'Optional async transform applied to each accepted file before it enters the store (e.g. EXIF stripping); return the same file or a replacement File.',
    onUpload:
      'Async upload handler invoked with the accepted files and progress/success/error callbacks.',
    accept: {
      description:
        'Accepted file types as a native input `accept` string, e.g. "image/*".',
      type: 'string',
    },
    maxFiles: {
      description: 'Maximum number of files allowed.',
      type: 'number',
    },
    maxSize: {
      description: 'Maximum size per file, in bytes.',
      type: 'number',
    },
    name: 'Form field name submitted with native form integration.',
    label: 'Accessible label for the upload control.',
    asChild: {
      description:
        'Merge behavior and props onto the child element instead of rendering the default wrapper.',
      type: 'boolean',
      defaultValue: 'false',
    },
    disabled: {
      description: 'Disables the uploader and its dropzone interactions.',
      type: 'boolean',
      defaultValue: 'false',
    },
    invalid: {
      description: 'Marks the control as invalid for styling and accessibility.',
      type: 'boolean',
      defaultValue: 'false',
    },
    required: {
      description: 'Marks the field as required for form submission.',
      type: 'boolean',
      defaultValue: 'false',
    },
    preventDuplicates: {
      description: 'Skips files that duplicate ones already present in the list.',
      type: 'boolean',
    },
    onFileSuccess:
      'Called with the file metadata after a file is successfully processed or uploaded.',
    onFileError:
      'Called with the file and an error message when processing or upload fails.',
  }),
  examples: [
    {
      title: 'Avatar uploader',
      code: '<AvatarUpload value={avatar} onChange={setAvatar} size="lg" />',
    },
  ],
  related: ['FileUpload'],
  keywords: ['avatar', 'upload', 'image', 'profile', 'form'],
};
