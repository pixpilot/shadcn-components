import type { TabsTrigger as BaseTabsTrigger } from '@pixpilot/shadcn';

export type BaseTabsTriggerProps = React.ComponentProps<typeof BaseTabsTrigger>;
export type TabsVariant = 'default' | 'underline' | BaseTabsTriggerProps['variant'];
