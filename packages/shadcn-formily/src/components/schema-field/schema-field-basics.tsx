import { createSchemaField } from '@formily/react';
import { ArrayCards } from '../array-cards';
import { ArrayCollapse } from '../array-collapse';
import { ArrayDialog } from '../array-dialog';
import { ArrayPopover } from '../array-popover';
import { Checkbox } from '../checkbox';
import { Column } from '../column';
import { DatePicker } from '../date-picker';
import { FormGrid } from '../form-grid';
import { FormItem } from '../form-item';
import { Hidden } from '../hidden';
import { Input } from '../input';
import { NumberInput } from '../number-input';
import { ObjectContainer } from '../object-container';
import { ConnectedRadio as Radio } from '../radio';
import { Row } from '../row';
import { Select } from '../select';
import { Separator } from '../separator';
import { Switch } from '../switch';
import { Textarea } from '../textarea';

export const schemaFieldBasicComponents = {
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
  Separator,
  ArrayCards,
  ArrayDialog,
  ArrayCollapse,
  ArrayPopover,
  ObjectContainer,
};

export const SchemaFieldBasics = createSchemaField({
  components: schemaFieldBasicComponents,
});
