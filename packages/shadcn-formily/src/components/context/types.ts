import type {
  DialogContentProps,
  IconProvider,
  PopoverContentProps,
  RichTextEditorProps,
} from '@pixpilot/shadcn-ui';
import type { FormSpace } from '../../types/form';
import type { ActionItem } from '../array-base';
import type { FormFileUploadOptions } from '../file-upload';
import type { FormItemDescriptionProps, FormItemLabelProps } from '../form-item';

export interface FomFileUpload {
  onUpload?: (files: File[], options: FormFileUploadOptions) => void;
  maxSize?: number;
}

export interface FormSettings {
  label?: {
    // Whether to use field name as label if title is not provided
    useFieldNameAsLabel?: boolean;
  };
  iconPicker?: {
    /**
     * Icon providers - can be static providers or async loader functions
     * Users can provide either IconProvider[] or AsyncIconProvider[]
     */
    providers: IconProvider[];
    /**
     * Optional callback when providers are loaded
     */
    onProvidersLoaded?: (providers: IconProvider[]) => void;
  };
  fileUpload?: FomFileUpload;
  richTextEditor?: RichTextEditorProps;

  /**
   * Global defaults for Array components.
   * Component-level props (e.g. x-component-props) still override these values.
   */
  array?: {
    sortable?: boolean;
    item?: {
      /** Extra icon actions rendered in each array item header */
      actions?: ActionItem[] | false;
    };
  };

  dialog?: DialogContentProps & { autoSave?: boolean };

  popover?: PopoverContentProps & { autoSave?: boolean };
}

/**
 * Layout configuration options for form components.
 * Groups all visual and layout-related settings.
 */
export interface FormLayoutOptions {
  /** Form density - affects spacing between elements */
  density?: FormSpace['density'];
  /** Custom props for FormItem elements */
  itemProps?: {
    label?: FormItemLabelProps;
    description?: FormItemDescriptionProps;
    inputWrapper?: React.HTMLAttributes<HTMLDivElement>;
    error?: React.HTMLAttributes<HTMLParagraphElement>;
    container?: React.HTMLAttributes<HTMLDivElement>;
  };
  /** Custom class names for ObjectContainer elements */
  objectContainer?: {
    /** Default visual style variant for ObjectContainer */
    variant?: 'grouped' | 'flat';
    card?: React.HTMLAttributes<HTMLDivElement>;
    header?: React.HTMLAttributes<HTMLDivElement>;
    title?: React.HTMLAttributes<HTMLDivElement>;
    description?: React.HTMLAttributes<HTMLDivElement>;
    content?: React.HTMLAttributes<HTMLDivElement>;
  };
}
