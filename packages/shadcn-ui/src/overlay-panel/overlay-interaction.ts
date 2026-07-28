export function isToastInteractionTarget(target: EventTarget | null): boolean {
  return target instanceof Element && target.closest('[data-sonner-toast]') !== null;
}
