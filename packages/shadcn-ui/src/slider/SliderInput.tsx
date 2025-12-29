import { useControlled } from '@internal/hooks';
import { cn, Input } from '@pixpilot/shadcn';
import React from 'react';
import { Slider as ShadcnSlider } from './Slider';

export interface SliderInputProps extends React.ComponentProps<typeof ShadcnSlider> {
  showInput?: boolean;
  input?: React.ComponentProps<'input'>;
  slider?: { className?: string };
}

function clampNumber(input: number, min: number | undefined, max: number | undefined) {
  let value = input;
  if (typeof min === 'number') value = Math.max(min, value);
  if (typeof max === 'number') value = Math.min(max, value);
  return value;
}

const SliderInput: React.FC<SliderInputProps> = (props) => {
  const {
    showInput = true,
    min,
    max,
    step,
    value: valueProp,
    defaultValue,
    disabled,
    className,
    style,
    id,
    input,
    slider,
    ...rest
  } = props;

  const inputKeysRef = React.useRef<string[]>([]);
  const nextKeyIdRef = React.useRef(0);

  const fallbackDefaultValue = React.useMemo<number[]>(() => {
    if (Array.isArray(defaultValue)) return defaultValue;
    if (Array.isArray(valueProp)) return valueProp;
    return [typeof min === 'number' ? min : 0];
  }, [defaultValue, valueProp, min]);

  const [currentValue, setCurrentValue] = useControlled<number[]>({
    controlled: valueProp,
    default: fallbackDefaultValue,
    name: 'SliderInput',
    state: 'value',
  });

  // Ensure stable, non-index keys for each input.
  if (inputKeysRef.current.length !== currentValue.length) {
    if (inputKeysRef.current.length < currentValue.length) {
      const toAdd = currentValue.length - inputKeysRef.current.length;
      for (let j = 0; j < toAdd; j += 1) {
        inputKeysRef.current.push(`slider-input-${nextKeyIdRef.current++}`);
      }
    } else {
      inputKeysRef.current = inputKeysRef.current.slice(0, currentValue.length);
    }
  }

  const handleValueChange = (next: number[]) => {
    setCurrentValue(next);
    props.onValueChange?.(next);
  };

  return (
    <div id={id} className="flex items-center gap-2" style={style}>
      <ShadcnSlider
        {...rest}
        className={slider?.className}
        id={id ?? `${id}-slider`}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        value={currentValue}
        onValueChange={handleValueChange}
      />
      {showInput &&
        Array.isArray(currentValue) &&
        currentValue.map((v, i) => (
          <Input
            id={id ?? `${id}-input-${i}`}
            disabled={disabled}
            {...input}
            key={inputKeysRef.current[i]}
            type="number"
            value={v}
            min={min}
            max={max}
            step={step}
            onChange={(e) => {
              const nextNumber = e.currentTarget.valueAsNumber;
              if (Number.isNaN(nextNumber)) return;

              const next = [...currentValue];
              next[i] = clampNumber(nextNumber, min, max);
              handleValueChange(next);
            }}
            className={cn('w-25', input?.className)}
          />
        ))}
    </div>
  );
};

SliderInput.displayName = 'SliderInput';

export { SliderInput };
