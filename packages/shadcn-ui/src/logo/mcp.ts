import type { ComponentMeta, DocumentedProps } from '@internal/mcp';
import type { BrandLogoProps } from './Logo';
import { defineProps } from '@internal/mcp';

// `BrandLogo` is the documented entry point; `Logo` is covered in the notes.
// `name` is stripped by OwnProps because it is also a native attribute, so it
// is re-added explicitly since BrandLogo uses it as the brand text.
type BrandLogoDocumentedProps = DocumentedProps<BrandLogoProps, 'span', 'name'>;

export const meta: ComponentMeta<BrandLogoDocumentedProps> = {
  name: 'BrandLogo',
  category: 'Layout',
  htmlElement: 'span',
  description:
    'The app icon with the brand name beside it. Use it (or the bare `Logo` icon) wherever the brand appears so it looks the same everywhere; change `size` per place rather than adding another logo component.',
  props: defineProps<BrandLogoDocumentedProps>({
    name: {
      description: 'The brand name shown next to the icon, usually the app name.',
      type: 'ReactNode',
    },
    size: {
      description: "The icon's edge in pixels; scale the text with `className`.",
      type: 'number',
      defaultValue: '24',
    },
    logoProps:
      'Props passed to the inner `Logo` icon (except `size`), e.g. its `src` in a Chrome extension.',
  }),
  notes: [
    '`Logo` renders just the square icon: `<Logo size={20} />`. It accepts every `<img>` prop except `alt`, defaults `src` to `/favicon.svg`, and is decorative (`alt=""`, `aria-hidden`).',
    'A plain `<img>`, not `next/image`, so it works in Next.js apps, Chrome extensions and other React hosts alike.',
    'Wrap `BrandLogo` in a link where it navigates; the brand name gives the link its accessible name.',
  ],
  examples: [
    {
      title: 'Brand logo in a header',
      code: '<BrandLogo name="Acme" size={32} className="text-2xl" />',
    },
    {
      title: 'Icon only, e.g. a sidebar',
      code: '<Logo size={20} />',
    },
    {
      title: 'Icon served from another path',
      code: '<BrandLogo name="Acme" logoProps={{ src: "/icons/icon.svg" }} />',
    },
  ],
  related: ['Logo'],
  keywords: ['logo', 'brand', 'icon', 'favicon', 'header', 'app name'],
};
