import * as React from 'react';
import { Toaster as ToasterBase } from 'sonner';

export function Toaster(props: React.ComponentProps<typeof ToasterBase>) {
  return (
    <ToasterBase
      {...props}
      style={{ ...props.style, pointerEvents: 'auto' }}
      toastOptions={{
        ...props.toastOptions,
        style: { ...props.toastOptions?.style, pointerEvents: 'auto' },
      }}
    />
  );
}
