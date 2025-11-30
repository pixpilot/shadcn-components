import { createSchemaField } from '@formily/react';
import { ArrayCards } from './array-cards';
import { ArrayCollapse } from './array-collapse';
import { ArrayDialog } from './array-dialog';
import { ArrayPopover } from './array-popover';
import { Checkbox } from './checkbox';
import { Column } from './column';
import { Combobox } from './combobox';
import { DatePicker } from './date-picker';
import { FormGrid } from './form-grid';
import { FormItem } from './form-item';
import { Input } from './input';
import { NumberInput } from './number-input';
import { ConnectedRadio as Radio } from './radio';
import { Row } from './row';
import { Select } from './select';
import { Separator } from './separator';
import { Slider } from './slider';
import { Switch } from './switch';
import { Textarea } from './textarea';

/**
 * SchemaField with all Shadcn Formily components pre-registered
 * Use this to render forms from JSON Schema
 */
export const SchemaField = createSchemaField({
  components: {
    FormItem,
    FormGrid,
    Row,
    Column,
    Input,
    Textarea,
    Checkbox,
    Radio,
    Select,
    NumberInput,
    DatePicker,
    Combobox,
    Separator,
    Slider,
    Switch,
    ArrayCards,
    ArrayDialog,
    ArrayCollapse,
    ArrayPopover,
  },
});

export default SchemaField;
