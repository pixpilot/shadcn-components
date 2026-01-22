import { cn } from '@pixpilot/shadcn';

export function DialogBody(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn('flex-1 overflow-y-auto', props.className)} />;
}
