import type { FC } from 'react';
import { connect } from '@formily/react';
import { Label, RadioGroup, RadioGroupItem } from '@pixpilot/shadcn';

export interface RadioGroupOption {
  value: string;
  label: string;
}

/**
 * Formily-connected Radio Group component
 */
const BaseRadioGroup = RadioGroup;

type RadioProps = {
  options?: RadioGroupOption[];
  value?: string;
  onChange?: (value: string) => void;
} & Omit<React.ComponentType<typeof RadioGroup>, 'value' | 'onValueChange' | 'children'>;

/**
 * Radio component with options rendering
 */
export function Radio(props: RadioProps) {
  const { options, value = '', onChange, ...restProps } = props;

  return (
    <BaseRadioGroup value={value} onValueChange={onChange} {...restProps}>
      {options?.map((option) => (
        <div key={option.value} className="flex items-center space-x-2">
          <RadioGroupItem value={option.value} id={`radio-${option.value}`} />
          <Label htmlFor={`radio-${option.value}`}>{option.label}</Label>
        </div>
      ))}
    </BaseRadioGroup>
  );
}

Radio.displayName = 'Radio';

export const ConnectedRadio: FC = connect(Radio);
