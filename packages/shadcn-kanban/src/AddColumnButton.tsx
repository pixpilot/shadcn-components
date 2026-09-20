'use client';

import { cn } from '@pixpilot/shadcn-ui';
import { Plus, X } from 'lucide-react';
import React from 'react';

interface AddColumnButtonProps {
  onAdd: (title: string) => void;
  className?: string;
}

/**
 * A button + inline popover that lets the user type a column name
 * and add it to the Kanban board.
 */
export function AddColumnButton({ onAdd, className }: AddColumnButtonProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleOpen = () => {
    setOpen(true);
    /* Focus the input after the popover mounts. */
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const handleClose = () => {
    setOpen(false);
    setValue('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed.length === 0) return;
    onAdd(trimmed);
    handleClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={handleOpen}
        className={cn(
          'flex min-w-[250px] shrink-0 cursor-pointer items-center justify-center gap-2',
          'border-muted-foreground/30 rounded-lg border-2 border-dashed',
          'bg-muted/20 text-muted-foreground p-4 text-sm',
          'hover:border-primary/40 hover:bg-muted/40 hover:text-foreground transition-colors',
          className,
        )}
      >
        <Plus className="h-4 w-4" />
        Add column
      </button>
    );
  }

  return (
    <div
      className={cn(
        'bg-muted/40 flex min-w-[250px] shrink-0 flex-col gap-3 rounded-lg border p-3',
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">New column</span>
        <button
          type="button"
          onClick={handleClose}
          className="text-muted-foreground hover:text-foreground rounded p-0.5 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          ref={inputRef}
          type="text"
          placeholder="Column name…"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className={cn(
            'bg-background rounded-md border px-3 py-1.5 text-sm',
            'placeholder:text-muted-foreground',
            'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
          )}
        />
        <button
          type="submit"
          disabled={value.trim().length === 0}
          className={cn(
            'bg-primary text-primary-foreground rounded-md px-3 py-1.5 text-sm font-medium',
            'hover:bg-primary/90 transition-colors',
            'disabled:cursor-not-allowed disabled:opacity-50',
          )}
        >
          Add
        </button>
      </form>
    </div>
  );
}
