'use client';

import {
  cn,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@pixpilot/shadcn';
import { Check } from 'lucide-react';
import { getId } from '../utils';

export interface CommandOptionListItem {
  value: string;
  label: string;
}

export interface CommandOptionListProps {
  id?: string;
  emptyText?: string;
  options: CommandOptionListItem[];
  value?: unknown;
  onChange?: (value: any) => void;
}

const CommandOptionList: React.FC<CommandOptionListProps> = (props) => {
  const { id, options, value, onChange, emptyText = 'No option found.' } = props;

  return (
    <CommandList>
      <CommandEmpty>{emptyText}</CommandEmpty>

      <CommandGroup>
        {options.map((option) => (
          <CommandItem
            key={option.value}
            id={getId(id, `option-${option.value}`)}
            value={option.value}
            onSelect={(currentValue) => {
              onChange?.(currentValue === value ? '' : currentValue);
            }}
          >
            <div className="w-full flex items-center justify-between">
              {option.label}
              <Check
                className={cn(
                  'mr-2 h-4 w-4',
                  value === option.value ? 'opacity-100' : 'opacity-0',
                )}
              />
            </div>
          </CommandItem>
        ))}
      </CommandGroup>
    </CommandList>
  );
};

CommandOptionList.displayName = 'CommandOptionList';

export { CommandOptionList };
