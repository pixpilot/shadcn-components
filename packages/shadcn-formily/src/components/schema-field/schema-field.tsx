import type { FormComponentConfig } from '../../types/form';

import { createSchemaField } from '@formily/react';
import { TagsInput } from '@pixpilot/shadcn-ui';
import { extractComponents } from '../../utils/extract-components';
import { Combobox } from '../combobox';
import { Slider } from '../slider';
import { TagsInputInLine } from '../tags-input-inline';
import { basicComponentRegistry } from './schema-field-basics';

export const defaultComponentRegistry = {
  ...basicComponentRegistry,
  Combobox: { component: Combobox, decorator: 'FormItem' },
  TagsInput: { component: TagsInput, decorator: 'FormItem' },
  TagsInputInLine: { component: TagsInputInLine, decorator: 'FormItem' },
  Slider: { component: Slider, decorator: 'FormItem' },
} satisfies Record<string, FormComponentConfig>;

export const defaultComponents = extractComponents(defaultComponentRegistry);

export const SchemaField = createSchemaField({
  components: defaultComponents,
});
