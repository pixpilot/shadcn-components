'use client';

import type {
  ChangeEventHandler,
  FocusEventHandler,
  KeyboardEventHandler,
  MouseEventHandler,
  Ref,
} from 'react';

import {
  Button,
  cn,
  TagsInputInLineClear,
  TagsInputInLineInput,
  TagsInputInLineItem,
  TagsInputInLineLabel,
  TagsInputInLineList,
  TagsInputInLineRoot,
} from '@pixpilot/shadcn';

import { Plus } from 'lucide-react';

import { useMemo } from 'react';

export interface TagsInputInlineItem {
  key: string;
  value: string;
  label: string;
}

export interface TagsInputInlineProps {
  label?: string;
  showLabel?: boolean;
  className?: string;
  disabled?: boolean;
  editable?: boolean;
  max?: number;
  onValueChange: (value: string[]) => void;
  onValidate: (value: string) => boolean;
  readOnly?: boolean;
  value: string[];
  delimiter?: string;
  addOnPaste?: boolean;
  addOnTab?: boolean;
  items: TagsInputInlineItem[];
  onListClick?: MouseEventHandler<HTMLDivElement>;
  inputRef?: Ref<HTMLInputElement>;
  inputPlaceholder?: string;
  inputValue: string;
  onInputFocus?: FocusEventHandler<HTMLInputElement>;
  onInputChange?: ChangeEventHandler<HTMLInputElement>;
  onInputKeyDown?: KeyboardEventHandler<HTMLInputElement>;
  onInputMouseDown?: MouseEventHandler<HTMLInputElement>;
  addButtonVisibility?: 'always' | 'touch' | 'never';
  slots?: {
    list?: {
      className?: string;
    };
    label?: Record<string, any>;
    item?: Record<string, any>;
    input?: Record<string, any>;
    addButton?: {
      className?: string;
    };
    clear?: Record<string, any>;
  };
  canAddCurrentValue?: boolean;
  onAddCurrentInput?: () => void;
  showClear?: boolean;
}

export function TagsInputInline({
  label,
  showLabel = true,
  className,
  disabled = false,
  editable,
  max,
  onValueChange,
  onValidate,
  readOnly = false,
  value,
  delimiter,
  addOnPaste,
  addOnTab,
  items,
  onListClick,
  inputRef,
  inputPlaceholder,
  inputValue,
  onInputFocus,
  onInputChange,
  onInputKeyDown,
  onInputMouseDown,
  addButtonVisibility = 'touch',
  slots,
  canAddCurrentValue = false,
  onAddCurrentInput,
  showClear = false,
}: TagsInputInlineProps) {
  const addButtonVisibilityClassName = useMemo(() => {
    if (addButtonVisibility === 'always') {
      return 'inline-flex';
    }

    if (addButtonVisibility === 'touch') {
      return 'hidden pointer-coarse:inline-flex';
    }

    return 'hidden';
  }, [addButtonVisibility]);

  const isAddDisabled = disabled || readOnly || !canAddCurrentValue;

  const listProps = slots?.list || {};
  const { className: listClassName, ...listRest } = listProps;

  return (
    <TagsInputInLineRoot
      className={className}
      disabled={disabled}
      editable={editable}
      max={max}
      onValueChange={onValueChange}
      onValidate={onValidate}
      readOnly={readOnly}
      value={value}
      delimiter={delimiter}
      addOnPaste={addOnPaste}
      addOnTab={addOnTab}
    >
      {showLabel && label !== undefined && label !== '' ? (
        <TagsInputInLineLabel {...(slots?.label || {})}>{label}</TagsInputInLineLabel>
      ) : null}
      <TagsInputInLineList
        {...listRest}
        className={cn('relative pr-10', listClassName)}
        onClick={onListClick}
      >
        {items.map((item) => (
          <TagsInputInLineItem {...(slots?.item || {})} key={item.key} value={item.value}>
            {item.label}
          </TagsInputInLineItem>
        ))}
        <TagsInputInLineInput
          {...(slots?.input || {})}
          ref={inputRef}
          placeholder={inputPlaceholder}
          value={inputValue}
          onFocus={onInputFocus}
          onChange={onInputChange}
          onKeyDown={onInputKeyDown}
          onMouseDown={onInputMouseDown}
        />
        {addButtonVisibility !== 'never' ? (
          <Button
            {...slots?.addButton}
            type="button"
            size="icon"
            variant="ghost"
            className={cn(
              'absolute top-1/2 right-1.5 h-8 w-8 -translate-y-1/2 shrink-0',
              slots?.addButton?.className,
              addButtonVisibilityClassName,
            )}
            disabled={isAddDisabled}
            onClick={onAddCurrentInput}
          >
            <Plus className="size-5" />
            <span className="sr-only">Add tag</span>
          </Button>
        ) : null}
      </TagsInputInLineList>
      {showClear ? <TagsInputInLineClear {...(slots?.clear || {})} /> : null}
    </TagsInputInLineRoot>
  );
}
