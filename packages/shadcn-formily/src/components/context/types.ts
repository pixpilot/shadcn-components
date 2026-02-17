import type {
  FileUploadProgressCallBacks,
  IconProvider,
  RichTextEditorProps,
} from '@pixpilot/shadcn-ui';
import type { FormSpace } from '../../types/form';
import type { DescriptionPlacement, LabelPlacement } from '../../types/form-item';
import type { ActionItem } from '../array-base';

export interface FomFileUpload {
  onUpload?: (files: File[], options: FileUploadProgressCallBacks) => void;
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
}

/**
 * Layout configuration options for form components.
 * Groups all visual and layout-related settings.
 */
export interface FormLayoutOptions {
  /** Form density - affects spacing between elements */
  density?: FormSpace['density'];
  /** Default description placement for FormItem decorators */
  descriptionPlacement?: DescriptionPlacement;
  /** Default label placement for FormItem decorators */
  labelPlacement?: LabelPlacement;
  /** Custom class names for FormItem elements */
  itemProps?: {
    label?: React.LabelHTMLAttributes<HTMLLabelElement>;
    description?: React.HTMLAttributes<HTMLParagraphElement>;
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
