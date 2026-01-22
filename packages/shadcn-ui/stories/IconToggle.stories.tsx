import type { Meta, StoryObj } from '@storybook/react';
import { Eye, EyeOff, Moon, Pause, Play, Sun, Volume2, VolumeX } from 'lucide-react';
import { useState } from 'react';

import { IconToggle } from '../src/IconToggle';

/**
 * A toggle button component with customizable icons for checked/unchecked states.
 * Perfect for visibility toggles, theme switches, sound controls, or any boolean state with visual feedback.
 */
const meta = {
  title: 'shadcn-ui/IconToggle',
  component: IconToggle,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
      description: 'Size of the toggle button',
    },
    variant: {
      control: 'select',
      options: ['default', 'outline', 'ghost'],
      description: 'Visual style variant of the button',
    },
    checked: {
      control: 'boolean',
      description: 'Checked state (controlled)',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the toggle',
    },
  },
} satisfies Meta<typeof IconToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic visibility toggle with Eye/EyeOff icons
 */
export const VisibilityToggle: Story = {
  args: {
    checkedIcon: <Eye />,
    uncheckedIcon: <EyeOff />,
    defaultChecked: false,
  },
};

/**
 * Theme toggle with Sun/Moon icons
 */
export const ThemeToggle: Story = {
  args: {
    checkedIcon: <Sun />,
    uncheckedIcon: <Moon />,
    defaultChecked: false,
  },
};

/**
 * Volume toggle with Volume2/VolumeX icons
 */
export const VolumeToggle: Story = {
  args: {
    checkedIcon: <Volume2 />,
    uncheckedIcon: <VolumeX />,
    defaultChecked: true,
  },
};

/**
 * Play/Pause toggle
 */
export const PlayPauseToggle: Story = {
  args: {
    checkedIcon: <Pause />,
    uncheckedIcon: <Play />,
    defaultChecked: false,
  },
};

/**
 * Small size variant
 */
export const SmallSize: Story = {
  args: {
    size: 'sm',
    checkedIcon: <Eye />,
    uncheckedIcon: <EyeOff />,
    defaultChecked: false,
  },
};

/**
 * Large size variant
 */
export const LargeSize: Story = {
  args: {
    size: 'lg',
    checkedIcon: <Eye />,
    uncheckedIcon: <EyeOff />,
    defaultChecked: false,
  },
};

/**
 * Outline variant styling
 */
export const OutlineVariant: Story = {
  args: {
    variant: 'outline',
    checkedIcon: <Eye />,
    uncheckedIcon: <EyeOff />,
    defaultChecked: false,
  },
};

/**
 * Ghost variant styling
 */
export const GhostVariant: Story = {
  args: {
    variant: 'ghost',
    checkedIcon: <Eye />,
    uncheckedIcon: <EyeOff />,
    defaultChecked: false,
  },
};

/**
 * Disabled state
 */
export const Disabled: Story = {
  args: {
    checkedIcon: <Eye />,
    uncheckedIcon: <EyeOff />,
    defaultChecked: true,
    disabled: true,
  },
};

/**
 * Controlled usage with state management
 */
export const Controlled: Story = {
  render: function Render() {
    const [isVisible, setIsVisible] = useState(false);

    return (
      <div className="flex flex-col items-center gap-4">
        <IconToggle
          checked={isVisible}
          onCheckedChange={setIsVisible}
          checkedIcon={<Eye />}
          uncheckedIcon={<EyeOff />}
        />
        <p className="text-sm text-muted-foreground">
          Password is {isVisible ? 'visible' : 'hidden'}
        </p>
      </div>
    );
  },
};

/**
 * Multiple toggles with different icons
 */
export const MultipleToggles: Story = {
  render: () => {
    return (
      <div className="flex gap-2">
        <IconToggle
          checkedIcon={<Eye />}
          uncheckedIcon={<EyeOff />}
          defaultChecked={false}
        />
        <IconToggle
          checkedIcon={<Sun />}
          uncheckedIcon={<Moon />}
          defaultChecked={true}
        />
        <IconToggle
          checkedIcon={<Volume2 />}
          uncheckedIcon={<VolumeX />}
          defaultChecked={true}
        />
        <IconToggle
          checkedIcon={<Pause />}
          uncheckedIcon={<Play />}
          defaultChecked={false}
        />
      </div>
    );
  },
};

