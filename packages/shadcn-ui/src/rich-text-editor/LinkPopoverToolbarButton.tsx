import type { Editor } from '@tiptap/core';
import type { ToolbarButtonTooltipMode } from './ToolbarButton';
import { cn, Label, RadioGroup, RadioGroupItem } from '@pixpilot/shadcn';
import { Link as LinkIcon } from 'lucide-react';
import React from 'react';
import { Button } from '../button';
import { Input } from '../input';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';

interface LinkPopoverToolbarButtonProps {
  editor: Editor;
  isActive?: boolean;
  className?: string;
  tooltipMode?: ToolbarButtonTooltipMode;
  allowLinkTarget?: boolean;
}

type LinkTargetOption = 'current' | 'blank';

function getLinkTargetOption(target: unknown): LinkTargetOption {
  return target === '_blank' ? 'blank' : 'current';
}

function getLinkAttributes(openTarget: LinkTargetOption) {
  if (openTarget === 'blank') {
    return {
      target: '_blank',
      rel: 'noopener noreferrer',
    };
  }

  return {
    target: null,
    rel: null,
  };
}

export const LinkPopoverToolbarButton: React.FC<LinkPopoverToolbarButtonProps> = ({
  editor,
  isActive,
  className,
  tooltipMode,
  allowLinkTarget = false,
}) => {
  const [open, setOpen] = React.useState(false);
  const [href, setHref] = React.useState('');
  const [openTarget, setOpenTarget] = React.useState<LinkTargetOption>('current');
  const inputRef = React.useRef<HTMLInputElement>(null);

  const syncFormFromSelection = React.useCallback(() => {
    const attributes = editor.getAttributes('link');
    setHref(typeof attributes.href === 'string' ? attributes.href : '');
    setOpenTarget(getLinkTargetOption(attributes.target));
  }, [editor]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      syncFormFromSelection();
    }

    setOpen(nextOpen);
  };

  React.useEffect(() => {
    if (!open) return;

    window.requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  }, [open]);

  const applyLink = () => {
    const trimmedHref = href.trim();

    if (!trimmedHref) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      setOpen(false);
      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({
        href: trimmedHref,
        ...getLinkAttributes(allowLinkTarget ? openTarget : 'current'),
      })
      .run();

    setOpen(false);
  };

  const removeLink = () => {
    editor.chain().focus().extendMarkRange('link').unsetLink().run();
    setOpen(false);
  };

  const tooltip = 'Edit Link';
  const inputId = `link-input-${React.useId()}`;
  const radioCurrentId = `link-target-current-${React.useId()}`;
  const radioBlankId = `link-target-blank-${React.useId()}`;

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          {...(tooltipMode === 'native' ? { title: tooltip } : { tooltip })}
          data-slot="link-button"
          type="button"
          variant={isActive ? 'default' : 'ghost'}
          size="sm"
          onMouseDown={(event) => {
            event.preventDefault();
          }}
          className={cn('h-8 w-8 p-0', className)}
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-80 space-y-3 p-3"
        onEscapeKeyDown={() => {
          setOpen(false);
        }}
      >
        <form
          className="space-y-3"
          data-slot="link-form"
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            applyLink();
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor={inputId}>URL</Label>
            <Input
              ref={inputRef}
              id={inputId}
              type="url"
              value={href}
              placeholder="https://example.com"
              data-slot="link-input"
              onKeyDown={(event) => {
                if (event.key === 'Escape') {
                  setOpen(false);
                }
              }}
              onChange={(event) => {
                setHref(event.target.value);
              }}
            />
          </div>

          {allowLinkTarget && (
            <RadioGroup
              value={openTarget}
              onKeyDown={(event) => {
                if (event.key === 'Escape') {
                  setOpen(false);
                }

                if (event.key === 'Enter') {
                  event.preventDefault();
                  applyLink();
                }
              }}
              onValueChange={(value) => {
                setOpenTarget(value as LinkTargetOption);
              }}
              className="gap-2"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem
                  id={radioCurrentId}
                  data-slot="link-target-current"
                  value="current"
                />
                <Label htmlFor={radioCurrentId}>Open in this window</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem
                  id={radioBlankId}
                  data-slot="link-target-blank"
                  value="blank"
                />
                <Label htmlFor={radioBlankId}>Open in new window</Label>
              </div>
            </RadioGroup>
          )}

          <div className="flex items-center justify-between gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={removeLink}
              data-slot="link-remove-button"
              disabled={!editor.isActive('link')}
            >
              Remove
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={!href.trim()}
              data-slot="link-apply-button"
            >
              Apply
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
};

LinkPopoverToolbarButton.displayName = 'LinkPopoverToolbarButton';
