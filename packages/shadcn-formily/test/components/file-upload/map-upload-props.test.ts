import type { Field } from '@formily/core';
import type { FileMetadata } from '@pixpilot/shadcn-ui';
import type { UploadFieldCallbacks } from '../../../src/components/file-upload/map-upload-props';
import { describe, expect, it, vi } from 'vitest';
import { mapUploadProps } from '../../../src/components/file-upload/map-upload-props';

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
 * `value`, `onChange`, `onSuccess` and `onError` properties alongside whatever
 * was in the original props.
 */
type MappedResult = UploadFieldCallbacks & {
  value: unknown;
  onChange: undefined;
  onSuccess: (fileMeta: FileMetadata) => void;
  onError: (file: File, error: string) => void;
};

function callMapUploadProps(props: UploadFieldCallbacks, field: Field): MappedResult {
  return mapUploadProps(props, field) as MappedResult;
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

  it('sets onChange to undefined', () => {
    const field = createMockField();
    const result = callMapUploadProps({}, field);
    expect(result.onChange).toBeUndefined();
  });

  describe('onSuccess', () => {
    it('calls field.setValue with the file metadata', () => {
      const field = createMockField();
      const { onSuccess } = callMapUploadProps({}, field);
      onSuccess(MOCK_FILE_META);
      expect(field.setValue).toHaveBeenCalledOnce();
      expect(field.setValue).toHaveBeenCalledWith(MOCK_FILE_META);
    });

    it('calls the original onSuccess prop if provided', () => {
      const field = createMockField();
      const originalOnSuccess = vi.fn();
      const { onSuccess } = callMapUploadProps({ onSuccess: originalOnSuccess }, field);
      onSuccess(MOCK_FILE_META);
      expect(originalOnSuccess).toHaveBeenCalledOnce();
      expect(originalOnSuccess).toHaveBeenCalledWith(MOCK_FILE_META);
    });

    it('does not throw when no original onSuccess prop is provided', () => {
      const field = createMockField();
      const { onSuccess } = callMapUploadProps({}, field);
      expect(() => onSuccess(MOCK_FILE_META)).not.toThrow();
    });

    it('calls field.setValue before the original onSuccess prop', () => {
      const callOrder: string[] = [];
      const field = createMockField();
      vi.mocked(field.setValue).mockImplementation(() => {
        callOrder.push('setValue');
      });
      const originalOnSuccess = vi.fn(() => {
        callOrder.push('originalOnSuccess');
      });
      const { onSuccess } = callMapUploadProps({ onSuccess: originalOnSuccess }, field);
      onSuccess(MOCK_FILE_META);
      expect(callOrder).toEqual(['setValue', 'originalOnSuccess']);
    });
  });

  describe('onError', () => {
    it('calls field.setFeedback with type error and the error message', () => {
      const field = createMockField();
      const { onError } = callMapUploadProps({}, field);
      onError(MOCK_FILE, 'Upload failed');
      expect(field.setFeedback).toHaveBeenCalledOnce();
      expect(field.setFeedback).toHaveBeenCalledWith({
        type: 'error',
        messages: ['Upload failed'],
      });
    });

    it('calls the original onError prop if provided', () => {
      const field = createMockField();
      const originalOnError = vi.fn();
      const { onError } = callMapUploadProps({ onError: originalOnError }, field);
      onError(MOCK_FILE, 'Network error');
      expect(originalOnError).toHaveBeenCalledOnce();
      expect(originalOnError).toHaveBeenCalledWith(MOCK_FILE, 'Network error');
    });

    it('does not throw when no original onError prop is provided', () => {
      const field = createMockField();
      const { onError } = callMapUploadProps({}, field);
      expect(() => onError(MOCK_FILE, 'Upload failed')).not.toThrow();
    });

    it('calls field.setFeedback before the original onError prop', () => {
      const callOrder: string[] = [];
      const field = createMockField();
      vi.mocked(field.setFeedback).mockImplementation(() => {
        callOrder.push('setFeedback');
        return field;
      });
      const originalOnError = vi.fn(() => {
        callOrder.push('originalOnError');
      });
      const { onError } = callMapUploadProps({ onError: originalOnError }, field);
      onError(MOCK_FILE, 'Timed out');
      expect(callOrder).toEqual(['setFeedback', 'originalOnError']);
    });
  });

  it('forwards additional props unchanged', () => {
    const field = createMockField();
    const result = callMapUploadProps(
      { onSuccess: undefined, onError: undefined },
      field,
    ) as unknown as { accept?: string; disabled?: boolean };
    expect((result as any).accept).toBeUndefined();
  });
});
