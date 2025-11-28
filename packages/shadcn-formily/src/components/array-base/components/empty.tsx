import React from 'react';

export const ArrayEmpty = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { title?: string }
>((props, ref) => {
  const { title, children, ...rest } = props;
  return (
    <div ref={ref} className="py-4 text-center text-sm text-foreground/50" {...rest}>
      {children ?? title ?? 'No Data'}
    </div>
  );
});
