import type { ComponentMeta, DocumentedProps } from '@internal/mcp';
import type { FileUploadInlineProps } from './types';
import { defineProps } from '@internal/mcp';

// Derive the documented prop set from the component's own props type so that
// adding a prop to `FileUploadInlineProps` is a compile error until it is
// documented here. The props extend the FileUpload base, which extends the
// native `div` props, so subtract the native `div` surface. `onChange` is a
// native `div` event name that this component redefines as the file-change
// callback, and `children` is a native `div` prop the base documents as a custom
// trigger, so re-add both via the extra-props parameter.
type FileUploadInlineDocumentedProps = DocumentedProps<
  FileUploadInlineProps,
  'div',
  'onChange' | 'children'
>;

export const meta: ComponentMeta<FileUploadInlineDocumentedProps> = {
  name: 'FileUploadInline',
  category: 'Forms',
  description:
    'A compact inline file upload rendered as a button with an optional icon and selected-file list, built on FileUploadRoot.',
  props: defineProps<FileUploadInlineDocumentedProps>({
    buttonText: {
      description: 'Label shown on the upload button when no file is selected.',
      type: 'string',
    },
    showIcon: {
      description: 'Shows a file icon on the upload button.',
      type: 'boolean',
    },
    children: 'Optional custom trigger content rendered inside the upload root.',
    slots:
      'Props for the internal parts: `trigger` (button), `dropzone` (div), and `fileItem`.',
    value:
      'Controlled file metadata value (array in multiple mode, single item/null otherwise).',
    onChange: 'Called with the new file metadata when the selection changes.',
    multiple: {
      description: 'Whether multiple files can be selected.',
      type: 'boolean',
    },
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
    disabled: {
      description: 'Disables the uploader and its dropzone interactions.',
      type: 'boolean',
      defaultValue: 'false',
    },
    onValueChange:
      'Low-level callback fired with the raw `File[]` whenever the underlying upload value changes.',
    onAccept: 'Called with the accepted File(s) when files are selected.',
    onFileAccept:
      'Called for each individual file that passes validation and is accepted.',
    onFileReject:
      'Called when a single file is rejected, with the file and a reason message.',
    onFilesReject:
      'Called when multiple files are rejected at once, with each file and its reason.',
    onFileValidate:
      'Custom per-file validator; return an error message string to reject the file, or null/undefined to accept it.',
    transformFile:
      'Optional async transform applied to each accepted file before it enters the store; return the same file or a replacement File.',
    onUpload:
      'Async upload handler invoked with the accepted files and progress/success/error callbacks.',
    name: 'Form field name submitted with native form integration.',
    label: 'Accessible label for the upload control.',
    asChild: {
      description:
        'Merge behavior and props onto the child element instead of rendering the default wrapper.',
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
      title: 'Inline upload',
      code: '<FileUploadInline buttonText="Attach file" value={files} onChange={setFiles} />',
    },
  ],
  related: ['FileUpload', 'FileUploadRoot'],
  keywords: ['file', 'upload', 'inline', 'button', 'form'],
};