/**
 * Using with onChange callback
 */
export const WithOnChange: Story = {
  render: function Render() {
    const [logs, setLogs] = useState<string[]>([]);

    const handleChange = (checked: boolean) => {
      const timestamp = new Date().toLocaleTimeString();
      const MAX_LOG_ENTRIES = 5;
      setLogs((prev) =>
        [`[${timestamp}] Toggle changed to: ${checked}`, ...prev].slice(
          0,
          MAX_LOG_ENTRIES,
        ),
      );
    };

    return (
      <div className="flex flex-col items-center gap-4">
        <IconToggle
          checkedIcon={<Eye />}
          uncheckedIcon={<EyeOff />}
          onChange={handleChange}
          defaultChecked={false}
        />
        <div className="w-64">
          <p className="mb-2 text-sm font-medium">Change Log:</p>
          <div className="space-y-1 rounded-md border border-border bg-muted/30 p-2">
            {logs.length === 0 ? (
              <p className="text-xs text-muted-foreground">No changes yet</p>
            ) : (
              logs.map((log) => (
                <p key={log} className="text-xs font-mono">
                  {log}
                </p>
              ))
            )}
          </div>
        </div>
      </div>
    );
  },
};

/**
 * Using SVG markup strings as icons
 * Useful for custom icons or when you need to pass icons dynamically as strings
 */
export const WithSVGStrings: Story = {
  args: {
    checkedIcon:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
    uncheckedIcon:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>',
    defaultChecked: false,
  },
};

/**
 * Custom clock/timer icons using SVG strings
 */
export const CustomClockIcons: Story = {
  args: {
    checkedIcon:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    uncheckedIcon:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>',
    defaultChecked: false,
  },
};

/**
 * Heart/favorite toggle with SVG strings
 */
export const HeartToggleSVG: Story = {
  args: {
    checkedIcon:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
    uncheckedIcon:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
    defaultChecked: false,
  },
};

/**
 * Mix of React components and SVG strings
 */
export const MixedIconTypes: Story = {
  render: () => {
    return (
      <div className="flex gap-2">
        <IconToggle
          checkedIcon={<Eye />}
          uncheckedIcon={<EyeOff />}
          defaultChecked={false}
        />
        <IconToggle
          checkedIcon='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>'
          uncheckedIcon='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>'
          defaultChecked={false}
        />
        <IconToggle
          checkedIcon={<Volume2 />}
          uncheckedIcon={<VolumeX />}
          defaultChecked={true}
        />
      </div>
    );
  },
};

/**
 * All size variants comparison
 */
export const AllSizes: Story = {
  render: () => {
    return (
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center gap-2">
          <IconToggle
            size="sm"
            checkedIcon={<Eye />}
            uncheckedIcon={<EyeOff />}
            defaultChecked={false}
          />
          <span className="text-xs text-muted-foreground">Small</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <IconToggle
            size="default"
            checkedIcon={<Eye />}
            uncheckedIcon={<EyeOff />}
            defaultChecked={false}
          />
          <span className="text-xs text-muted-foreground">Default</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <IconToggle
            size="lg"
            checkedIcon={<Eye />}
            uncheckedIcon={<EyeOff />}
            defaultChecked={false}
          />
          <span className="text-xs text-muted-foreground">Large</span>
        </div>
      </div>
    );
  },
};

/**
 * All variants comparison
 */
export const AllVariants: Story = {
  render: () => {
    return (
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center gap-2">
          <IconToggle
            variant="default"
            checkedIcon={<Eye />}
            uncheckedIcon={<EyeOff />}
            defaultChecked={false}
          />
          <span className="text-xs text-muted-foreground">Default</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <IconToggle
            variant="outline"
            checkedIcon={<Eye />}
            uncheckedIcon={<EyeOff />}
            defaultChecked={false}
          />
          <span className="text-xs text-muted-foreground">Outline</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <IconToggle
            variant="ghost"
            checkedIcon={<Eye />}
            uncheckedIcon={<EyeOff />}
            defaultChecked={false}
          />
          <span className="text-xs text-muted-foreground">Ghost</span>
        </div>
      </div>
    );
  },
};
