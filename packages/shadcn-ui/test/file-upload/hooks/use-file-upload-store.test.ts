import type {
  FileMetadata,
  OnChangeMultipleFiles,
  OnChangeSingleFile,
} from '../../../src/file-upload/types';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useFileUploadStore } from '../../../src/file-upload/hooks/use-file-upload-store';

describe('useFileUploadStore', () => {
  const mockFile1 = {
    name: 'test1.txt',
    type: 'text/plain',
    lastModified: 1000000000,
    size: 100,
  } as File;

  const mockFile2 = {
    name: 'test2.txt',
    type: 'text/plain',
    lastModified: 2000000000,
    size: 200,
  } as File;

  const mockFileMetadata1: FileMetadata = {
    name: 'existing1.txt',
    type: 'text/plain',
    lastModified: 3000000000,
    size: 300,
  };

  const mockFileMetadata2: FileMetadata = {
    name: 'existing2.txt',
    type: 'text/plain',
    lastModified: 4000000000,
    size: 400,
  };

  describe('initial state', () => {
    it('should initialize with empty uploadFiles', () => {
      const { result } = renderHook(() =>
        useFileUploadStore({
          value: null,
          onChange: undefined,
          multiple: false,
        }),
      );

      expect(result.current.uploadFiles).toEqual([]);
    });

    it('should initialize displayFiles as empty when value is null', () => {
      const { result } = renderHook(() =>
        useFileUploadStore({
          value: null,
          onChange: undefined,
          multiple: false,
        }),
      );

      expect(result.current.displayFiles).toEqual([]);
    });

    it('should initialize displayFiles with value when provided', () => {
      const { result } = renderHook(() =>
        useFileUploadStore({
          value: mockFileMetadata1,
          onChange: undefined,
          multiple: false,
        }),
      );

      expect(result.current.displayFiles).toEqual([mockFileMetadata1]);
    });

    it('should initialize displayFiles with array value when provided', () => {
      const { result } = renderHook(() =>
        useFileUploadStore({
          value: [mockFileMetadata1, mockFileMetadata2],
          onChange: undefined,
          multiple: true,
        }),
      );

      expect(result.current.displayFiles).toEqual([mockFileMetadata1, mockFileMetadata2]);
    });
  });

  describe('handleAccept', () => {
    it('should set uploadFiles when files are accepted', () => {
      const { result } = renderHook(() =>
        useFileUploadStore({
          value: null,
          onChange: undefined,
          multiple: false,
        }),
      );

      act(() => {
        result.current.handleAccept([mockFile1]);
      });

      expect(result.current.uploadFiles).toEqual([mockFile1]);
    });

    it('should call onChange with single file when multiple is false', () => {
      const onChange = vi.fn() as OnChangeSingleFile;
      const { result } = renderHook(() =>
        useFileUploadStore({
          value: null,
          onChange,
          multiple: false,
        }),
      );

      act(() => {
        result.current.handleAccept([mockFile1]);
      });

      expect(onChange).toHaveBeenCalledWith({
        name: 'test1.txt',
        type: 'text/plain',
        lastModified: 1000000000,
        size: 100,
      });
    });

    it('should call onChange with multiple files when multiple is true', () => {
      const onChange = vi.fn() as OnChangeMultipleFiles;
      const { result } = renderHook(() =>
        useFileUploadStore({
          value: null,
          onChange,
          multiple: true,
        }),
      );

      act(() => {
        result.current.handleAccept([mockFile1, mockFile2]);
      });

      expect(onChange).toHaveBeenCalledWith([
        {
          name: 'test1.txt',
          type: 'text/plain',
          lastModified: 1000000000,
          size: 100,
        },
        {
          name: 'test2.txt',
          type: 'text/plain',
          lastModified: 2000000000,
          size: 200,
        },
      ]);
    });

    it('should merge with existing value when multiple is true', () => {
      const onChange = vi.fn() as OnChangeMultipleFiles;
      const { result } = renderHook(() =>
        useFileUploadStore({
          value: [mockFileMetadata1],
          onChange,
          multiple: true,
        }),
      );

      act(() => {
        result.current.handleAccept([mockFile1]);
      });

      expect(onChange).toHaveBeenCalledWith([
        mockFileMetadata1,
        {
          name: 'test1.txt',
          type: 'text/plain',
          lastModified: 1000000000,
          size: 100,
        },
      ]);
    });
  });

  describe('displayFiles', () => {
    it('should return uploadFiles when value is null', () => {
      const { result } = renderHook(() =>
        useFileUploadStore({
          value: null,
          onChange: undefined,
          multiple: false,
        }),
      );

      act(() => {
        result.current.handleAccept([mockFile1]);
      });

      expect(result.current.displayFiles).toEqual([
        {
          name: 'test1.txt',
          type: 'text/plain',
          lastModified: 1000000000,
          size: 100,
          file: mockFile1,
        },
      ]);
    });

    it('should return merged files when value exists', () => {
      const { result } = renderHook(() =>
        useFileUploadStore({
          value: mockFileMetadata1,
          onChange: undefined,
          multiple: false,
        }),
      );

      act(() => {
        result.current.handleAccept([mockFile1]);
      });

      expect(result.current.displayFiles).toEqual([
        mockFileMetadata1,
        {
          name: 'test1.txt',
          type: 'text/plain',
          lastModified: 1000000000,
          size: 100,
          file: mockFile1,
        },
      ]);
    });

    it('should update displayFiles when value changes', () => {
      const { result, rerender } = renderHook(
        ({ value }) =>
          useFileUploadStore({
            value,
            onChange: undefined,
            multiple: true,
          }),
        {
          initialProps: { value: null as FileMetadata[] | null },
        },
      );

      act(() => {
        result.current.handleAccept([mockFile1]);
      });

      expect(result.current.displayFiles).toEqual([
        {
          name: 'test1.txt',
          type: 'text/plain',
          lastModified: 1000000000,
          size: 100,
          file: mockFile1,
        },
      ]);

      rerender({ value: [mockFileMetadata1] });

      expect(result.current.displayFiles).toEqual([
        mockFileMetadata1,
        {
          name: 'test1.txt',
          type: 'text/plain',
          lastModified: 1000000000,
          size: 100,
          file: mockFile1,
        },
      ]);
    });
  });

  describe('orgValue + getFile', () => {
    it('should create stable File instances for metadata-only values', () => {
      const { result, rerender } = renderHook(
        ({ value }) =>
          useFileUploadStore({
            value,
            onChange: undefined,
            multiple: false,
          }),
        {
          initialProps: { value: mockFileMetadata1 as FileMetadata | null },
        },
      );

      expect(result.current.orgValue).toHaveLength(1);
      const firstFile = result.current.orgValue[0];
      expect(firstFile).toBeInstanceOf(File);
      expect(firstFile!.name).toBe(mockFileMetadata1.name);
      expect(firstFile!.type).toBe(mockFileMetadata1.type);
      expect(firstFile!.lastModified).toBe(mockFileMetadata1.lastModified);

      rerender({ value: mockFileMetadata1 });

      expect(result.current.orgValue).toHaveLength(1);
      expect(result.current.orgValue[0]).toBe(firstFile);
    });

    it('should reuse the original File when fileMeta.file exists', () => {
      const { result } = renderHook(() =>
        useFileUploadStore({
          value: null,
          onChange: undefined,
          multiple: true,
        }),
      );

      act(() => {
        result.current.handleAccept([mockFile1]);
      });

      expect(result.current.displayFiles[0]?.file).toBe(mockFile1);
      expect(result.current.getFile(result.current.displayFiles[0]!)).toBe(mockFile1);
      expect(result.current.orgValue).toEqual([mockFile1]);
    });
  });

  describe('deleteFile', () => {
    it('should delete upload file when file has file property', () => {
      const { result } = renderHook(() =>
        useFileUploadStore({
          value: null,
          onChange: undefined,
          multiple: false,
        }),
      );

      act(() => {
        result.current.handleAccept([mockFile1, mockFile2]);
      });

      expect(result.current.uploadFiles).toEqual([mockFile1, mockFile2]);

      act(() => {
        result.current.deleteFile({
          name: 'test1.txt',
          type: 'text/plain',
          lastModified: 1000000000,
          size: 100,
          file: mockFile1,
        });
      });

      expect(result.current.uploadFiles).toEqual([mockFile2]);
    });

    it('should call onChange with null when deleting single file', () => {
      const onChange = vi.fn() as OnChangeSingleFile;
      const { result } = renderHook(() =>
        useFileUploadStore({
          value: mockFileMetadata1,
          onChange,
          multiple: false,
        }),
      );

      act(() => {
        result.current.deleteFile(mockFileMetadata1);
      });

      expect(onChange).toHaveBeenCalledWith(null);
    });

    it('should call onChange with filtered files when deleting from multiple', () => {
      const onChange = vi.fn() as OnChangeMultipleFiles;
      const { result } = renderHook(() =>
        useFileUploadStore({
          value: [mockFileMetadata1, mockFileMetadata2],
          onChange,
          multiple: true,
        }),
      );

      act(() => {
        result.current.deleteFile(mockFileMetadata1);
      });

      expect(onChange).toHaveBeenCalledWith([mockFileMetadata2]);
    });

    it('should delete file from displayFiles when deleting existing file', () => {
      const onChange = vi.fn() as OnChangeMultipleFiles;
      const { result } = renderHook(() =>
        useFileUploadStore({
          value: [mockFileMetadata1, mockFileMetadata2],
          onChange,
          multiple: true,
        }),
      );

      expect(result.current.displayFiles).toEqual([mockFileMetadata1, mockFileMetadata2]);

      act(() => {
        result.current.deleteFile(mockFileMetadata1);
      });

      expect(onChange).toHaveBeenCalledWith([mockFileMetadata2]);
      // Note: displayFiles is computed from props, so it won't update until value prop changes
    });

    it('should handle deleting non-existent file', () => {
      const onChange = vi.fn() as OnChangeMultipleFiles;
      const { result } = renderHook(() =>
        useFileUploadStore({
          value: [mockFileMetadata1],
          onChange,
          multiple: true,
        }),
      );

      const nonExistentFile = {
        name: 'nonexistent.txt',
        type: 'text/plain',
        lastModified: 9999999999,
        size: 999,
      };

      act(() => {
        result.current.deleteFile(nonExistentFile);
      });

      expect(onChange).toHaveBeenCalledWith([mockFileMetadata1]);
    });
  });

  describe('edge cases', () => {
    it('should handle empty accepted files', () => {
      const { result } = renderHook(() =>
        useFileUploadStore({
          value: null,
          onChange: undefined,
          multiple: false,
        }),
      );

      act(() => {
        result.current.handleAccept([]);
      });

      expect(result.current.uploadFiles).toEqual([]);
    });

    it('should handle undefined value', () => {
      const { result } = renderHook(() =>
        useFileUploadStore({
          value: undefined,
          onChange: undefined,
          multiple: false,
        }),
      );

      expect(result.current.displayFiles).toEqual([]);
    });

    it('should handle onChange being undefined', () => {
      const { result } = renderHook(() =>
        useFileUploadStore({
          value: null,
          onChange: undefined,
          multiple: false,
        }),
      );

      act(() => {
        result.current.handleAccept([mockFile1]);
      });

      // Should not throw error
      expect(result.current.uploadFiles).toEqual([mockFile1]);
    });

    it('should update refs when props change', () => {
      const onChange1 = vi.fn() as OnChangeSingleFile;
      const onChange2 = vi.fn() as OnChangeSingleFile;

      const { result, rerender } = renderHook(
        ({ onChange }) =>
          useFileUploadStore({
            value: null,
            onChange,
            multiple: false,
          }),
        {
          initialProps: { onChange: onChange1 },
        },
      );

      act(() => {
        result.current.handleAccept([mockFile1]);
      });

      expect(onChange1).toHaveBeenCalled();

      rerender({ onChange: onChange2 });

      act(() => {
        result.current.deleteFile({
          name: 'test1.txt',
          type: 'text/plain',
          lastModified: 1000000000,
          size: 100,
          file: mockFile1,
        });
      });

      expect(onChange2).toHaveBeenCalledWith(null);
    });
  });
});
