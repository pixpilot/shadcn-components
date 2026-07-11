import type { ComponentMeta, DocumentedProps } from '@internal/mcp';
import type React from 'react';
import type { Tabs } from './Tabs';
import { defineProps } from '@internal/mcp';

// Derive the documented prop set from the re-exported Radix Tabs root so that a
// new forwarded prop is a compile error until it is documented here. The Radix
// props extend the native `div` props, so subtract that native surface.
// `defaultValue` is a native attribute name that Radix redefines as the initial
// tab, so re-add it via the extra-props parameter.
type TabsRootProps = React.ComponentProps<typeof Tabs>;
type TabsDocumentedProps = DocumentedProps<TabsRootProps, 'div', 'defaultValue'>;

export const meta: ComponentMeta<TabsDocumentedProps> = {
  name: 'Tabs',
  category: 'Navigation',
  description:
    'A tabbed navigation container composed with TabsList, TabsTrigger, and TabsContent. TabsList adds an "underline" variant on top of the shadcn variants.',
  props: defineProps<TabsDocumentedProps>({
    value: {
      description: 'Controlled active tab value.',
      type: 'string',
    },
    defaultValue: {
      description: 'Initial active tab value when uncontrolled.',
      type: 'string',
    },
    onValueChange: {
      description: 'Called with the newly selected tab value.',
      type: '(value: string) => void',
    },
    orientation: {
      description: 'Tab orientation.',
      type: '"horizontal" | "vertical"',
      defaultValue: '"horizontal"',
    },
    activationMode: {
      description:
        'Whether a tab activates automatically on focus or manually on click/Enter.',
      type: '"automatic" | "manual"',
      defaultValue: '"automatic"',
    },
    asChild: {
      description:
        'Merge behavior and styles onto the child element instead of the default wrapper.',
      type: 'boolean',
      defaultValue: 'false',
    },
  }),
  notes: [
    'TabsList accepts a `variant` of "default" | "underline" | "outline" | "ghost" | "pill".',
  ],
  examples: [
    {
      title: 'Underline tabs',
      code: '<Tabs defaultValue="a">\n  <TabsList variant="underline">\n    <TabsTrigger value="a">A</TabsTrigger>\n    <TabsTrigger value="b">B</TabsTrigger>\n  </TabsList>\n  <TabsContent value="a">First</TabsContent>\n  <TabsContent value="b">Second</TabsContent>\n</Tabs>',
    },
  ],
  keywords: ['tabs', 'navigation', 'panels', 'segmented'],
};
