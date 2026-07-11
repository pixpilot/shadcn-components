import type { ComponentMeta, OwnProps } from '@internal/mcp';
import type { ScaledPreviewProps } from './ScaledPreview';
import { defineProps } from '@internal/mcp';

type ScaledPreviewOwnProps = OwnProps<ScaledPreviewProps, 'div'>;

export const meta: ComponentMeta<ScaledPreviewOwnProps> = {
  name: 'ScaledPreview',
  category: 'Layout',
  description:
    'Renders fixed-size content scaled to fit a smaller preview box, keeping the content centered — useful for thumbnails and design previews.',
  htmlElement: 'div',
  props: defineProps<ScaledPreviewOwnProps>({
    scaleFactor: {
      description:
        'Scale factor for the preview box relative to baseSize (e.g. 0.5 = 50%). Ignored when previewBoxSize is set.',
      type: 'number',
    },
    baseSize: {
      description: 'Intrinsic content dimensions being scaled.',
      type: '{ width: number; height: number }',
      defaultValue: '{ width: 1000, height: 1000 }',
    },
    previewBoxSize: {
      description: 'Explicit preview box size. When provided, overrides scaleFactor.',
      type: '{ width: number; height: number }',
    },
    padding: {
      description:
        'Padding in pixels that reduces the space available for the scaled content.',
      type: 'number',
      defaultValue: '0',
    },
    forceScale: {
      description:
        'Manual content scale override that bypasses the automatic fit calculation.',
      type: 'number',
    },
  }),
  examples: [
    {
      title: 'Half-scale preview',
      code: '<ScaledPreview scaleFactor={0.25} baseSize={{ width: 1080, height: 1080 }}>\n  {content}\n</ScaledPreview>',
    },
  ],
  keywords: ['preview', 'scale', 'thumbnail', 'zoom', 'layout'],
};
