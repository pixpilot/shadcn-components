import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import {
  ColorPickerButton,
  ColorPickerCompactControls,
  ColorPickerRoot,
} from '../../src';

const meta = {
  title: 'shadcn-ui/ColorPickerBase/ColorPickerButton',
  component: ColorPickerButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ColorPickerButton>;

export default meta;
type Story = StoryObj<typeof meta>;

function ColorPickerButtonPreview(props: {
  initialValue?: string;
  placeholder?: string;
  formatDisplayValue?: (value: string) => React.ReactNode;
  showClearButton?: boolean;
  onClear?: () => void;
  slots?: React.ComponentProps<typeof ColorPickerButton>['slots'];
}) {
  const {
    initialValue = 'hsl(217, 91%, 60%)',
    placeholder,
    formatDisplayValue,
    showClearButton = false,
    onClear,
    slots,
  } = props;
  const [value, setValue] = React.useState(initialValue);

  const handleClear = onClear ?? (() => setValue(''));

  return (
    <div data-testid="color-picker-button-preview" className="w-80 space-y-3">
      <div className="text-sm text-muted-foreground">
        Selected color: <span className="font-mono">{value || 'none'}</span>
      </div>
      <ColorPickerRoot value={value} onChange={setValue} format="hsl">
        <ColorPickerButton
          placeholder={placeholder}
          formatDisplayValue={formatDisplayValue}
          onClear={showClearButton ? handleClear : undefined}
          slots={slots}
        />
        <ColorPickerCompactControls presetColors={[]} sections={['picker']} />
      </ColorPickerRoot>
    </div>
  );
}

export const Default: Story = {
  render: () => <ColorPickerButtonPreview />,
};

export const Clearable: Story = {
  render: () => <ColorPickerButtonPreview showClearButton />,
};

export const WithEmptyState: Story = {
  render: () => <ColorPickerButtonPreview initialValue="" placeholder="Choose a color" />,
};

export const WithCustomDisplayValue: Story = {
  render: () => (
    <ColorPickerButtonPreview
      formatDisplayValue={(value) => (
        <span className="inline-flex items-center gap-2">
          <span
            className="h-3 w-3 rounded-full border"
            style={{ backgroundColor: value }}
          />
          <span>{value.toUpperCase()}</span>
        </span>
      )}
    />
  ),
};

export const WithCustomClearButtonSlot: Story = {
  render: () => (
    <ColorPickerButtonPreview
      showClearButton
      slots={{
        clearButton: {
          className: 'size-7 rounded-full border border-border/70 bg-background/80',
          title: 'Clear selected color',
        },
      }}
    />
  ),
};
