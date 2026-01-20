import type { Meta, StoryObj } from '@storybook/react';
import type { IconProviderProps } from '../src/icon-selector/types';
import faIcons from '@iconify-json/fa/icons.json';
import mdiIcons from '@iconify-json/mdi/icons.json';
import { addAPIProvider } from '@iconify/react';
import { useCallback, useState } from 'react';
import { IconPicker } from '../src/icon-selector/IconPicker';

// Constants for magic numbers
const MAX_CHANGELOG_ENTRIES = 5;
const DELAY_FA_LOAD = 3000;
const DELAY_VALID_LOAD = 500;
const DELAY_FAIL_LOAD = 800;
const DELAY_INVALID_LOAD = 600;
const DELAY_MDI_LOAD = 1000;

/**
 * Icon Selector Component
 * Allows users to select an icon from multiple icon providers via a dialog or popover
 *
 * <p>By default, Iconify uses its own API for icon data.</p>
 * <p>To use your own icon server, create your own provider like:</p>
 * ```js
 * import { addAPIProvider } from '@iconify/react';
 *
 * addAPIProvider('', {
 *   resources: [myServerUrl],
 *   path: '/api/iconify/',
 * });
 * ```
 * <p>Read more: <a href="https://iconify.design/docs/iconify-icon/add-api-provider.html#web-component-function-addapiprovider">here</a></p>
 * <p>In this Storybook setup, we override the default to use the local Storybook server with MSW mocks.</p>
 */
const meta = {
  title: 'shadcn-ui/IconPicker',
  component: IconPicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: 'Currently selected icon value (e.g., "mdi:heart")',
    },
    onChange: {
      description: 'Callback when an icon is selected',
      action: 'icon-changed',
    },

    pickerMode: {
      control: 'select',
      options: ['dialog', 'popover'] as const,
      description: 'Display mode: dialog (always modal) or popover (responsive)',
    },
    variant: {
      control: 'select',
      options: ['default', 'icon-button'] as const,
      description:
        'Component variant: default shows icon with text, icon-button is compact',
    },
    providers: {
      description: 'Array of icon providers with available icons',
    },
    popover: {
      description: 'Popover configuration options (Partial<PopoverContent props>)',
    },
    isLoading: {
      control: 'boolean',
      description: 'Show loading state overlay',
    },
    showValueText: {
      control: 'boolean',
      description: 'Toggle rendering the selected icon text label',
    },
    emptyText: {
      control: 'text',
      description: 'Text to display when no icon is selected',
    },
    showClearButton: {
      control: 'boolean',
      description: 'Toggle the clear button when an icon is selected',
    },
  },
} satisfies Meta<typeof IconPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

const iconifyServer =
  typeof window !== 'undefined' ? window.location.origin : 'http://localhost:6006';

// Remove the default Iconify API provider to use our custom one
// It use MSW to mock the API requests in storybook
addAPIProvider('', {
  resources: [iconifyServer],
  path: '/api/iconify/',
});

// Mock icon providers for stories
function createMockProviders(): IconProviderProps[] {
  return [
    {
      name: 'Material Design Icons',
      prefix: 'mdi',
      icons: [
        'heart',
        'star',
        'check',
        'close',
        'arrow-right',
        'bell',
        'cog',
        'account',
        'camera',
        'cloud',
      ],
    },
    {
      name: 'Font Awesome',
      prefix: 'fa',
      icons: [
        'home',
        'user',
        'search',
        'envelope',
        'phone',
        'lock',
        'download',
        'upload',
        'calendar',
        'comment',
      ],
    },
    {
      name: 'Tabler Icons',
      prefix: 'tabler',
      icons: [
        'activity',
        'alarm',
        'album',
        'alert-circle',
        'align-center',
        'anchor',
        'aperture',
        'archive',
        'arrow-back',
        'arrow-bar-down',
      ],
    },
  ];
}

/**
 * Default icon selector with dialog mode and default variant
 */
export const Default: Story = {
  args: {
    value: '',
    pickerMode: 'dialog',
    variant: 'default',
    providers: createMockProviders(),
  },
  render: function DefaultStory(args) {
    const [value, setValue] = useState<string>(args.value ?? '');

    return (
      <IconPicker
        {...args}
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
          args.onChange?.(newValue);
        }}
      />
    );
  },
};

/**
 * Icon selector with pre-selected icon value
 */
