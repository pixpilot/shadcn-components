import React from 'react';

interface UseControlledProps<T> {
  controlled?: T;
  default: T;
  name: string;
  state?: string;
}

export default function useControlled<T>(
  props: UseControlledProps<T>,
): [T, React.Dispatch<React.SetStateAction<T>>, boolean] {
  // isControlled is ignored in the hook dependency lists as it should never change.
  const { controlled, default: defaultProp, name, state = 'value' } = props;
  const { current: isControlled } = React.useRef(controlled !== undefined);
  const [valueState, setValue] = React.useState(defaultProp);
  const value = isControlled ? controlled! : valueState;

  // eslint-disable-next-line no-restricted-properties, node/prefer-global/process
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => {
      if (isControlled !== (controlled !== undefined)) {
        console.error(
          [
            `A component is changing the ${
              isControlled ? '' : 'un'
            }controlled ${state} state of ${name} to be ${
              isControlled ? 'un' : ''
            }controlled.`,
            'Elements should not switch from uncontrolled to controlled (or vice versa).',
            `Decide between using a controlled or uncontrolled ${name} ` +
              'element for the lifetime of the component.',
            "The nature of the state is determined during the first render, it's considered controlled if the value is not `undefined`.",
            'More info: https://fb.me/react-controlled-components',
          ].join('\n'),
        );
      }
    }, [state, name, controlled, isControlled]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { current: defaultValue } = React.useRef(defaultProp);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => {
      if (!isControlled && defaultValue !== defaultProp) {
        console.error(
          [
            `A component is changing the default ${state} state of an uncontrolled ${name} after being initialized. ` +
              `To suppress this warning opt to use a controlled ${name}.`,
          ].join('\n'),
        );
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(defaultProp)]);
  }

  const setValueIfUncontrolled = React.useCallback(
    (newValue: React.SetStateAction<T>) => {
      if (!isControlled) {
        setValue(newValue);
      } else if (typeof newValue === 'function') {
        (newValue as (prev: T) => T)(controlled!);
      }
    },
    [controlled, isControlled],
  );

  return [value, setValueIfUncontrolled, isControlled];
}

export { useControlled };
