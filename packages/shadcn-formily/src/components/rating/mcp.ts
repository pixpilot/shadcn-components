import type { ComponentMeta, OwnProps } from '@internal/mcp';
import type { RatingProps } from './Rating';
import { defineProps } from '@internal/mcp';

type RatingOwnProps = OwnProps<RatingProps, 'div'>;

export const meta: ComponentMeta<RatingOwnProps> = {
  name: 'Rating',
  category: 'Formily Inputs',
  description: 'A Formily-connected rating input for numeric score selection.',
  htmlElement: 'div',
  props: defineProps<RatingOwnProps>({
    value: 'Controlled value for the underlying field UI. Usually supplied by Formily.',
    required: 'Marks the control as required for accessibility and UI state.',
    disabled:
      'Disables user interaction. Usually also respects the Formily field disabled state.',
    readOnly:
      'Makes the control read-only. Usually also respects the Formily field read-only state.',
    options: 'Options supplied directly or resolved from schema enum/dataSource.',
    onValueChange: 'Controlled value-change callback. Usually supplied by Formily.',
    size: 'Size forwarded to the underlying UI component.',
    name: 'Forwarded to the underlying UI component.',
    max: 'Forwarded to the underlying UI component.',
    iconType: 'Forwarded to the underlying UI component.',
  }),
  examples: [
    {
      title: 'Declarative schema field',
      code: `<SchemaField.Number name="score" title="Score" x-decorator="FormItem" x-component="Rating" />`,
    },
    {
      title: 'JSON schema for form renderer',
      code: `{
  type: 'object',
  properties: {
    score: {
      type: 'number',
      title: 'Score',
      'x-decorator': 'FormItem',
      'x-component': 'Rating',
    },
  },
}`,
    },
  ],
  keywords: ['formily', 'rating', 'stars', 'score'],
};
