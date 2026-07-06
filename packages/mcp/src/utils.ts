import type { ComponentPropDescriptions } from './types';

/** Preserves exact prop keys while validating a component's prop metadata shape. */
export function defineProps<Props extends string>(
  props: ComponentPropDescriptions<Props>,
): ComponentPropDescriptions<Props> {
  return props;
}