export const WithSelectedIcon: Story = {
  args: {
    value: 'mdi:heart',
    pickerMode: 'dialog',
    variant: 'default',
    providers: createMockProviders(),
  },
  render: function WithSelectedIconStory(args) {
    const [value, setValue] = useState<string>(args.value ?? '');

    return (
      <IconPicker
        {...args}
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
          args.onChange?.(newValue);
        }}
      />
    );
  },
};

/**
 * Hide value text and show dash when empty
 */
export const HideValueTextAndDash: Story = {
  args: {
    value: '',
    pickerMode: 'dialog',
    variant: 'default',
    providers: createMockProviders(),
    showValueText: false,
    emptyText: '-',
  },
  render: function HideValueTextAndDashStory(args) {
    const [value, setValue] = useState<string>(args.value ?? '');

    return (
      <IconPicker
        {...args}
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
          args.onChange?.(newValue);
        }}
      />
    );
  },
};

/**
 * Icon button variant - compact icon-only selector
 */
export const IconButtonVariant: Story = {
  args: {
    value: '',
    pickerMode: 'dialog',
    variant: 'icon-button',
    providers: createMockProviders(),
  },
  render: function IconButtonVariantStory(args) {
    const [value, setValue] = useState<string>(args.value ?? '');

    return (
      <IconPicker
        {...args}
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
          args.onChange?.(newValue);
        }}
      />
    );
  },
};

/**
 * Icon button variant with pre-selected icon
 */
export const IconButtonWithIcon: Story = {
  args: {
    value: 'mdi:star',
    pickerMode: 'dialog',
    variant: 'icon-button',
    providers: createMockProviders(),
  },
  render: function IconButtonWithIconStory(args) {
    const [value, setValue] = useState<string>(args.value ?? '');

    return (
      <IconPicker
        {...args}
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
          args.onChange?.(newValue);
        }}
      />
    );
  },
};

/**
 * Clear button visible when value exists
 */
export const ClearButton: Story = {
  args: {
    pickerMode: 'dialog',
    variant: 'default',
    providers: createMockProviders(),
    showClearButton: true,
  },
  render: function ClearButtonStory(args) {
    const [defaultValue, setDefaultValue] = useState<string>('mdi:heart');
    const [iconButtonValue, setIconButtonValue] = useState<string>('mdi:star');

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <IconPicker
          {...args}
          value={defaultValue}
          onChange={(newValue) => {
            setDefaultValue(newValue);
            args.onChange?.(newValue);
          }}
        />
        <IconPicker
          {...args}
          variant="icon-button"
          value={iconButtonValue}
          onChange={(newValue) => {
            setIconButtonValue(newValue);
            args.onChange?.(newValue);
          }}
        />
      </div>
    );
  },
};

/**
 * Dialog mode - always displays as a modal dialog
 */
export const DialogMode: Story = {
  args: {
    value: '',
    pickerMode: 'dialog',
    variant: 'default',
    providers: createMockProviders(),
  },
  render: function DialogModeStory(args) {
    const [value, setValue] = useState<string>(args.value ?? '');

    return (
      <IconPicker
        {...args}
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
          args.onChange?.(newValue);
        }}
      />
    );
  },
};

/**
 * Popover mode - displays as popover on desktop, dialog on mobile
 */
export const PopoverMode: Story = {
  args: {
    value: '',
    pickerMode: 'popover',
    variant: 'default',
    providers: createMockProviders(),
  },
  render: function PopoverModeStory(args) {
    const [value, setValue] = useState<string>(args.value ?? '');

    return (
      <IconPicker
        {...args}
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
          args.onChange?.(newValue);
        }}
      />
    );
  },
};

/**
 * Single provider with limited icons
 */
export const SingleProvider: Story = {
  args: {
    value: '',
    pickerMode: 'dialog',
    variant: 'default',
    providers: [
      {
        name: 'Material Design Icons',
        prefix: 'mdi',
        icons: [
          'mdi:heart',
          'mdi:star',
          'mdi:check',
          'mdi:close',
          'mdi:arrow-right',
          'mdi:bell',
        ],
      },
    ],
  },
  render: function SingleProviderStory(args) {
    const [value, setValue] = useState<string>(args.value ?? '');

    return (
      <IconPicker
        {...args}
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
          args.onChange?.(newValue);
        }}
      />
    );
  },
};

/**
 * Multiple providers with various icon sets
 */
export const MultipleProviders: Story = {
  args: {
    value: '',
    pickerMode: 'dialog',
    variant: 'default',
    providers: createMockProviders(),
  },
  render: function MultipleProvidersStory(args) {
    const [value, setValue] = useState<string>(args.value ?? '');

    return (
      <IconPicker
        {...args}
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
          args.onChange?.(newValue);
        }}
      />
    );
  },
};

