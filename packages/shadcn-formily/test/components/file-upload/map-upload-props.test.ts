import type { Field } from '@formily/core';
import type { FileMetadata } from '@pixpilot/shadcn-ui';
import type { UploadFieldCallbacks } from '../../../src/components/file-upload/map-upload-props';
import { describe, expect, it, vi } from 'vitest';
import { mapUploadProps } from '../../../src/components/file-upload/map-upload-props';

type UploadFieldCallbackProps = UploadFieldCallbacks & {
  multiple?: boolean;
};

const MOCK_FILE_META: FileMetadata = {
  name: 'photo.png',
  size: 2048,
  type: 'image/png',
  url: 'https://example.com/photo.png',
  lastModified: 1700000000000,
};

const MOCK_FILE = new File([''], 'photo.png', { type: 'image/png' });

/** Build a minimal Field mock with the methods used by mapUploadProps. */
function createMockField(value: unknown = undefined): Field {
  return {
    value,
    setValue: vi.fn(),
    setFeedback: vi.fn(),
  } as unknown as Field;
}

/**
 * Typed wrapper so TypeScript knows the returned object carries the injected
 * `value`, `onChange`, `onFileSuccess` and `onFileError` properties
 * alongside whatever was in the original props.
 */
type MappedResult = UploadFieldCallbacks & {
  value: unknown;
  onChange: (newValue: FileMetadata | FileMetadata[] | null) => void;
  onFileSuccess: (fileMeta: FileMetadata) => void;
  onFileError: (file: File, error: string) => void;
};

function callMapUploadProps(
  props: UploadFieldCallbackProps,
  field: Field,
  options?: { forceSingle?: boolean },
): MappedResult {
  return mapUploadProps(props, field, options) as MappedResult;
}

