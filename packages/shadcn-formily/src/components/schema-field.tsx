import { createSchemaField } from '@formily/react';
import { TagsInput } from '@pixpilot/shadcn-ui';
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
import { Hidden } from './hidden';
import { Input } from './input';
import { NumberInput } from './number-input';
import { ObjectContainer } from './object-container';
import { ConnectedRadio as Radio } from './radio';
import { Row } from './row';
import { Select } from './select';
import { Separator } from './separator';
import { Slider } from './slider';
import { Switch } from './switch';
import { Textarea } from './textarea';

export const basicComponents = {
  FormItem,
  Hidden,
  Input,
  Textarea,
  NumberInput,
  Checkbox,
  Radio,
  Select,
  Switch,
  DatePicker,
  Row,
  Column,
  FormGrid,
  Combobox,
  TagsInput,
  Separator,
  Slider,
  ArrayCards,
  ArrayDialog,
  ArrayCollapse,
  ArrayPopover,
  ObjectContainer,
};

export const SchemaField = createSchemaField({
  components: basicComponents,
});
