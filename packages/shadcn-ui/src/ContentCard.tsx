import type { ReactNode } from 'react';

import { Card, CardContent, cn } from '@pixpilot/shadcn';
import React from 'react';

interface SectionCardProps extends React.ComponentProps<typeof Card> {
  title?: string;
  children: ReactNode;
  marginBottom?: boolean;
}

export function ContentCard(props: SectionCardProps) {
  const { title, children, className, marginBottom, ...other } = props;

  return (
    <Card
      className={cn('py-4 sm:py-5', { 'mb-2 sm:mb-4': marginBottom }, className)}
      {...other}
    >
      <CardContent className={cn('px-4 sm:px-6')}>
        {title != null && (
          <h2 className={cn('text-xl font-semibold', 'mb-1 sm:mb-2')}>{title}</h2>
        )}
        {children}
      </CardContent>
    </Card>
  );
}

ContentCard.displayName = 'ContentBox';
