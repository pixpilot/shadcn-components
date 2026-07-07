import type { ComponentMeta, OwnProps } from '@internal/mcp';
import type { FileUploadProps } from './FileUpload';
import { defineProps } from '@internal/mcp';

type FileUploadOwnProps = OwnProps<FileUploadProps, 'div'>;

export const meta: ComponentMeta<FileUploadOwnProps> = {
  name: 'FileUpload',
  category: 'Formily Inputs',
  description:
    'A Formily-connected file upload field with upload feedback and schema value mapping.',
  htmlElement: 'div',
  props: defineProps<FileUploadOwnProps>({
    onValueChange: 'Controlled value-change callback. Usually supplied by Formily.',
    label: 'Label content or accessible label for the component.',
    asChild: 'Renders behavior through the child element instead of the default element.',
    value: 'Controlled value. Usually supplied by Formily.',
    name: 'HTML/form name forwarded to the underlying control.',
    disabled:
      'Disables user interaction. Usually also respects the Formily field disabled state.',
    required: 'Marks the control as required for accessibility and UI state.',
    invalid: 'Forwarded to the underlying UI component.',
    accept: 'Accepted file MIME types or extensions.',
    multiple: 'Allows selecting multiple files.',
    onAccept: 'Forwarded to the underlying UI component.',
    onFileAccept: 'Forwarded to the underlying UI component.',
    onFileReject: 'Forwarded to the underlying UI component.',
    onFilesReject: 'Forwarded to the underlying UI component.',
    onFileValidate: 'Forwarded to the underlying UI component.',
    transformFile: 'Forwarded to the underlying UI component.',
    onUpload: 'Forwarded to the underlying UI component.',
    maxFiles: 'Maximum number of files allowed.',
    maxSize: 'Maximum file size allowed.',
    preventDuplicates: 'Forwarded to the underlying UI component.',
    onFileSuccess: 'Forwarded to the underlying UI component.',
    onFileError: 'Forwarded to the underlying UI component.',
    mapValue: 'Maps uploaded file values between Formily and the upload component.',
  }),
  examples: [
    {
      title: 'Declarative schema field',
      code: `<SchemaField.Array name="files" title="Files" x-decorator="FormItem" x-component="FileUpload" />`,
    },
    {
      title: 'JSON schema for form renderer',
      code: `{
  type: 'object',
  properties: {
    files: {
      type: 'array',
      title: 'Files',
      'x-decorator': 'FormItem',
      'x-component': 'FileUpload',
      items: { type: 'object' },
    },
  },
}`,
    },
  ],
  keywords: ['formily', 'file', 'upload', 'attachments'],
  related: ['AvatarUpload', 'FileUploadInline'],
};
