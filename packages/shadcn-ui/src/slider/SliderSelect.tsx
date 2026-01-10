import type { ComponentProps } from 'react';

import { useControlled } from '@internal/hooks';
import { cn } from '@pixpilot/shadcn';
import React from 'react';
import { Select } from '../Select';
import { Slider as ShadcnSlider } from './Slider';

export type SliderSelectValue = string | number;

export type SliderSelectOption =
  | SliderSelectValue
  | {
      value: SliderSelectValue;
      label?: string;
    };

type SliderSelectSelectProps = Omit<
  ComponentProps<typeof Select>,
  'options' | 'value' | 'onChange'
> & {
  containerClassName?: string;
};

export interface SliderSelectProps extends Omit<
  ComponentProps<typeof ShadcnSlider>,
  'min' | 'max' | 'step' | 'value' | 'defaultValue' | 'onValueChange'
> {
  options: SliderSelectOption[];
  value?: SliderSelectValue;
  defaultValue?: SliderSelectValue;
  onValueChange?: (value: SliderSelectValue) => void;
  showSelect?: boolean;
  select?: SliderSelectSelectProps;
  slider?: { className?: string };
}

function normalizeOptions(options: SliderSelectOption[]) {
  return options.map((option) => {
    if (typeof option === 'object' && option !== null && 'value' in option) {
      return {
        value: option.value,
        label: option.label ?? String(option.value),
      };
    }
    return {
      value: option,
      label: String(option),
    };
  });
}

const SliderSelect: React.FC<SliderSelectProps> = (props) => {
  const {
    options,
    value: valueProp,
    defaultValue,
    onValueChange,
    disabled,
    id,
    className,
    style,
    showSelect = true,
    select,
    slider,
    ...rest
  } = props;

  const { containerClassName: selectContainerClassName, ...selectProps } = select ?? {};

  const normalizedOptions = React.useMemo(() => normalizeOptions(options), [options]);
  const hasOptions = normalizedOptions.length > 0;

  const fallbackDefaultValue = React.useMemo<SliderSelectValue>(() => {
    if (defaultValue !== undefined) return defaultValue;
    if (valueProp !== undefined) return valueProp;
    return hasOptions ? normalizedOptions[0]!.value : '';
  }, [defaultValue, valueProp, hasOptions, normalizedOptions]);

  const [currentValue, setCurrentValue] = useControlled<SliderSelectValue>({
    controlled: valueProp,
    default: fallbackDefaultValue,
    name: 'SliderSelect',
    state: 'value',
  });

  const currentIndex = React.useMemo(() => {
    const idx = normalizedOptions.findIndex((o) => o.value === currentValue);
    return idx >= 0 ? idx : 0;
  }, [currentValue, normalizedOptions]);

  const handleOptionChange = (nextValue: SliderSelectValue) => {
    setCurrentValue(nextValue);
    onValueChange?.(nextValue);
  };

  return (
    <div id={id} className={cn('flex items-center gap-2', className)} style={style}>
      <ShadcnSlider
        {...rest}
        className={slider?.className}
        id={id != null ? `${id}-slider` : undefined}
        min={0}
        max={Math.max(0, normalizedOptions.length - 1)}
        step={1}
        disabled={disabled || !hasOptions}
        value={[currentIndex]}
        onValueChange={(next) => {
          const index = next[0] ?? 0;
          const safeIndex = Math.max(0, Math.min(index, normalizedOptions.length - 1));
          const option = normalizedOptions[safeIndex];
          if (!option) return;
          handleOptionChange(option.value);
        }}
      />

      {showSelect && (
        <div className={cn('w-28', selectContainerClassName)}>
          <Select
            {...selectProps}
            contentProps={{
              position: 'item-aligned',
              ...selectProps.contentProps,
            }}
            options={normalizedOptions.map((o) => ({
              value: o.value,
              label: o.label,
            }))}
            value={String(currentValue ?? '')}
            onChange={(v) => {
              const matched = normalizedOptions.find((o) => String(o.value) === v);
              if (!matched) return;
              handleOptionChange(matched.value);
            }}
            disabled={disabled || !hasOptions}
          />
        </div>
      )}
    </div>
  );
};

SliderSelect.displayName = 'SliderSelect';

export { SliderSelect };
