/**
 * Reducer for controlled values that are replaced wholesale.
 *
 * Used with `useReducer` instead of `useState` so prop mirroring happens via a
 * dispatch, which React treats as an ordinary update even when triggered from
 * an effect during a drag.
 */
export function replaceState<T>(_current: T, next: T): T {
  return next;
}
