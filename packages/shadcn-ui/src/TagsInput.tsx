'use client';

import type { CommandOptionListItem } from './CommandOptionList';
import {
  cn,
  Command,
  Popover,
  PopoverContent,
  PopoverTrigger,
  TagsInputInLineClear,
  TagsInputInLineInput,
  TagsInputInLineItem,
  TagsInputInLineLabel,
  TagsInputInLineList,
  TagsInputInLineRoot,
} from '@pixpilot/shadcn';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CommandOptionList } from './CommandOptionList';

export interface TagsInputProps {
  value?: Array<string | number>;
  onChange?: (value: Array<string | number>) => void;
  options?: CommandOptionListItem[];
  freeSolo?: boolean;
  placeholder?: string;
  emptyText?: string;
  className?: string;
  disabled?: boolean;
  readOnly?: boolean;
  maxTags?: number;
  allowDuplicates?: boolean;
  editable?: boolean;
  label?: string;
  delimiter?: string;
  addOnPaste?: boolean;
  addOnTab?: boolean;
  onValidate?: (value: string) => boolean;
}

const EMPTY_ARRAY: Array<string | number> = [];
const EMPTY_OPTIONS: CommandOptionListItem[] = [];

/**
 * TagsInput component - Inline tags input based on DiceUI
 *
 * This is a different implementation than TagsInput, using the DiceUI library
 * for a more streamlined inline editing experience.
 *
 * Features:
 * - Inline tag display and editing
 * - Keyboard navigation (Arrow keys, Home, End, Delete, Backspace)
 * - Optional tag editing (editable prop)
 * - Validation support
 * - Paste support with delimiter parsing
 * - Max tags limit
 * - Options support with dropdown (like Select)
 * - freeSolo mode for custom tags (like MUI Autocomplete)
 */
