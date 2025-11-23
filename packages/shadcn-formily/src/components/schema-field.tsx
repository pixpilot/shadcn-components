import { createSchemaField } from '@formily/react';
import { ArrayItems, ArrayItemsAccordion, ArrayItemsPopover } from './array-list';
import { Checkbox } from './checkbox';
import { FormGrid } from './form-grid';
import { FormItem } from './form-item';
import { Input } from './input';
import { NumberInput } from './number-input';
import { ConnectedRadio as Radio } from './radio';
import { Select } from './select';
import { Textarea } from './textarea';

/**
 * SchemaField with all Shadcn Formily components pre-registered
 * Use this to render forms from JSON Schema
 */
export const SchemaField = createSchemaField({
  components: {
    FormItem,
    FormGrid,
    Input,
    Textarea,
    Checkbox,
    Radio,
    Select,
    NumberInput,
    ArrayItems,
    ArrayItemsAccordion,
    ArrayItemsPopover,
  },
});

export default SchemaField;
