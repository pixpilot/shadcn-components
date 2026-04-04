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
  onFileSuccess?: (fileMeta: FileMetadata) => void;
  onFileError?: (file: File, error: string) => void;
}

type MappedUploadProps<P extends object> = P &
  UploadFieldCallbacks<ExtractSingleFileValue<P>> & {
    onChange?: unknown;
  };

interface MapUploadPropsOptions {
  forceSingle?: boolean;
}

/**
 * Shared `mapProps` mapper for all Formily-connected upload components.
 *
 * - Forwards `field.value` (defaulting to `null`) as the `value` prop so the
 *   component displays the currently stored file metadata.
 * - Applies `mapValue` to the field value before forwarding it so callers can
 *   derive a display-ready file object without mutating the stored form value.
 * - Provides a guarded `onChange` that only writes to the field on deletions
 *   (value becomes `null` for single-file, or the array shrinks for
 *   multi-file).  New-file accepts fire `onChange` before the upload
 *   completes with incomplete metadata (no `url`), so those calls are
 *   intentionally ignored here — `onFileSuccess` handles the final write
 *   once the upload finishes.
 * - Wraps `onFileSuccess` so that `field.setValue(fileMeta)` is called only
 *   after a successful upload, followed by the original `onFileSuccess`
 *   callback if one was supplied. When the field value is an array (multiple
 *   mode), the new file is appended to the existing array rather than
 *   replacing it.
 * - Wraps `onFileError` so that `field.setFeedback({ type: 'error', … })` is
 *   set on upload failure, followed by the original `onFileError` callback if
 *   one was supplied.
 *
 * The generic `P extends object` constraint keeps the return type identical to
 * the input type so that the mapper satisfies Formily's `IStateMapper<T>`.
 * Internally the props are cast to `UploadFieldCallbacks` to access the
 * upload-specific callbacks; both single-file and multiple-file modes share
 * the same `onFileSuccess`/`onFileError` callbacks that fire per file.
 */
export function mapUploadProps<P extends object>(
  props: P,
  field: Field,
  options?: MapUploadPropsOptions,
): P {
  const { onFileSuccess, onFileError, mapValue, ...restProps } =
    props as MappedUploadProps<P>;

  const { multiple } = props as { multiple?: boolean };

  /*
   * Default FileUpload and FileUploadInline to multiple unless the caller sets
   * `multiple === false`. Single-only wrappers such as AvatarUpload can force
   * single mode explicitly via `options.forceSingle`.
   */
  const isSingle =
    multiple !== true && (options?.forceSingle === true || multiple === false);

  const baseValue = (field.value ?? null) as ExtractSingleFileValue<P>;
  const value = mapValue ? mapValue(baseValue) : baseValue;
  const currentMultipleFiles: FileMetadata[] = (() => {
    const currentValue = field.value as FileMetadata | FileMetadata[] | null | undefined;

    if (Array.isArray(currentValue)) {
      return currentValue;
    }

    if (currentValue == null) {
      return [];
    }

    return [currentValue];
  })();

  return {
    ...restProps,
    value,
    onChange: (newValue: FileMetadata | FileMetadata[] | null) => {
      if (newValue === null) {
        /*
         * Single-file deletion: the X button called onChange(null).
         * Clear the field value so the form reflects the removal.
         * Also clear file-rejection warnings because they refer to the file
         * that was just removed.
         */
        field.setValue(null);
        if (isSingle) {
          field.setFeedback({ type: 'warning', messages: [] });
        }
      } else if (Array.isArray(newValue)) {
        /*
         * Multiple-file deletion: onChange is called with the filtered array.
         * Only write to the field when the count decreased (i.e. a file was
         * removed), not when it increased (new accept before upload completes).
         */
        const currentLen = currentMultipleFiles.length;
        if (newValue.length <= currentLen) {
          field.setValue(newValue);
        }
      }
      /*
       * Non-null single-file accept (pre-upload): the upload hasn't finished
       * yet so the metadata has no url. Ignore it here — onFileSuccess will
       * write the complete metadata once the upload succeeds.
       */
    },
    onFileSuccess: (fileMeta: FileMetadata) => {
      /*
       * Use the resolved mode signal rather than inspecting `field.value`
       * alone, because the first successful upload may arrive while the field
       * value is still null/undefined. Keep the array append path limited to
       * multiple mode and normalise unexpected existing values so consumers do
       * not crash if a single-file object is still stored.
       */
      if (!isSingle) {
        field.setValue([...currentMultipleFiles, fileMeta]);
      } else {
        field.setValue(fileMeta);
      }
      onFileSuccess?.(fileMeta);
    },
    onFileError: (file: File, error: string) => {
      field.setFeedback({ type: 'error', messages: [error] });
      onFileError?.(file, error);
    },
  } as unknown as P;
}
