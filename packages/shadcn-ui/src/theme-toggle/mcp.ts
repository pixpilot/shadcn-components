import type { ComponentMeta } from '@internal/mcp';
import type { ThemeModeToggleButtonProps } from './ThemeModeToggleButton';
import { defineProps } from '@internal/mcp';

// Derive the documented prop set from the component's own props type so that
// adding a prop to `ThemeModeToggleButtonProps` is a compile error until it is
// documented here.
type ThemeModeToggleButtonDocumentedProps = Extract<
  keyof ThemeModeToggleButtonProps,
  string
>;

export const meta: ComponentMeta<ThemeModeToggleButtonDocumentedProps> = {
  name: 'ThemeModeToggleButton',
  category: 'Utilities',
  description:
    'A pure light/dark toggle icon button. The folder also exports ThemeModeDropdown, ThemeModeSwitchInside, and ThemeModeSwitchOutside for other theme-switching UIs.',
  htmlElement: 'button',
  props: defineProps<ThemeModeToggleButtonDocumentedProps>({
    id: 'Optional id attribute applied to the toggle button.',
    className: 'Additional CSS class applied to the toggle button.',
    value: {
      description: 'The current resolved theme.',
      type: '"light" | "dark"',
    },
    onChange: {
      description: 'Called with the next theme when toggled.',
      type: '(theme: string) => void',
    },
    disabled: 'Disables the toggle button.',
  }),
  notes: [
    'This is a controlled, presentation-only component; wire value/onChange to next-themes (e.g. via useTheme) yourself.',
    'Related components in this folder: ThemeModeDropdown, ThemeModeSwitchInside, ThemeModeSwitchOutside.',
  ],
  examples: [
    {
      title: 'With next-themes',
      code: 'const { resolvedTheme, setTheme } = useTheme();\n<ThemeModeToggleButton value={resolvedTheme} onChange={setTheme} />',
    },
  ],
  related: ['ThemeProvider'],
  keywords: ['theme', 'dark mode', 'toggle', 'light', 'switch'],
};
