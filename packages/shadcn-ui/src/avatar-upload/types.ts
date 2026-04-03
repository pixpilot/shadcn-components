export interface ComponentSize {
  dropZone: string;
  main: string;
}

export type Size = 'md' | 'sm' | 'lg';

export type ComponentSizes = Record<Size, ComponentSize>;
