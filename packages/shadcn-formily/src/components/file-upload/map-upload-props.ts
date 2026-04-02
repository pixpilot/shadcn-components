import type { Field } from '@formily/core';
import type { FileMetadata } from '@pixpilot/shadcn-ui';

type SingleFileUploadValue = FileMetadata | null;

type ExtractSingleFileValue<P> = P extends { value?: infer TValue }
  ? Extract<TValue, SingleFileUploadValue> extends never
    ? SingleFileUploadValue
    : Extract<TValue, SingleFileUploadValue>
  : SingleFileUploadValue;

export interface UploadValueMapper<
  TValue extends SingleFileUploadValue = SingleFileUploadValue,
> {
  mapValue?: (value: TValue) => TValue;
}

export type FormilyUploadProps<P> = P extends { multiple: true }
  ? P
  : P & UploadValueMapper<ExtractSingleFileValue<P>>;

/**
 * Callbacks that the shadcn upload components expose at the single-file level.
 * `FileUploadProps`, `AvatarUploadProps` and `FileUploadInlineProps` all carry
 * these when used in single-file mode.
 */
export interface UploadFieldCallbacks<
  TValue extends SingleFileUploadValue = SingleFileUploadValue,
> extends UploadValueMapper<TValue> {
  onSuccess?: (fileMeta: FileMetadata) => void;
  onError?: (file: File, error: string) => void;
}

type MappedUploadProps<P extends object> = P &
  UploadFieldCallbacks<ExtractSingleFileValue<P>> & {
    onChange?: unknown;
  };

/**
 * Shared `mapProps` mapper for all Formily-connected upload components.
 *
 * - Forwards `field.value` (defaulting to `null`) as the `value` prop so the
 *   component displays the currently stored file metadata.
 * - Applies `mapValue` to the field value before forwarding it so callers can
 *   derive a display-ready file object without mutating the stored form value.
 * - Sets `onChange` to `undefined` to prevent Formily's default wiring from
 *   calling `field.setValue()` the moment a file is selected (i.e. before the
 *   upload completes).
 * - Wraps `onSuccess` so that `field.setValue(fileMeta)` is called only after a
 *   successful upload, followed by the original `onSuccess` callback if one was
 *   supplied.
 * - Wraps `onError` so that `field.setFeedback({ type: 'error', … })` is set on
 *   upload failure, followed by the original `onError` callback if one was
 *   supplied.
 *
 * The generic `P extends object` constraint keeps the return type identical to
 * the input type so that the mapper satisfies Formily's `IStateMapper<T>`.
 * Internally the props are cast to `UploadFieldCallbacks` to access the
 * upload-specific callbacks; the multiple-file variant of `FileUploadProps`
 * uses `onFileSuccess`/`onFileError` instead, which are simply left untouched
 * because this function only overrides `onSuccess` and `onError`.
 */
export function mapUploadProps<P extends object>(props: P, field: Field): P {
  const { onSuccess, onError, mapValue, ...restProps } = props as MappedUploadProps<P>;

  const baseValue = (field.value ?? null) as ExtractSingleFileValue<P>;
  const value = mapValue ? mapValue(baseValue) : baseValue;

  return {
    ...restProps,
    value,
    onChange: undefined,
    onSuccess: (fileMeta: FileMetadata) => {
      field.setValue(fileMeta);
      onSuccess?.(fileMeta);
    },
    onError: (file: File, error: string) => {
      field.setFeedback({ type: 'error', messages: [error] });
      onError?.(file, error);
    },
  } as unknown as P;
}
