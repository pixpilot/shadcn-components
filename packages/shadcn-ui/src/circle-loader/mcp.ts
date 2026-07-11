import type { ComponentMeta } from '@internal/mcp';
import type { CircleLoaderProps } from './circle-loader';
import { defineProps } from '@internal/mcp';

type CircleLoaderOwnProps = Extract<keyof CircleLoaderProps, string>;

export const meta: ComponentMeta<CircleLoaderOwnProps> = {
  name: 'CircleLoader',
  category: 'Feedback',
  description:
    'An animated circular spinner with configurable size, stroke width, speed, and single- or multi-color animation.',
  props: defineProps<CircleLoaderOwnProps>({
    size: {
      description:
        'Spinner size as a preset key or a pixel number. Presets: sm (24), md (40), lg (64), xl (96).',
      type: '"sm" | "md" | "lg" | "xl" | number',
      defaultValue: '"md"',
    },
    strokeWidth: {
      description:
        'Stroke width in pixels. Defaults to 10% of the size (minimum 2px) when omitted.',
      type: 'number',
    },
    speed: {
      description: 'Rotation animation duration in seconds.',
      type: 'number',
      defaultValue: '2',
    },
    color: {
      description:
        'Single spinner color. Use "currentColor" to inherit the parent text color.',
      type: 'string',
      defaultValue: '"currentColor"',
    },
    colors:
      'Array of colors for a color-cycling animation. When provided, overrides `color`.',
    className: 'Additional CSS class applied to the loader wrapper.',
  }),
  examples: [
    {
      title: 'Default spinner',
      code: '<CircleLoader />',
    },
    {
      title: 'Large multi-color spinner',
      code: '<CircleLoader size="lg" colors={["#ef4444", "#3b82f6", "#22c55e"]} speed={1.5} />',
    },
  ],
  keywords: ['loader', 'spinner', 'loading', 'progress', 'feedback'],
};
