import type { ISchema } from '@formily/react';
import type { FormComponentConfig } from '../../types/form';
import type { JsonSchemaFormComponents } from '../json-schema-form-renderer';
import { createSchemaField } from '@formily/react';
import { useFormSchema } from '../../hooks/use-form-schema';
import { useMergedSchemaComponents } from '../../hooks/use-merged-schema-components';
import { extractComponents } from '../../utils/extract-components';
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
import { IconToggle } from '../icon-toggle';
import { Input } from '../input';
import { NumberInput } from '../number';
import { ObjectContainer } from '../object-container';
import { ConnectedRadio as Radio } from '../radio';
import { Row } from '../row';
import { Select } from '../select';
import { Separator } from '../separator';
import { Switch } from '../switch';
import { Textarea } from '../textarea';

export const basicComponentRegistry = {
  ArrayCards: { component: ArrayCards, decorator: 'FormItem' },
  ArrayCollapse: { component: ArrayCollapse, decorator: 'FormItem' },
  ArrayDialog: { component: ArrayDialog, decorator: 'FormItem' },
  ArrayPopover: { component: ArrayPopover, decorator: 'FormItem' },
  Checkbox: { component: Checkbox, decorator: 'FormItem' },
  Column: { component: Column },
  DatePicker: { component: DatePicker, decorator: 'FormItem' },
  FormGrid: { component: FormGrid },
  FormItem: { component: FormItem },
  Hidden: { component: Hidden },
  IconToggle: { component: IconToggle, decorator: 'FormItem' },
  Input: { component: Input, decorator: 'FormItem' },
  NumberInput: { component: NumberInput, decorator: 'FormItem' },
  ObjectContainer: { component: ObjectContainer, decorator: 'FormItem' },
  Radio: { component: Radio, decorator: 'FormItem' },
  Row: { component: Row },
  Select: { component: Select, decorator: 'FormItem' },
  Separator: { component: Separator },
  Switch: { component: Switch, decorator: 'FormItem' },
  Textarea: { component: Textarea, decorator: 'FormItem' },
} satisfies Record<string, FormComponentConfig>;

export const basicComponents = extractComponents(basicComponentRegistry);

export const SchemaFieldBasics = createSchemaField({
  components: basicComponents,
});

type SchemaFieldBasicsProps = Omit<
  React.ComponentProps<typeof SchemaFieldBasics>,
  'components'
> & {
  components?: JsonSchemaFormComponents;
  schema: ISchema;
};

const JsonSchemaFieldBasics: React.FC<SchemaFieldBasicsProps> = (props) => {
  const { components, schema, ...rest } = props;

  // Merge basicComponentRegistry with user-provided components
  // User components will override basic components with the same key
  const mergedComponents = useMergedSchemaComponents(basicComponentRegistry, components);

  const { formSchema, SchemaField } = useFormSchema(schema, mergedComponents);

  return <SchemaField {...rest} schema={formSchema} />;
};

JsonSchemaFieldBasics.displayName = 'JsonSchemaFieldBasics';

export { JsonSchemaFieldBasics };
