import React from 'react';
import { useArray } from '../array-context';

export interface ArrayTitleProps {
  title?: string;
}

export const ArrayTitle: React.FC<ArrayTitleProps> = (props) => {
  const array = useArray();

  if (!array) return null;

  const { field } = array;

  return <span>{props.title ?? (field.title as string) ?? ''}</span>;
};
