import type { Editor } from '@tiptap/core';
import type { PredefinedToolbarOption } from './predefined-toolbar-items';
import type { RichTextEditorSlots, ToolbarItems } from './RichTextEditor';

import type { ToolbarButtonTooltipMode } from './ToolbarButton';
import { cn } from '@pixpilot/shadcn';
import React from 'react';
import { predefinedToolbarItems } from './predefined-toolbar-items';
import { ToolbarButton } from './ToolbarButton';

export interface RichTextEditorToolbarProps {
  editor: Editor;
  toolbarItems: ToolbarItems[];
  slots?: RichTextEditorSlots;
  showToolbar: boolean;
  /**
   * A value that changes when editor selection/transaction changes.
   * This ensures the memoized toolbar re-renders to reflect active formatting.
   */
  renderTick: number;
  tooltipMode?: ToolbarButtonTooltipMode;
}

const RichTextEditorToolbarComponent: React.FC<RichTextEditorToolbarProps> = ({
  editor,
  toolbarItems,
  slots,
  showToolbar,
  renderTick,
  tooltipMode,
}) => {
  if (!showToolbar) return null;

  const handleCommand = (commandFn: () => unknown) => {
    try {
      commandFn();
    } catch {
      // Ignore command errors
    }
  };

  const isEditorFocused = editor.isFocused;

  let separatorCount = 0;
  let customCount = 0;

  return (
    <div
      data-render-tick={renderTick}
      className={cn(
        'flex flex-wrap items-center gap-1 border-b p-2',
        slots?.toolbar?.className,
      )}
    >
      {toolbarItems.map((option) => {
        if (option === '|') {
          separatorCount += 1;
          return (
            <div
              key={`separator-${separatorCount}`}
              className={cn(
                'mx-1 h-6 w-px bg-border',
                slots?.toolbar?.separator?.className,
              )}
            />
          );
        }

        if (typeof option === 'string') {
          const predefinedOption = predefinedToolbarItems[option];
          if (!predefinedOption) return null;

          return (
            <ToolbarButton
              key={option}
              onClick={() => handleCommand(() => predefinedOption.onClick(editor))}
              isActive={isEditorFocused && (predefinedOption.isActive?.(editor) ?? false)}
              tooltip={predefinedOption.tooltip}
              className={slots?.toolbar?.button?.className}
              tooltipMode={tooltipMode}
            >
              {predefinedOption.icon}
            </ToolbarButton>
          );
        }

        // Custom option object
        const customOption = option as PredefinedToolbarOption;
        customCount += 1;
        return (
          <ToolbarButton
            key={`custom-${customCount}-${customOption.tooltip}`}
            onClick={() => handleCommand(() => customOption.onClick(editor))}
            isActive={isEditorFocused && (customOption.isActive?.(editor) ?? false)}
            tooltip={customOption.tooltip}
            className={slots?.toolbar?.button?.className}
            tooltipMode={tooltipMode}
          >
            {customOption.icon}
          </ToolbarButton>
        );
      })}
    </div>
  );
};

export const RichTextEditorToolbar = React.memo(RichTextEditorToolbarComponent);