/**
 * With custom popover configuration
 */
export const WithPopoverConfig: Story = {
  args: {
    value: '',
    pickerMode: 'popover',
    variant: 'default',
    providers: createMockProviders(),
    popover: {
      align: 'start',
      side: 'right',
    },
  },
  render: function WithPopoverConfigStory(args) {
    const [value, setValue] = useState<string>(args.value ?? '');

    return (
      <IconPicker
        {...args}
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
          args.onChange?.(newValue);
        }}
      />
    );
  },
};

/**
 * Interactive example showing value changes
 */
export const Interactive: Story = {
  args: {
    value: '',
    pickerMode: 'dialog',
    variant: 'default',
    providers: createMockProviders(),
  },
  render: function InteractiveStory(args) {
    const [value, setValue] = useState<string>('mdi:heart');
    const [changeLog, setChangeLog] = useState<string[]>(['Initial: mdi:heart']);

    const handleChange = (newValue: string) => {
      setValue(newValue);
      setChangeLog((prev) => [...prev, `Changed to: ${newValue}`]);
      args.onChange?.(newValue);
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <IconPicker {...args} value={value} onChange={handleChange} />
        <div style={{ fontSize: '0.875rem', color: '#666' }}>
          <p style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>Change Log:</p>
          <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
            {changeLog.slice(-MAX_CHANGELOG_ENTRIES).map((log, idx) => (
              // eslint-disable-next-line react/no-array-index-key
              <li key={idx}>{log}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  },
};

export const WithLazyLoading: Story = {
  args: {
    value: '',
    pickerMode: 'dialog',
    variant: 'default',
    providers: [],
    isLoading: false,
  },
  render: function WithLazyLoadingStory(args) {
    const [value, setValue] = useState<string>(args.value ?? '');

    const loadFontAwesomeAsync = useCallback(async () => {
      return new Promise<IconProviderProps>((resolve) => {
        setTimeout(() => {
          resolve({
            name: 'Material Design Icons',
            prefix: 'mdi',
            icons: Object.keys(mdiIcons.icons),
          });
        }, DELAY_FA_LOAD);
      });
    }, []);

    return (
      <IconPicker
        {...args}
        providers={[loadFontAwesomeAsync]}
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
          args.onChange?.(newValue);
        }}
      />
    );
  },
};

/**
 * Multiple async providers loading in parallel
 * Demonstrates the caching mechanism - providers won't reload on re-open
 */
export const MultipleAsyncProviders: Story = {
  args: {
    value: '',
    pickerMode: 'dialog',
    variant: 'default',
    providers: [],
  },
  render: function MultipleAsyncProvidersStory(args) {
    const [value, setValue] = useState<string>(args.value ?? '');
    const [log, setLog] = useState<string[]>([]);

    const addLog = useCallback((message: string) => {
      setLog((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    }, []);

    const loadMdiAsync = useCallback(async () => {
      addLog('Loading MDI icons...');
      return new Promise<IconProviderProps>((resolve) => {
        setTimeout(() => {
          addLog('MDI icons loaded');
          resolve({
            name: 'Material Design Icons',
            prefix: 'mdi',
            icons: Object.keys(mdiIcons.icons),
          });
          // eslint-disable-next-line no-magic-numbers
        }, 1500);
      });
    }, [addLog]);

    const loadFaAsync = useCallback(async () => {
      addLog('Loading Font Awesome icons...');
      return new Promise<IconProviderProps>((resolve) => {
        setTimeout(() => {
          addLog('Font Awesome icons loaded');
          resolve({
            name: 'Font Awesome',
            prefix: 'fa',
            icons: Object.keys(faIcons.icons),
          });
          // eslint-disable-next-line no-magic-numbers
        }, 2000);
      });
    }, [addLog]);

    // Memoize the providers array to prevent re-triggering the effect
    const providersArray = [loadMdiAsync, loadFaAsync];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <IconPicker
          {...args}
          providers={providersArray}
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
            args.onChange?.(newValue);
          }}
          onProvidersLoaded={(loadedProviders) => {
            addLog(
              `All providers loaded: ${loadedProviders.map((p) => p.name).join(', ')}`,
            );
          }}
        />
        <div
          style={{
            fontSize: '0.875rem',
            maxHeight: '200px',
            overflow: 'auto',
            padding: '0.5rem',
            borderRadius: '4px',
          }}
        >
          <p style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Loading Log (Close and re-open to see caching):
          </p>
          <ul style={{ margin: 0, paddingLeft: '1.5rem', listStyle: 'none' }}>
            {log.map((entry, idx) => (
              // eslint-disable-next-line react/no-array-index-key
              <li key={idx} style={{ fontSize: '0.75rem' }}>
                {entry}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  },
};

/**
 * Error handling demonstration - shows how errors are handled gracefully
 */
export const WithErrorHandling: Story = {
  args: {
    value: '',
    pickerMode: 'dialog',
    variant: 'default',
    providers: [],
  },
  render: function WithErrorHandlingStory(args) {
    const [value, setValue] = useState<string>(args.value ?? '');
    const [errors, setErrors] = useState<string[]>([]);

    const loadValidProvider = useCallback(async () => {
      return new Promise<IconProviderProps>((resolve) => {
        setTimeout(() => {
          resolve({
            name: 'Valid Provider',
            prefix: 'valid',
            icons: ['check', 'star', 'heart'],
          });
        }, DELAY_VALID_LOAD);
      });
    }, []);

    const loadFailingProvider = useCallback(async () => {
      return new Promise<IconProviderProps>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Network error: Failed to fetch icons'));
        }, DELAY_FAIL_LOAD);
      });
    }, []);

    const loadInvalidProvider = useCallback(async () => {
      // This will fail validation (missing required fields)
      return new Promise<IconProviderProps>((resolve) => {
        setTimeout(() => {
          resolve({
            name: 'Invalid Provider',
            // Missing 'prefix' and 'icons' - will be filtered out
          } as IconProviderProps);
        }, DELAY_INVALID_LOAD);
      });
    }, []);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <IconPicker
          {...args}
          providers={[loadValidProvider, loadFailingProvider, loadInvalidProvider]}
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
            args.onChange?.(newValue);
          }}
          onProvidersLoaded={(providers) => {
            setErrors((prev) => [
              ...prev,
              `✓ Successfully loaded ${providers.length} provider(s)`,
            ]);
          }}
        />
        <div
          style={{
            fontSize: '0.875rem',
            padding: '0.5rem',
            background: errors.some((e) => e.includes('✓')) ? '#e8f5e9' : '#fff3e0',
            borderRadius: '4px',
            border: '1px solid',
            borderColor: errors.some((e) => e.includes('✓')) ? '#4caf50' : '#ff9800',
          }}
        >
          <p style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>Error Log:</p>
          <ul style={{ margin: 0, paddingLeft: '1.5rem', listStyle: 'none' }}>
            {errors.length === 0 && (
              <li style={{ fontSize: '0.75rem', color: '#666' }}>
                Open the picker to see error handling...
              </li>
            )}
            {errors.map((error) => (
              <li
                key={error}
                style={{
                  fontSize: '0.75rem',
                  color: error.includes('✓') ? '#2e7d32' : '#e65100',
                }}
              >
                {error}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  },
};

/**
 * Performance demonstration with large icon sets
 * Shows optimized search with pre-computed lowercase names
 */
export const LargeIconSet: Story = {
  args: {
    value: '',
    pickerMode: 'dialog',
    variant: 'default',
    providers: [],
  },
  render: function LargeIconSetStory(args) {
    const [value, setValue] = useState<string>(args.value ?? '');

    const loadLargeIconSet = useCallback(async () => {
      return new Promise<IconProviderProps>((resolve) => {
        setTimeout(() => {
          resolve({
            name: 'Material Design Icons',
            prefix: 'mdi',
            icons: Object.keys(mdiIcons.icons), // ~7000+ icons
          });
        }, DELAY_MDI_LOAD);
      });
    }, []);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <IconPicker
          {...args}
          providers={[loadLargeIconSet]}
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
            args.onChange?.(newValue);
          }}
          onProvidersLoaded={(providers) => {
            const totalIcons = providers.reduce(
              (sum, _p) => sum + Object.keys(mdiIcons.icons).length,
              0,
            );
            console.warn(
              `Loaded ${totalIcons} icons across ${providers.length} provider(s)`,
            );
          }}
        />
        <div
          style={{
            fontSize: '0.875rem',
            padding: '0.5rem',
            borderRadius: '4px',
          }}
        >
          <p style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>Performance Info:</p>
          <ul style={{ margin: 0, paddingLeft: '1.5rem', fontSize: '0.75rem' }}>
            <li>Icons are virtualized for optimal performance</li>
            <li>
              Search uses pre-computed lowercase names (no toLowerCase() per keystroke)
            </li>
            <li>Providers are cached (won't reload when closing/reopening the picker)</li>
          </ul>
        </div>
      </div>
    );
  },
};
