import type { Field } from '@formily/core';
import { useField } from '@formily/react';
import { renderHook } from '@testing-library/react';
import prettyBytes from 'pretty-bytes';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useFileUploadFeedback } from '../../../src/components/file-upload/use-file-upload-feedback';
import { useFormContext } from '../../../src/hooks';

vi.mock('@formily/react', () => ({
  useField: vi.fn(),
}));

vi.mock('../../../src/hooks', () => ({
  useFormContext: vi.fn(),
}));

type MockField = Pick<
  Field,
  'address' | 'componentProps' | 'componentType' | 'setFeedback'
>;

function createField(overrides: Partial<MockField> = {}): MockField {
  return {
    address: {
      toString: () => 'profile.files',
    } as Field['address'],
    componentProps: {
      accept: 'image/*',
      multiple: false,
    },
    componentType: 'FileUploadInline',
    setFeedback: vi.fn(),
    ...overrides,
  };
}

function mockHooks(
  options: {
    field?: MockField;
    onUpload?: ((...args: any[]) => any) | undefined;
    maxSize?: number | undefined;
    includeUpload?: boolean;
  } = {},
): MockField {
  const field = options.field ?? createField();
  const includeUpload = options.includeUpload !== false;
  const onUpload =
    options.onUpload ??
    (includeUpload ? vi.fn().mockResolvedValue(undefined) : undefined);

  vi.mocked(useField).mockReturnValue(field as Field);
  vi.mocked(useFormContext).mockReturnValue({
    settings: includeUpload
      ? {
          fileUpload: {
            maxSize: options.maxSize,
            onUpload,
          },
        }
      : {},
  } as any);

  return field;
}

afterEach(() => {
  vi.clearAllMocks();
});

describe('useFileUploadFeedback', () => {
  it('uses provided upload props and max size without falling back to form settings', async () => {
    const field = mockHooks();
    const onUpload = vi.fn().mockResolvedValue(undefined);

    const { result } = renderHook(() =>
      useFileUploadFeedback({
        maxSize: 4096,
        onUpload,
      } as any),
    );

    const files = [new File(['avatar'], 'avatar.png', { type: 'image/png' })];
    const options = {
      onError: vi.fn(),
      retry: true,
    };

    await result.current.onUpload!(files, options as any);

    expect(result.current.maxSize).toBe(4096);
    expect(onUpload).toHaveBeenCalledOnce();
    expect(onUpload).toHaveBeenCalledWith(files, options);
    expect(field.setFeedback).not.toHaveBeenCalled();
  });

  it('falls back to form settings when upload props are absent', async () => {
    const field = createField({
      address: {
        toString: () => '/users/1/avatar',
      } as Field['address'],
      componentProps: {
        accept: 'image/*',
        multiple: true,
      },
      componentType: 'AvatarUpload',
    });
    const onUpload = vi.fn().mockResolvedValue(undefined);
    mockHooks({ field, onUpload, maxSize: 8192 });

    const { result } = renderHook(() => useFileUploadFeedback({} as any));

    const files = [new File(['avatar'], 'avatar.png', { type: 'image/png' })];
    const options = {
      onError: vi.fn(),
      retry: false,
    };

    await result.current.onUpload!(files, options as any);

    expect(result.current.maxSize).toBe(8192);
    expect(onUpload).toHaveBeenCalledOnce();
    expect(onUpload).toHaveBeenCalledWith(files, {
      ...options,
      component: 'AvatarUpload',
      componentProps: {
        accept: 'image/*',
        multiple: true,
      },
      path: '/users/1/avatar',
    });
  });

  it('throws when no upload handler is available', () => {
    mockHooks({ includeUpload: false });

    expect(() => renderHook(() => useFileUploadFeedback({} as any))).toThrow(
      'onUpload prop required for FileUploadInline. Provide handler on form or field props.',
    );
  });

  it('aggregates rejection feedback for maximum and file-size errors', () => {
    const field = mockHooks({ maxSize: 2000 });
    const onFilesReject = vi.fn();
    const { result } = renderHook(() => useFileUploadFeedback({ onFilesReject } as any));

    const files = [
      {
        file: new File(['a'], 'first.txt', { type: 'text/plain' }),
        message: 'Maximum 3 files',
      },
      {
        file: new File(['b'], 'second.txt', { type: 'text/plain' }),
        message: 'Maximum 5 files',
      },
      {
        file: new File(['x'.repeat(1000)], 'report.pdf', {
          type: 'application/pdf',
        }),
        message: 'File too large',
      },
      {
        file: new File(['y'.repeat(500)], 'notes.txt', {
          type: 'text/plain',
        }),
        message: 'File too large',
      },
    ];

    result.current.handleFilesRejection(files);

    expect(onFilesReject).toHaveBeenCalledOnce();
    expect(onFilesReject).toHaveBeenCalledWith(files);
    expect(field.setFeedback).toHaveBeenCalledWith({
      type: 'warning',
      messages: [
        [
          'Maximum 3 files',
          `Files exceed ${prettyBytes(2000)} limit:`,
          `report.pdf (${prettyBytes(1000)})`,
          `notes.txt (${prettyBytes(500)})`,
        ].join('\n'),
      ],
    });
  });

  it('keeps file-size errors as plain field warnings when no max size is configured', () => {
    const field = mockHooks();
    const onFilesReject = vi.fn();
    const { result } = renderHook(() => useFileUploadFeedback({ onFilesReject } as any));

    const files = [
      {
        file: new File(['x'.repeat(1000)], 'report.pdf', {
          type: 'application/pdf',
        }),
        message: 'File too large',
      },
      {
        file: new File(['notes'], 'notes.txt', { type: 'text/plain' }),
        message: 'Unsupported format',
      },
    ];

    result.current.handleFilesRejection(files);

    expect(onFilesReject).toHaveBeenCalledOnce();
    expect(field.setFeedback).toHaveBeenCalledWith({
      type: 'warning',
      messages: ['Unsupported format: notes.txt'],
    });
  });

  it('clears feedback and returns validation results', () => {
    const field = mockHooks();
    const onFileValidate = vi.fn().mockReturnValue('invalid file');
    const { result } = renderHook(() => useFileUploadFeedback({ onFileValidate } as any));

    const file = new File(['avatar'], 'avatar.png', { type: 'image/png' });

    expect(result.current.handleFileValidate(file)).toBe('invalid file');
    expect(field.setFeedback).toHaveBeenCalledWith({
      type: 'warning',
      messages: [],
    });
    expect(onFileValidate).toHaveBeenCalledOnce();
    expect(onFileValidate).toHaveBeenCalledWith(file);
  });

  it('clears feedback and returns undefined when no validation callback exists', () => {
    const field = mockHooks();
    const { result } = renderHook(() => useFileUploadFeedback({} as any));

    const file = new File(['avatar'], 'avatar.png', { type: 'image/png' });

    expect(result.current.handleFileValidate(file)).toBeUndefined();
    expect(field.setFeedback).toHaveBeenCalledWith({
      type: 'warning',
      messages: [],
    });
  });
});
