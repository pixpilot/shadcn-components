import type { InputProps } from '@pixpilot/shadcn-ui';

export function clampNumber(
  input: number,
  min: number | undefined,
  max: number | undefined,
): number {
  let value = input;
  if (typeof min === 'number') value = Math.max(min, value);
  if (typeof max === 'number') value = Math.min(max, value);
  return value;
}

export function getInputBound(
  input: InputProps | undefined,
  bound: 'min' | 'max',
  sliderBound: number | undefined,
): string | number | undefined {
  return input != null && Object.hasOwn(input, bound) ? input[bound] : sliderBound;
}

export function toFiniteNumber(bound: string | number | undefined): number | undefined {
  if (bound === undefined || bound === '') return undefined;

  const value = typeof bound === 'number' ? bound : Number(bound);
  return Number.isFinite(value) ? value : undefined;
}
