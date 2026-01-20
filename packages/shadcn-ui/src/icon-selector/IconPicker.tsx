import type { PopoverContent } from '@pixpilot/shadcn';
import type { FC } from 'react';

import type { IconProvider } from './types';

import { Icon } from '@iconify/react';
import { cn } from '@pixpilot/shadcn';
import { X } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Button } from '../Button';
import { useMediaQuery } from '../hooks';
import { ICON_SELECTOR_ERROR_MESSAGE } from './constants';
import { IconPickerContainer } from './icon-picker-container';
import IconPickerContent from './icon-picker-content';

/**
 * Mount type for the icon selector picker
 * - 'dialog': Always display as a modal dialog
 * - 'popover': Always display as a popover anchored to the trigger button
 */
type MountType = 'dialog' | 'popover';

export type IconPickerVariant = 'default' | 'icon-button';

/**
 * Icon Selector Component
 * Allows users to select an icon from multiple icon providers via a dialog or popover
 */
export interface IconPickerProps {
  value?: string;
  onChange?: (value: string) => void;
  onOpenChange?: (open: boolean) => void;
  pickerMode?: MountType;
  popover?: Partial<React.ComponentProps<typeof PopoverContent>>;
  variant?: IconPickerVariant;
  providers: IconProvider[];
  isLoading?: boolean;
  onProvidersLoaded?: (providers: Array<{ prefix: string; name: string }>) => void;
  showValueText?: boolean;
  emptyText?: React.ReactNode;
  showClearButton?: boolean;
}

export const IconPicker: FC<IconPickerProps> = ({
  value,
  onChange,
  onOpenChange,
  pickerMode = 'dialog',
  popover,
  variant = 'default',
  providers: providersProp,
  showValueText = true,
  emptyText = '+',
  showClearButton = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const isMobile = useMediaQuery({ maxWidth: 768 });

  const handleSelectIcon = useCallback(
    (iconName: string) => {
      onChange?.(iconName);
      setIsOpen(false);
      onOpenChange?.(false);
    },
    [onChange, onOpenChange],
  );

  const handleClearIcon = useCallback(() => {
    onChange?.('');
    setIsOpen(false);
    onOpenChange?.(false);
  }, [onChange, onOpenChange]);

  const hasValue = typeof value === 'string' && value.length > 0;

  const renderIconDisplay = (emptyClassName: string, ariaHidden?: boolean) => {
    if (hasValue) {
      return <Icon icon={value} width="20" height="20" />;
    }

    return (
      <span
        aria-hidden={ariaHidden}
        className={cn(
          'min-w-6 text-muted-foreground flex items-center justify-center',
          emptyClassName,
        )}
      >
        {emptyText}
      </span>
    );
  };

  const displayIcon = renderIconDisplay('text-sm');

  const selectorContent = (
    <IconPickerContent
      providers={providersProp}
      onChange={handleSelectIcon}
      onSelect={() => setIsOpen(false)}
    />
  );

  if (providersProp.length === 0) {
    // eslint-disable-next-line no-restricted-properties, node/prefer-global/process
    if (process.env.NODE_ENV === 'development') {
      throw new Error(ICON_SELECTOR_ERROR_MESSAGE);
    } else {
      return <div>No icons configured</div>;
    }
  }

  // Determine which mode to use (handles 'auto' mode)
  let effectiveMode: 'dialog' | 'popover';
  if (pickerMode === 'popover') {
    effectiveMode = isMobile ? 'dialog' : 'popover';
  } else {
    effectiveMode = pickerMode;
  }

  const isIconButtonVariant = variant === 'icon-button';
  const iconButtonLabel = hasValue ? `Change selected icon (${value})` : 'Select an icon';
  const shouldShowClearButton = showClearButton && hasValue;

  const iconButtonContent = renderIconDisplay('text-lg', true);

  if (isIconButtonVariant) {
    return (
      <IconPickerContainer
        effectiveMode={effectiveMode}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        selectorContent={selectorContent}
        popover={popover}
      >
        <span className="relative inline-flex">
          <Button
            type="button"
            variant="outline"
            className="p-2"
            aria-label={iconButtonLabel}
          >
            {iconButtonContent}
          </Button>
          {shouldShowClearButton && (
            <Button
              type="button"
              title="Clear selected icon"
              className={cn(
                'absolute -right-1 -top-1 inline-flex h-4 w-4 items-center justify-center rounded-full !p-1',
                'border border-border bg-background text-foreground',
                'hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              )}
              aria-label="Clear icon"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                handleClearIcon();
              }}
            >
              <X className="!h-3 !w-3" />
            </Button>
          )}
        </span>
      </IconPickerContainer>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2">
        {displayIcon}
        {showValueText && hasValue && (
          <span className="text-sm text-muted-foreground">{value}</span>
        )}
      </div>

      <IconPickerContainer
        effectiveMode={effectiveMode}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        selectorContent={selectorContent}
        popover={popover}
      >
        <Button type="button" variant="outline" className="whitespace-nowrap">
          {hasValue ? 'Change Icon' : 'Select Icon'}
        </Button>
      </IconPickerContainer>

      {shouldShowClearButton && (
        <Button
          type="button"
          variant="outline"
          className="whitespace-nowrap"
          onClick={handleClearIcon}
        >
          Clear
        </Button>
      )}
    </div>
  );
};
