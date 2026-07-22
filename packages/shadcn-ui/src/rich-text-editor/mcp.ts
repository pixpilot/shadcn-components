import type { ComponentMeta } from '@internal/mcp';
import type { RichTextEditorProps } from './RichTextEditor';
import { defineProps } from '@internal/mcp';

// Derive the documented prop set from the component's own props type so that
// adding a prop to `RichTextEditorProps` is a compile error until it is
// documented here.
type RichTextEditorDocumentedProps = Extract<keyof RichTextEditorProps, string>;

export const meta: ComponentMeta<RichTextEditorDocumentedProps> = {
  name: 'RichTextEditor',
  category: 'Forms',
  description:
    'A TipTap-based WYSIWYG editor with a configurable toolbar (bold, italic, headings, lists, links, alignment, code) that reads and writes HTML.',
  props: defineProps<RichTextEditorDocumentedProps>({
    value: {
      description:
        'HTML content of the editor (React-style value, mapped to TipTap content).',
      type: 'string',
    },
    onChange: {
      description: 'Called with the editor HTML whenever the content changes.',
      type: '(content: string) => void',
    },
    editable: {
      description: 'Whether the editor accepts input.',
      type: 'boolean',
      defaultValue: 'true',
    },
    showToolbar: {
      description: 'Whether the formatting toolbar is shown.',
      type: 'boolean',
      defaultValue: 'true',
    },
    toolbarItems:
      'Explicit toolbar items: predefined command strings, "|" separators, or custom button objects.',
    extensions:
      'Additional TipTap extensions appended to the built-in ones (StarterKit, Link, TextAlign, Placeholder). Accepts any TipTap Extension, Node, or Mark — official packages or your own custom ones. See the "Add a custom extension" example.',
    editorProps: 'Custom TipTap editorProps merged into the defaults.',
    slots:
      'Class overrides for the root, toolbar (and its buttons/separators), and content area.',
    placeholder: 'Placeholder text shown when the editor is empty.',
    tooltipMode: {
      description: 'How toolbar button tooltips are rendered.',
      type: 'ToolbarButtonTooltipMode',
      defaultValue: '"native"',
    },
    immediatelyRender: {
      description: 'Render the editor immediately on mount (helps with SSR/hydration).',
      type: 'boolean',
      defaultValue: 'false',
    },
    allowLinkTarget: {
      description: 'Whether the link popover exposes target controls.',
      type: 'boolean',
      defaultValue: 'false',
    },
    openOnClick: {
      description: 'Whether clicking a link opens it inside the editor.',
      type: 'boolean',
      defaultValue: 'false',
    },
    className: 'CSS class for the root element.',
  }),
  dependencies: [
    { name: '@tiptap/react', type: 'peer' },
    { name: '@tiptap/starter-kit', type: 'peer' },
  ],
  examples: [
    {
      title: 'Basic editor',
      code: '<RichTextEditor value={html} onChange={setHtml} placeholder="Write something…" />',
    },
    {
      title: 'Custom toolbar',
      code: '<RichTextEditor value={html} onChange={setHtml} toolbarItems={["bold", "italic", "|", "bulletList"]} />',
    },
    {
      title: 'Add an official extension',
      code: `// npm i @tiptap/extension-highlight
import Highlight from '@tiptap/extension-highlight';

// Extensions are appended to the built-in ones (StarterKit, Link, TextAlign, Placeholder).
<RichTextEditor value={html} onChange={setHtml} extensions={[Highlight]} />`,
    },
    {
      title: 'Add a custom extension (Mark/Node/Extension) with a toolbar button',
      code: `import { Mark, mergeAttributes } from '@tiptap/core';

// Any Mark.create / Node.create / Extension.create result can be passed to \`extensions\`.
const Highlight = Mark.create({
  name: 'highlight',
  parseHTML() {
    return [{ tag: 'mark' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['mark', mergeAttributes(HTMLAttributes), 0];
  },
});

<RichTextEditor
  value={html}
  onChange={setHtml}
  extensions={[Highlight]}
  toolbarItems={[
    'bold',
    'italic',
    '|',
    {
      icon: '🖍️',
      tooltip: 'Highlight',
      onClick: (editor) => editor.chain().focus().toggleMark('highlight').run(),
      isActive: (editor) => editor.isActive('highlight'),
    },
  ]}
/>`,
    },
  ],
  keywords: ['rich text', 'editor', 'wysiwyg', 'tiptap', 'html', 'form'],
};
