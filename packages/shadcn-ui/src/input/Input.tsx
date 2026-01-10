import type { InputProps as ShadcnInputProps } from '@pixpilot/shadcn';
import {
  cn,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  Input as ShadcnInput,
} from '@pixpilot/shadcn';
import * as React from 'react';

export type InputProps = ShadcnInputProps & {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  groupClassName?: string;
  prefixClassName?: string;
  suffixClassName?: string;
};

function Input(props: InputProps) {
  const {
    prefix,
    suffix,
    groupClassName,
    prefixClassName,
    suffixClassName,
    className,
    disabled,
    ...restProps
  } = props;

  if (prefix == null && suffix == null) {
    return <ShadcnInput className={className} disabled={disabled} {...restProps} />;
  }

  return (
    <InputGroup
      className={cn(groupClassName)}
      data-disabled={disabled ? 'true' : undefined}
    >
      {prefix != null ? (
        <InputGroupAddon align="inline-start" className={prefixClassName}>
          {prefix}
        </InputGroupAddon>
      ) : null}
      <InputGroupInput className={className} disabled={disabled} {...restProps} />
      {suffix != null ? (
        <InputGroupAddon align="inline-end" className={suffixClassName}>
          {suffix}
        </InputGroupAddon>
      ) : null}
    </InputGroup>
  );
}

export { Input };
