import * as React from 'react';

// eslint-disable-next-line ts/explicit-module-boundary-types
function useLazyRef<T>(fn: () => T) {
  const ref = React.useRef<T | null>(null);

  if (ref.current === null) {
    ref.current = fn();
  }

  return ref as React.RefObject<T>;
}

export { useLazyRef };
