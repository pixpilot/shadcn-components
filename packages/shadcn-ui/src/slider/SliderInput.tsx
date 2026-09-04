import type { InputProps } from '@pixpilot/shadcn-ui';
import { useControlled } from '@internal/hooks';
import { cn, getId, Input } from '@pixpilot/shadcn-ui';
import React from 'react';
import { Slider as ShadcnSlider } from './Slider';
import { clampNumber, getInputBound, toFiniteNumber } from './utils/slider-input-bounds';

export interface SliderInputProps extends React.ComponentProps<typeof ShadcnSlider> {
  showInput?: boolean;
  /** Default true; preserves any higher maximum entered into an input. */
  autoExpandMax?: boolean;
  /** Default true; preserves any lower minimum entered into an input. */
  autoExpandMin?: boolean;
  /** Input props; set `min` or `max` to undefined to omit the inherited bound. */
  input?: InputProps;
  slider?: { className?: string };
}

const SliderInput: React.FC<SliderInputProps> = (props) => {
  const {
    showInput = true,
    autoExpandMax = true,
    autoExpandMin = true,
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

  const inputMin = getInputBound(input, 'min', min);
  const inputMax = getInputBound(input, 'max', max);
  const inputMinNumber = toFiniteNumber(inputMin);
  const inputMaxNumber = toFiniteNumber(inputMax);
  const configuredSliderMin = min ?? 0;
  const configuredSliderMax = max ?? 100;
  const [inputDrivenBounds, setInputDrivenBounds] = React.useState(() => ({
    min: Math.min(configuredSliderMin, ...currentValue),
    max: Math.max(configuredSliderMax, ...currentValue),
  }));
  const sliderMin = autoExpandMin
    ? Math.min(configuredSliderMin, inputDrivenBounds.min, ...currentValue)
    : configuredSliderMin;
  const sliderMax = autoExpandMax
    ? Math.max(configuredSliderMax, inputDrivenBounds.max, ...currentValue)
    : configuredSliderMax;
  const sliderValue = currentValue.map((value) =>
    clampNumber(value, sliderMin, sliderMax),
  );

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
    <div
      id={getId(id, 'slider-container')}
      className="flex items-center gap-2"
      style={style}
    >
      <ShadcnSlider
        {...rest}
        className={slider?.className}
        id={id}
        min={sliderMin}
        max={sliderMax}
        step={step}
        disabled={disabled}
        value={sliderValue}
        onValueChange={handleValueChange}
      />
      {showInput &&
        Array.isArray(currentValue) &&
        currentValue.map((v, i) => (
          <Input
            id={getId(id, `input-${i}`)}
            disabled={disabled}
            {...input}
            key={inputKeysRef.current[i]}
            type="number"
            value={v}
            min={inputMin}
            max={inputMax}
            step={step}
            onChange={(e) => {
              const nextNumber = e.currentTarget.valueAsNumber;
              if (Number.isNaN(nextNumber)) return;

              const next = [...currentValue];
              next[i] = clampNumber(nextNumber, inputMinNumber, inputMaxNumber);
              setInputDrivenBounds((currentBounds) => ({
                min: Math.min(currentBounds.min, ...next),
                max: Math.max(currentBounds.max, ...next),
              }));
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
