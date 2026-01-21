import type { Editor, EditorEvents, Extension } from '@tiptap/core';
import type { UseEditorOptions } from '@tiptap/react';
import { cn } from '@pixpilot/shadcn';
import { EditorContent, useEditor } from '@tiptap/react';

import StarterKit from '@tiptap/starter-kit';
import React from 'react';
import { RichTextEditorToolbar } from './RichTextEditorToolbar';

type EditorProps = Editor['options']['editorProps'];

export type ToolbarItems =
  | string
  | '|'
  | {
      icon: React.ReactNode;
      tooltip: string;
      onClick: (editor: any) => void;
      isActive?: (editor: any) => boolean;
    };

export interface RichTextEditorSlots {
  root?: {
    className?: string;
  };
  toolbar?: {
    className?: string;
    button?: {
      className?: string;
    };
    separator?: {
      className?: string;
    };
  };
  content?: {
    className?: string;
  };
}

export interface RichTextEditorProps {
  /**
   * The HTML value of the editor.
   * TipTap uses `content` internally, but this component follows React input conventions.
   */
  value?: string;
  /**
   * Callback when the content changes
   */
  onChange?: (content: string) => void;
  /**
   * Additional extensions to add to the editor
   */
  extensions?: Extension[];
  /**
   * Whether the editor is editable
   * @default true
   */
  editable?: boolean;
  /**
   * Slots for styling different parts of the editor.
   *
   * - `slots.root.className`: outer container
   * - `slots.toolbar.className`: toolbar wrapper
   * - `slots.toolbar.button.className`: each toolbar button
   * - `slots.toolbar.separator.className`: separators (`|`)
   * - `slots.content.className`: editor content area (merged into TipTap `editorProps.attributes.class`)
   */
  slots?: RichTextEditorSlots;
  /**
   * Whether to show the toolbar
   * @default true
   */
  showToolbar?: boolean;
  /**
   * Array of toolbar items to display. If provided, only these items will be shown.
   * Can be strings for predefined commands or objects for custom buttons.
   */
  toolbarItems?: ToolbarItems[];
  /**
   * Custom editor props to pass to the editor
   */
  editorProps?: EditorProps;

  /**
   * If true, the editor will render immediately on mount.
   * This can help with SSR or hydration issues in some cases.
   * @default false
   */
  immediatelyRender?: UseEditorOptions['immediatelyRender'];
}

const defaultExtensions: Extension[] = [];

const defaultToolbarItems: ToolbarItems[] = [
  'bold',
  'italic',
  'underline',
  'strike',
  'code',
  '|',
  'heading1',
  'heading2',
  'heading3',
  '|',
  'bulletList',
  'orderedList',
  '|',
  'blockquote',
  'codeBlock',
];

function useEditorProps(
  slots?: RichTextEditorSlots,
  customEditorProps?: EditorProps,
): EditorProps {
  const defaultEditorProps: EditorProps = React.useMemo(
    () => ({
      attributes: {
        class: cn(
          'min-h-[200px] p-4 text-sm leading-relaxed focus:outline-none',
          '[&_h1]:text-3xl [&_h1]:font-bold [&_h1]:leading-tight [&_h1]:mt-8 [&_h1]:mb-4 [&_h1:first-child]:mt-0',
          '[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:leading-tight [&_h2]:mt-6 [&_h2]:mb-3 [&_h2:first-child]:mt-0',
          '[&_h3]:text-xl [&_h3]:font-bold [&_h3]:leading-tight [&_h3]:mt-4 [&_h3]:mb-2 [&_h3:first-child]:mt-0',
          '[&_p]:mb-3',
          '[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-3',
          '[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-3',
          '[&_blockquote]:border-l-4 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:mb-4 [&_blockquote]:italic [&_blockquote:first-child]:mt-0',
          '[&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-[0.875em] [&_code]:font-mono',
          '[&_pre]:bg-muted [&_pre]:p-4 [&_pre]:rounded [&_pre]:overflow-x-auto [&_pre]:font-mono [&_pre]:mb-4',
          '[&_*:last-child]:mb-0',
          slots?.content?.className,
        ),
      },
    }),
    [slots],
  );

  const mergedEditorProps: EditorProps = React.useMemo(
    () => ({
      ...defaultEditorProps,
      ...customEditorProps,

      attributes: {
        ...defaultEditorProps.attributes,
        ...customEditorProps?.attributes,
        class: cn(
          (defaultEditorProps.attributes as { class: string }).class,
          (customEditorProps?.attributes as { class: string })?.class,
        ),
      },
    }),
    [defaultEditorProps, customEditorProps],
  );

  return mergedEditorProps;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  extensions = defaultExtensions,
  editable = true,
  slots,
  showToolbar = true,
  toolbarItems = defaultToolbarItems,
  editorProps: customEditorProps,
  immediatelyRender = false,
}) => {
  // TipTap editor state (selection/active marks) changes without React re-rendering.
  // Force a re-render on selection/transaction updates so toolbar buttons
  // correctly reflect the current cursor/selection formatting.
  const [renderTick, forceRender] = React.useReducer((x: number) => x + 1, 0);

  const mergedEditorProps = useEditorProps(slots, customEditorProps);

  const onChangeRef = React.useRef(onChange);
  onChangeRef.current = onChange;

  const handleChange = React.useCallback((props: EditorEvents['update']) => {
    onChangeRef.current?.(props.editor.getHTML());
  }, []);

  const editorInstance = useEditor({
    extensions: [StarterKit].concat(extensions),
    content: value,
    editable,
    onUpdate: handleChange,
    immediatelyRender,
    editorProps: mergedEditorProps,
  });

  React.useEffect(() => {
    if (editorInstance == null) {
      return () => {};
    }

    const rerender = () => {
      forceRender();
    };

    editorInstance.on('selectionUpdate', rerender);
    editorInstance.on('transaction', rerender);
    editorInstance.on('focus', rerender);
    editorInstance.on('blur', rerender);

    return () => {
      editorInstance.off('selectionUpdate', rerender);
      editorInstance.off('transaction', rerender);
      editorInstance.off('focus', rerender);
      editorInstance.off('blur', rerender);
    };
  }, [editorInstance]);

  if (editorInstance == null) {
    return (
      <div className={cn('border rounded-md bg-background', slots?.root?.className)}>
        {showToolbar && (
          <div
            className={cn(
              'flex flex-wrap items-center gap-1 border-b p-2 h-10',
              slots?.toolbar?.className,
            )}
          />
        )}
        <div
          className={cn(
            'min-h-[200px] p-4 text-sm leading-relaxed',
            slots?.content?.className,
          )}
        >
          Loading editor...
        </div>
      </div>
    );
  }

  return (
    <div className={cn('border rounded-md bg-background', slots?.root?.className)}>
      <RichTextEditorToolbar
        editor={editorInstance}
        toolbarItems={toolbarItems}
        slots={slots}
        showToolbar={showToolbar}
        renderTick={renderTick}
      />
      <EditorContent editor={editorInstance} />
    </div>
  );
};

RichTextEditor.displayName = 'RichTextEditor';

export { RichTextEditor };
