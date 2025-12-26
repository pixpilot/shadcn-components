import type { TabsTrigger as BaseTabsTrigger } from '@pixpilot/shadcn';

export type BaseTabsTriggerProps = React.ComponentProps<typeof BaseTabsTrigger>;
export type TabsTriggerVariant =
  | 'default'
  | 'underline'
  | BaseTabsTriggerProps['variant'];
