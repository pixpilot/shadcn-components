import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Combobox } from '../src/Combobox';

/**
 * A searchable combobox component with dropdown options.
 * Allows users to search and select from a list of options.
 */
const meta = {
  title: 'shadcn-ui/Combobox',
  component: Combobox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Placeholder text when no value is selected',
    },
    searchPlaceholder: {
      control: 'text',
      description: 'Placeholder text for the search input',
    },
    emptyText: {
      control: 'text',
      description: 'Text shown when no options match the search',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 300 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default combobox with basic options
 */
export const Default: Story = {
  args: {
    options: [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
      { value: 'cherry', label: 'Cherry' },
      { value: 'date', label: 'Date' },
      { value: 'elderberry', label: 'Elderberry' },
    ],
    placeholder: 'Select a fruit...',
    searchPlaceholder: 'Search fruits...',
    emptyText: 'No fruit found.',
  },
  render: function DefaultCombobox(args) {
    const [value, setValue] = useState<string>('');

    const handleChange = (newValue: string) => setValue(newValue);

    // eslint-disable-next-line ts/no-unsafe-assignment
    return <Combobox {...args} value={value} onChange={handleChange as any} />;
  },
};

/**
 * Combobox with pre-selected value
 */
export const WithValue: Story = {
  args: {
    options: [
      { value: 'react', label: 'React' },
      { value: 'vue', label: 'Vue.js' },
      { value: 'angular', label: 'Angular' },
      { value: 'svelte', label: 'Svelte' },
      { value: 'ember', label: 'Ember.js' },
    ],
    placeholder: 'Select a framework...',
    searchPlaceholder: 'Search frameworks...',
    emptyText: 'No framework found.',
  },
  render: function WithValueCombobox(args) {
    const [value, setValue] = useState<string>('react');

    const handleChange = (newValue: string) => setValue(newValue);

    // eslint-disable-next-line ts/no-unsafe-assignment
    return <Combobox {...args} value={value} onChange={handleChange as any} />;
  },
};
