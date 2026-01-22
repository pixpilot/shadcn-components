import type { Editor } from '@tiptap/core';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Strikethrough,
  Underline,
} from 'lucide-react';

export interface PredefinedToolbarOption {
  icon: React.ReactNode;
  tooltip: string;
  onClick: (editor: Editor) => void;
  isActive?: (editor: Editor) => boolean;
}

export const predefinedToolbarItems: Record<string, PredefinedToolbarOption> = {
  bold: {
    icon: <Bold className="h-4 w-4" />,
    tooltip: 'Bold',
    onClick: (editor) => editor.chain().focus().toggleBold().run(),
    isActive: (editor) => editor.isActive('bold'),
  },
  italic: {
    icon: <Italic className="h-4 w-4" />,
    tooltip: 'Italic',
    onClick: (editor) => editor.chain().focus().toggleItalic().run(),
    isActive: (editor) => editor.isActive('italic'),
  },
  underline: {
    icon: <Underline className="h-4 w-4" />,
    tooltip: 'Underline',
    onClick: (editor) => editor.chain().focus().toggleUnderline().run(),
    isActive: (editor) => editor.isActive('underline'),
  },
  link: {
    icon: <LinkIcon className="h-4 w-4" />,
    tooltip: 'Link',
    onClick: (editor) => editor.chain().focus().toggleLink().run(),
    isActive: (editor) => editor.isActive('link'),
  },
  strike: {
    icon: <Strikethrough className="h-4 w-4" />,
    tooltip: 'Strikethrough',
    onClick: (editor) => editor.chain().focus().toggleStrike().run(),
    isActive: (editor) => editor.isActive('strike'),
  },
  code: {
    icon: <Code className="h-4 w-4" />,
    tooltip: 'Inline Code',
    onClick: (editor) => editor.chain().focus().toggleCode().run(),
    isActive: (editor) => editor.isActive('code'),
  },
  heading1: {
    icon: <Heading1 className="h-4 w-4" />,
    tooltip: 'Heading 1',
    onClick: (editor) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    isActive: (editor) => editor.isActive('heading', { level: 1 }),
  },
  heading2: {
    icon: <Heading2 className="h-4 w-4" />,
    tooltip: 'Heading 2',
    onClick: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    isActive: (editor) => editor.isActive('heading', { level: 2 }),
  },
  heading3: {
    icon: <Heading3 className="h-4 w-4" />,
    tooltip: 'Heading 3',
    onClick: (editor) => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    isActive: (editor) => editor.isActive('heading', { level: 3 }),
  },
  bulletList: {
    icon: <List className="h-4 w-4" />,
    tooltip: 'Bullet List',
    onClick: (editor) => editor.chain().focus().toggleBulletList().run(),
    isActive: (editor) => editor.isActive('bulletList'),
  },
  orderedList: {
    icon: <ListOrdered className="h-4 w-4" />,
    tooltip: 'Ordered List',
    onClick: (editor) => editor.chain().focus().toggleOrderedList().run(),
    isActive: (editor) => editor.isActive('orderedList'),
  },
  blockquote: {
    icon: <Quote className="h-4 w-4" />,
    tooltip: 'Blockquote',
    onClick: (editor) => editor.chain().focus().toggleBlockquote().run(),
    isActive: (editor) => editor.isActive('blockquote'),
  },
  codeBlock: {
    icon: <Code2 className="h-4 w-4" />,
    tooltip: 'Code Block',
    onClick: (editor) => editor.chain().focus().toggleCodeBlock().run(),
    isActive: (editor) => editor.isActive('codeBlock'),
  },
  alignLeft: {
    icon: <AlignLeft className="h-4 w-4" />,
    tooltip: 'Align Left',
    onClick: (editor) => editor.chain().focus().setTextAlign('left').run(),
    isActive: (editor) => editor.isActive({ textAlign: 'left' }),
  },
  alignCenter: {
    icon: <AlignCenter className="h-4 w-4" />,
    tooltip: 'Align Center',
    onClick: (editor) => editor.chain().focus().setTextAlign('center').run(),
    isActive: (editor) => editor.isActive({ textAlign: 'center' }),
  },
  alignRight: {
    icon: <AlignRight className="h-4 w-4" />,
    tooltip: 'Align Right',
    onClick: (editor) => editor.chain().focus().setTextAlign('right').run(),
    isActive: (editor) => editor.isActive({ textAlign: 'right' }),
  },
};
