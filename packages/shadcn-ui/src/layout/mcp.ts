import type { ComponentMeta, OwnProps } from '@internal/mcp';
import type { LayoutProps } from './Layout';
import { defineProps } from '@internal/mcp';

type LayoutOwnProps = OwnProps<LayoutProps, 'div'>;

export const meta: ComponentMeta<LayoutOwnProps> = {
  name: 'Layout',
  category: 'Layout',
  description:
    'A full-height flex column page shell that handles mobile browser chrome, composed with LayoutHeader, LayoutMain, and LayoutFooter.',
  htmlElement: 'div',
  props: defineProps<LayoutOwnProps>({
    as: {
      description: 'Element or component type to render as the layout container.',
      type: 'React.ElementType',
      defaultValue: '"div"',
    },
  }),
  notes: [
    'Compose with LayoutHeader, LayoutMain, and LayoutFooter for the standard app shell.',
  ],
  examples: [
    {
      title: 'App shell',
      code: '<Layout>\n  <LayoutHeader>{nav}</LayoutHeader>\n  <LayoutMain>{content}</LayoutMain>\n  <LayoutFooter>{footer}</LayoutFooter>\n</Layout>',
    },
  ],
  keywords: ['layout', 'shell', 'page', 'flex', 'container'],
};