export function TagsInput({
  value = EMPTY_ARRAY,
  onChange,
  options = EMPTY_OPTIONS,
  freeSolo = true,
  placeholder = 'Add tags...',
  emptyText = 'No options found.',
  className,
  disabled = false,
  readOnly = false,
  maxTags,
  allowDuplicates = false,
  editable = false,
  label,
  delimiter = ',',
  addOnPaste = true,
  addOnTab = true,
  onValidate,
}: TagsInputProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const hasOptions = options.length > 0;

  // Keep focus on input when popover opens
  useEffect(() => {
    if (open && inputRef.current) {
      // Use setTimeout to ensure the popover has rendered
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
      return () => {
        clearTimeout(timer);
      };
    }
    return undefined;
  }, [open]);

  // Convert value to string[] for display
  const stringValues = useMemo(() => {
    return value.map((v) => String(v));
  }, [value]);

  // Get label for a value
  const getLabel = useCallback(
    (val: string | number): string => {
      if (!hasOptions) return String(val);
      const option = options.find((opt) => String(opt.value) === String(val));
      return option?.label ?? String(val);
    },
    [options, hasOptions],
  );

  // Filter options based on input (keep selected items visible with checkmark)
  const filteredOptions = useMemo(() => {
    if (!hasOptions) return [];

    return options.filter((option) => {
      // Filter by search input only (don't filter out selected items)
      if (searchValue) {
        return option.label.toLowerCase().includes(searchValue.toLowerCase());
      }
      return true;
    });
  }, [options, searchValue, hasOptions]);

  const handleValueChange = useCallback(
    (newTags: string[]) => {
      // Clear search when tags are added
      setSearchValue('');

      // Convert back to original value types if we have options
      if (hasOptions) {
        const convertedValues = newTags.map((tag) => {
          const option = options.find((opt) => String(opt.value) === tag);
          return option?.value ?? tag;
        });
        onChange?.(convertedValues);
      } else {
        onChange?.(newTags);
      }
    },
    [onChange, options, hasOptions],
  );

  const handleValidate = useCallback(
    (tag: string) => {
      // Check max tags
      if (maxTags !== undefined && value.length >= maxTags) {
        return false;
      }

      // Check duplicates
      if (!allowDuplicates && stringValues.includes(tag)) {
        return false;
      }

      // If options exist and freeSolo is false, only allow values from options
      if (hasOptions && !freeSolo) {
        const isValidOption = options.some((opt) => String(opt.value) === tag);
        if (!isValidOption) {
          return false;
        }
      }

      // Custom validation
      if (onValidate) {
        return onValidate(tag);
      }

      return true;
    },
    [
      value,
      maxTags,
      allowDuplicates,
      onValidate,
      stringValues,
      hasOptions,
      freeSolo,
      options,
    ],
  );

  const handleSelectOption = useCallback(
    (optionValue: string | number) => {
      // Toggle selection: add if not present, remove if present
      const isSelected = value.some((v) => String(v) === String(optionValue));

      let newValues: Array<string | number>;
      if (isSelected) {
        // Remove the item
        newValues = value.filter((v) => String(v) !== String(optionValue));
      } else {
        // Add the item
        newValues = [...value, optionValue];
      }

      onChange?.(newValues);
      setSearchValue('');
      // Keep popover open for multi-select behavior
      // setOpen(false);
    },
    [value, onChange],
  );

  // Render mode without options dropdown (original behavior)
  if (!hasOptions) {
    return (
      <TagsInputInLineRoot
        className={className}
        disabled={disabled}
        editable={editable}
        max={maxTags}
        onValueChange={handleValueChange}
        onValidate={handleValidate}
        readOnly={readOnly}
        value={stringValues}
        delimiter={delimiter}
        addOnPaste={addOnPaste}
        addOnTab={addOnTab}
      >
        {label !== undefined && label !== '' ? (
          <TagsInputInLineLabel>{label}</TagsInputInLineLabel>
        ) : null}
        <TagsInputInLineList>
          {stringValues.map((tag) => (
            <TagsInputInLineItem key={tag} value={tag}>
              {tag}
            </TagsInputInLineItem>
          ))}
          <TagsInputInLineInput placeholder={placeholder} />
        </TagsInputInLineList>
        {value.length > 0 && !disabled && !readOnly && <TagsInputInLineClear />}
      </TagsInputInLineRoot>
    );
  }

  // Render mode with options dropdown
  return (
    <div className={cn('relative', className)}>
      {label !== undefined && label !== '' ? (
        <TagsInputInLineLabel>{label}</TagsInputInLineLabel>
      ) : null}
      <Popover open={open && !disabled && !readOnly} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="w-full">
            <TagsInputInLineRoot
              disabled={disabled}
              editable={editable}
              max={maxTags}
              onValueChange={handleValueChange}
              onValidate={handleValidate}
              readOnly={readOnly}
              value={stringValues}
              delimiter={freeSolo ? delimiter : undefined}
              addOnPaste={freeSolo ? addOnPaste : false}
              addOnTab={freeSolo ? addOnTab : false}
            >
              <TagsInputInLineList
                onClick={(e) => {
                  if (!disabled && !readOnly) {
                    e.stopPropagation();
                    setOpen(true);
                  }
                }}
              >
                {value.map((val) => {
                  const displayLabel = getLabel(val);
                  return (
                    <TagsInputInLineItem key={String(val)} value={String(val)}>
                      {displayLabel}
                    </TagsInputInLineItem>
                  );
                })}
                <TagsInputInLineInput
                  ref={inputRef}
                  placeholder={placeholder}
                  onFocus={(e) => {
                    e.stopPropagation();
                    setOpen(true);
                  }}
                  onChange={(e) => {
                    e.stopPropagation();
                    setSearchValue(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    // Allow normal TagsInput behavior for most keys
                    // But delegate arrow navigation to Command when popover is open
                    if (open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
                      e.preventDefault();
                      e.stopPropagation();

                      // Find the Command element and trigger navigation
                      const command = document.querySelector('[cmdk-root]');
                      if (command) {
                        const event = new KeyboardEvent('keydown', {
                          key: e.key,
                          bubbles: true,
                          cancelable: true,
                        });
                        command.dispatchEvent(event);
                      }
                      return;
                    }

                    // For Enter key when popover is open, check if a Command item is selected
                    if (open && e.key === 'Enter') {
                      const selectedItem = document.querySelector(
                        '[cmdk-item][data-selected="true"]',
                      );
                      if (selectedItem) {
                        e.preventDefault();
                        e.stopPropagation();
                        (selectedItem as HTMLElement).click();
                        return;
                      }
                    }

                    e.stopPropagation();
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                  }}
                />
              </TagsInputInLineList>
              {value.length > 0 && !disabled && !readOnly && <TagsInputInLineClear />}
            </TagsInputInLineRoot>
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="p-0"
          align="start"
          style={{ width: 'var(--radix-popover-trigger-width)' }}
          onOpenAutoFocus={(e) => {
            e.preventDefault();
          }}
        >
          <Command shouldFilter={false} value={searchValue} loop>
            <CommandOptionList
              options={filteredOptions}
              value={value}
              onChange={handleSelectOption}
              emptyText={emptyText}
            />
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
