import type { ReactNode } from 'react';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../card';

interface SectionCardProps extends React.ComponentProps<typeof Card> {
  title?: string;
  children: ReactNode;
  marginBottom?: boolean;
}

export function ContentCard(props: SectionCardProps) {
  const { title, children, ...other } = props;

  return (
    <Card {...other}>
      {title != null && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
    </Card>
  );
}

ContentCard.displayName = 'ContentBox';
