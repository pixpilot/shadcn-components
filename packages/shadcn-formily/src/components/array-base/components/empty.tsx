import React from 'react';

export type ArrayEmptyProps = React.HTMLAttributes<HTMLDivElement> & {
  title?: string;
};

export function ArrayEmpty({
  ref,
  ...props
}: ArrayEmptyProps & {
  ref?: React.RefObject<HTMLDivElement | null>;
}) {
  const { title, children, ...rest } = props;
  return (
    <div ref={ref} className="py-4 text-center text-sm text-foreground/50" {...rest}>
      {children ?? title ?? 'No Data'}
    </div>
  );
}
