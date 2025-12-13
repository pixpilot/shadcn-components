import type { Editor, Extension } from '@tiptap/core';
import type { PredefinedToolbarOption } from './predefined-toolbar-options';
import { Button, cn, Tooltip, TooltipContent, TooltipTrigger } from '@pixpilot/shadcn';
import { EditorContent, useEditor } from '@tiptap/react';

import StarterKit from '@tiptap/starter-kit';
import React from 'react';
import { predefinedToolbarOptions } from './predefined-toolbar-options';

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  tooltip: string;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  onClick,
  isActive,
  disabled,
  children,
  tooltip,
}) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Button
        type="button"
        variant={isActive ? 'default' : 'ghost'}
        size="sm"
        onMouseDown={(event) => {
          // Prevent the toolbar button from taking focus away from the editor.
          event.preventDefault();
        }}
        onClick={onClick}
        disabled={disabled}
        className="h-8 w-8 p-0"
      >
        {children}
      </Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>{tooltip}</p>
    </TooltipContent>
  </Tooltip>
);

type EditorProps = Editor['options']['editorProps'];

export type ToolbarOption =
  | string
  | '|'
  | {
      icon: React.ReactNode;
      tooltip: string;
      onClick: (editor: any) => void;
      isActive?: (editor: any) => boolean;
    };

export interface RichTextEditorProps {
  /**
   * The initial content of the editor
   */
  content?: string;
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
   * Custom class name for the editor container
   */
  className?: string;
  /**
   * Custom class name for the editor content
   */
  contentClassName?: string;
  /**
   * Whether to show the toolbar
   * @default true
   */
  showToolbar?: boolean;
  /**
   * Array of toolbar options to display. If provided, only these options will be shown.
   * Can be strings for predefined commands or objects for custom buttons.
   */
  toolbarOptions?: ToolbarOption[];
  /**
   * Custom editor props to pass to the editor
   */
  editorProps?: EditorProps;
}

const defaultExtensions: Extension[] = [];

const defaultToolbarOptions: ToolbarOption[] = [
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

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  extensions = defaultExtensions,
  editable = true,
  className,
  contentClassName,
  showToolbar = true,
  toolbarOptions = defaultToolbarOptions,
  editorProps: customEditorProps,
}) => {
  // TipTap editor state (selection/active marks) changes without React re-rendering.
  // Force a re-render on selection/transaction updates so toolbar buttons
  // correctly reflect the current cursor/selection formatting.
  const [, forceRender] = React.useReducer((x: number) => x + 1, 0);

  const defaultEditorProps: EditorProps = {
    attributes: {
      class: cn(
        'min-h-[200px] p-4 text-sm leading-relaxed focus:outline-none',
        '[&_h1]:text-3xl [&_h1]:font-bold [&_h1]:leading-tight [&_h1]:my-2',
        '[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:leading-tight [&_h2]:my-2',
        '[&_h3]:text-xl [&_h3]:font-bold [&_h3]:leading-tight [&_h3]:my-2',
        '[&_p]:my-2',
        '[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2',
        '[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2',
        '[&_blockquote]:border-l-4 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:my-2 [&_blockquote]:italic',
        '[&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-[0.875em] [&_code]:font-mono',
        '[&_pre]:bg-muted [&_pre]:p-4 [&_pre]:rounded [&_pre]:overflow-x-auto [&_pre]:font-mono',
        contentClassName,
      ),
    },
  };

  const mergedEditorProps: EditorProps = {
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
  };

  const editorInstance = useEditor({
    extensions: [StarterKit].concat(extensions),
    content,
    editable,
    onUpdate: ({ editor: updatedEditor }) => {
      onChange?.(updatedEditor.getHTML());
    },
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
      <div className={cn('border rounded-md bg-background', className)}>
        {showToolbar && (
          <div className="flex flex-wrap items-center gap-1 border-b p-2 h-10" />
        )}
        <div className="min-h-[200px] p-4 text-sm leading-relaxed">Loading editor...</div>
      </div>
    );
  }

  const handleCommand = (commandFn: () => any) => {
    try {
      commandFn();
    } catch {
      // Ignore command errors
    }
  };

  const renderToolbar = () => {
    if (!showToolbar) return null;

    const isEditorFocused = editorInstance.isFocused;

    return (
      <div className="flex flex-wrap items-center gap-1 border-b p-2">
        {toolbarOptions.map((option, index) => {
          if (option === '|') {
            // eslint-disable-next-line react/no-array-index-key
            return <div key={`separator-${index}`} className="mx-1 h-6 w-px bg-border" />;
          }

          if (typeof option === 'string') {
            const predefinedOption = predefinedToolbarOptions[option];
            if (!predefinedOption) return null;

            return (
              <ToolbarButton
                key={option}
                onClick={() =>
                  handleCommand(() => predefinedOption.onClick(editorInstance))
                }
                isActive={
                  isEditorFocused &&
                  (predefinedOption.isActive?.(editorInstance) ?? false)
                }
                tooltip={predefinedOption.tooltip}
              >
                {predefinedOption.icon}
              </ToolbarButton>
            );
          }

          // Custom option object
          const customOption = option as PredefinedToolbarOption;
          return (
            <ToolbarButton
              // eslint-disable-next-line react/no-array-index-key
              key={`custom-${index}-${customOption.tooltip}`}
              onClick={() => handleCommand(() => customOption.onClick(editorInstance))}
              isActive={
                isEditorFocused && (customOption.isActive?.(editorInstance) ?? false)
              }
              tooltip={customOption.tooltip}
            >
              {customOption.icon}
            </ToolbarButton>
          );
        })}
      </div>
    );
  };

  return (
    <div className={cn('border rounded-md bg-background', className)}>
      {renderToolbar()}
      <EditorContent editor={editorInstance} />
    </div>
  );
};

RichTextEditor.displayName = 'RichTextEditor';

export { RichTextEditor };