describe('mapUploadProps', () => {
  it('maps value from field.value', () => {
    const field = createMockField(MOCK_FILE_META);
    const result = callMapUploadProps({}, field);
    expect(result.value).toBe(MOCK_FILE_META);
  });

  it('defaults value to null when field.value is undefined', () => {
    const field = createMockField(undefined);
    const result = callMapUploadProps({}, field);
    expect(result.value).toBeNull();
  });

  it('defaults value to null when field.value is null', () => {
    const field = createMockField(null);
    const result = callMapUploadProps({}, field);
    expect(result.value).toBeNull();
  });

  it('applies mapValue to the current field value', () => {
    const field = createMockField({
      ...MOCK_FILE_META,
      url: undefined,
    } satisfies FileMetadata);
    const result = callMapUploadProps(
      {
        mapValue: (value) => {
          if (value == null) {
            return value;
          }

          return {
            ...value,
            url: value.url ?? 'https://example.com/fallback.png',
          };
        },
      },
      field,
    );

    expect(result.value).toEqual({
      ...MOCK_FILE_META,
      url: 'https://example.com/fallback.png',
    });
  });

  it('does not forward mapValue to the rendered component props', () => {
    const field = createMockField(MOCK_FILE_META);
    const result = callMapUploadProps({ mapValue: (value) => value }, field);

    expect('mapValue' in result).toBe(false);
  });

  it('provides a guarded onChange function', () => {
    const field = createMockField();
    const result = callMapUploadProps({}, field);
    expect(result.onChange).toBeTypeOf('function');
  });

  describe('onChange', () => {
    it('clears the value and upload warning feedback in single mode', () => {
      const field = createMockField(MOCK_FILE_META);
      const { onChange } = callMapUploadProps({ multiple: false }, field);

      onChange(null);

      expect(field.setValue).toHaveBeenCalledOnce();
      expect(field.setValue).toHaveBeenCalledWith(null);
      expect(field.setFeedback).toHaveBeenCalledOnce();
      expect(field.setFeedback).toHaveBeenCalledWith({
        type: 'warning',
        messages: [],
      });
    });

    it('clears the value and upload warning feedback for forced single mode', () => {
      const field = createMockField(MOCK_FILE_META);
      const { onChange } = callMapUploadProps({}, field, { forceSingle: true });

      onChange(null);

      expect(field.setValue).toHaveBeenCalledOnce();
      expect(field.setValue).toHaveBeenCalledWith(null);
      expect(field.setFeedback).toHaveBeenCalledOnce();
      expect(field.setFeedback).toHaveBeenCalledWith({
        type: 'warning',
        messages: [],
      });
    });

    it('does not clear feedback for multi-file deletions', () => {
      const existingFiles = [
        MOCK_FILE_META,
        {
          ...MOCK_FILE_META,
          name: 'photo-2.png',
          url: 'https://example.com/photo-2.png',
          lastModified: 1700000000001,
        } satisfies FileMetadata,
      ];
      const field = createMockField(existingFiles);
      const { onChange } = callMapUploadProps({ multiple: true }, field);

      onChange([existingFiles[0]!]);

      expect(field.setValue).toHaveBeenCalledOnce();
      expect(field.setValue).toHaveBeenCalledWith([existingFiles[0]]);
      expect(field.setFeedback).not.toHaveBeenCalled();
    });
  });

  describe('onFileSuccess', () => {
    it('calls field.setValue with the file metadata in single mode', () => {
      const field = createMockField();
      const { onFileSuccess } = callMapUploadProps({ multiple: false }, field);
      onFileSuccess(MOCK_FILE_META);
      expect(field.setValue).toHaveBeenCalledOnce();
      expect(field.setValue).toHaveBeenCalledWith(MOCK_FILE_META);
    });

    it('appends the file to the existing array in multiple mode', () => {
      const existingFile: FileMetadata = {
        name: 'existing.png',
        size: 1024,
        type: 'image/png',
        lastModified: 1700000000000,
      };
      const field = createMockField([existingFile]);
      const { onFileSuccess } = callMapUploadProps({ multiple: true }, field);
      onFileSuccess(MOCK_FILE_META);
      expect(field.setValue).toHaveBeenCalledWith([existingFile, MOCK_FILE_META]);
    });

    it('starts a new array when field.value is null in multiple mode', () => {
      const field = createMockField(null);
      const { onFileSuccess } = callMapUploadProps({ multiple: true }, field);
      onFileSuccess(MOCK_FILE_META);
      expect(field.setValue).toHaveBeenCalledWith([MOCK_FILE_META]);
    });

    it('normalises a single existing file into an array in multiple mode', () => {
      const existingFile: FileMetadata = {
        name: 'existing.png',
        size: 1024,
        type: 'image/png',
        url: 'https://example.com/existing.png',
        lastModified: 1700000000000,
      };
      const field = createMockField(existingFile);
      const { onFileSuccess } = callMapUploadProps({ multiple: true }, field);
      onFileSuccess(MOCK_FILE_META);
      expect(field.setValue).toHaveBeenCalledWith([existingFile, MOCK_FILE_META]);
    });

    it('honours an explicit single-mode override for single-only wrappers', () => {
      const field = createMockField(null);
      const { onFileSuccess } = callMapUploadProps({}, field, { forceSingle: true });
      onFileSuccess(MOCK_FILE_META);
      expect(field.setValue).toHaveBeenCalledWith(MOCK_FILE_META);
    });

    it('calls the original onFileSuccess prop if provided', () => {
      const field = createMockField();
      const originalOnFileSuccess = vi.fn();
      const { onFileSuccess } = callMapUploadProps(
        { multiple: false, onFileSuccess: originalOnFileSuccess },
        field,
      );
      onFileSuccess(MOCK_FILE_META);
      expect(originalOnFileSuccess).toHaveBeenCalledOnce();
      expect(originalOnFileSuccess).toHaveBeenCalledWith(MOCK_FILE_META);
    });

    it('does not throw when no original onFileSuccess prop is provided', () => {
      const field = createMockField();
      const { onFileSuccess } = callMapUploadProps({ multiple: false }, field);
      expect(() => onFileSuccess(MOCK_FILE_META)).not.toThrow();
    });

    it('calls field.setValue before the original onFileSuccess prop', () => {
      const callOrder: string[] = [];
      const field = createMockField();
      vi.mocked(field.setValue).mockImplementation(() => {
        callOrder.push('setValue');
      });
      const originalOnFileSuccess = vi.fn(() => {
        callOrder.push('originalOnFileSuccess');
      });
      const { onFileSuccess } = callMapUploadProps(
        { multiple: false, onFileSuccess: originalOnFileSuccess },
        field,
      );
      onFileSuccess(MOCK_FILE_META);
      expect(callOrder).toEqual(['setValue', 'originalOnFileSuccess']);
    });
  });

  describe('onFileError', () => {
    it('calls field.setFeedback with type error and the error message', () => {
      const field = createMockField();
      const { onFileError } = callMapUploadProps({}, field);
      onFileError(MOCK_FILE, 'Upload failed');
      expect(field.setFeedback).toHaveBeenCalledOnce();
      expect(field.setFeedback).toHaveBeenCalledWith({
        type: 'error',
        messages: ['Upload failed'],
      });
    });

    it('calls the original onFileError prop if provided', () => {
      const field = createMockField();
      const originalOnFileError = vi.fn();
      const { onFileError } = callMapUploadProps(
        { onFileError: originalOnFileError },
        field,
      );
      onFileError(MOCK_FILE, 'Network error');
      expect(originalOnFileError).toHaveBeenCalledOnce();
      expect(originalOnFileError).toHaveBeenCalledWith(MOCK_FILE, 'Network error');
    });

    it('does not throw when no original onFileError prop is provided', () => {
      const field = createMockField();
      const { onFileError } = callMapUploadProps({}, field);
      expect(() => onFileError(MOCK_FILE, 'Upload failed')).not.toThrow();
    });

    it('calls field.setFeedback before the original onFileError prop', () => {
      const callOrder: string[] = [];
      const field = createMockField();
      vi.mocked(field.setFeedback).mockImplementation(() => {
        callOrder.push('setFeedback');
        return field;
      });
      const originalOnFileError = vi.fn(() => {
        callOrder.push('originalOnFileError');
      });
      const { onFileError } = callMapUploadProps(
        { onFileError: originalOnFileError },
        field,
      );
      onFileError(MOCK_FILE, 'Timed out');
      expect(callOrder).toEqual(['setFeedback', 'originalOnFileError']);
    });
  });

  it('forwards additional props unchanged', () => {
    const field = createMockField();
    const result = callMapUploadProps(
      { onFileSuccess: undefined, onFileError: undefined },
      field,
    ) as unknown as { accept?: string; disabled?: boolean };
    expect((result as any).accept).toBeUndefined();
  });
});
