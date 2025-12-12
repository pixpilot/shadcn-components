import { describe, expect, it } from 'vitest';
import { mergeFileMetadata } from '../../../src/file-upload/utils';

describe('mergeFilesMetaWithFiles', () => {
  it('should return empty array when existingFiles is empty and newFiles is empty', () => {
    const result = mergeFileMetadata([], []);
    expect(result).toEqual([]);
  });

  it('should return empty array when existingFiles is empty and newFiles is empty (alternative)', () => {
    const result = mergeFileMetadata([], []);
    expect(result).toEqual([]);
  });

  it('should return new files when existingFiles is empty', () => {
    const mockFile = {
      name: 'test.txt',
      type: 'text/plain',
      lastModified: 1234567890,
      size: 1024,
    } as File;

    const result = mergeFileMetadata([], [mockFile]);
    expect(result).toEqual([
      {
        name: 'test.txt',
        type: 'text/plain',
        lastModified: 1234567890,
        size: 1024,
        file: mockFile,
      },
    ]);
  });

  it('should return new files when existingFiles is empty (alternative)', () => {
    const mockFile = {
      name: 'test.txt',
      type: 'text/plain',
      lastModified: 1234567890,
      size: 1024,
    } as File;

    const result = mergeFileMetadata([], [mockFile]);
    expect(result).toEqual([
      {
        name: 'test.txt',
        type: 'text/plain',
        lastModified: 1234567890,
        size: 1024,
        file: mockFile,
      },
    ]);
  });

  it('should return existing file when newFiles is empty and existingFiles has single', () => {
    const existing = {
      name: 'existing.txt',
      type: 'text/plain',
      size: 512,
      lastModified: 987654321,
    };

    const result = mergeFileMetadata([existing], []);
    expect(result).toEqual([existing]);
  });

  it('should return existing files when newFiles is empty and existingFiles is array', () => {
    const existing = [
      {
        name: 'existing1.txt',
        type: 'text/plain',
        size: 512,
        lastModified: 987654321,
      },
      {
        name: 'existing2.txt',
        type: 'text/plain',
        size: 256,
        lastModified: 123456789,
      },
    ];

    const result = mergeFileMetadata(existing, []);
    expect(result).toEqual(existing);
  });

  it('should keep files with same name but different lastModified', () => {
    const existing = {
      name: 'test.txt',
      type: 'text/plain',
      size: 512,
      lastModified: 987654321,
    };

    const mockFile = {
      name: 'test.txt',
      type: 'text/plain',
      lastModified: 1234567890,
      size: 1024,
    } as File;

    const result = mergeFileMetadata([existing], [mockFile]);
    expect(result).toEqual([
      {
        name: 'test.txt',
        type: 'text/plain',
        lastModified: 987654321,
        size: 512,
      },
      {
        name: 'test.txt',
        type: 'text/plain',
        lastModified: 1234567890,
        size: 1024,
        file: mockFile,
      },
    ]);
  });

  it('should replace duplicate by name even when lastModified is the same', () => {
    const existing = {
      name: 'test.txt',
      type: 'text/plain',
      size: 512,
      lastModified: 1234567890,
    };

    const mockFile = {
      name: 'test.txt',
      type: 'text/plain',
      lastModified: 1234567890,
      size: 1024, // different size
    } as File;

    const result = mergeFileMetadata([existing], [mockFile]);
    expect(result).toEqual([
      {
        name: 'test.txt',
        type: 'text/plain',
        lastModified: 1234567890,
        size: 1024, // new size
        file: mockFile,
      },
    ]);
  });

  it('should add new files and keep existing with different lastModified', () => {
    const existing = [
      {
        name: 'existing.txt',
        type: 'text/plain',
        size: 512,
        lastModified: 987654321,
      },
    ];

    const mockFile1 = {
      name: 'new.txt',
      type: 'text/plain',
      lastModified: 111111111,
      size: 2048,
    } as File;

    const mockFile2 = {
      name: 'existing.txt', // same name, different lastModified
      type: 'text/plain',
      lastModified: 222222222,
      size: 4096,
    } as File;

    const result = mergeFileMetadata(existing, [mockFile1, mockFile2]);
    expect(result).toEqual([
      {
        name: 'existing.txt',
        type: 'text/plain',
        lastModified: 987654321,
        size: 512,
      },
      {
        name: 'new.txt',
        type: 'text/plain',
        lastModified: 111111111,
        size: 2048,
        file: mockFile1,
      },
      {
        name: 'existing.txt',
        type: 'text/plain',
        lastModified: 222222222,
        size: 4096,
        file: mockFile2,
      },
    ]);
  });

  it('should handle multiple new files', () => {
    const mockFile1 = {
      name: 'file1.txt',
      type: 'text/plain',
      lastModified: 1000000000,
      size: 100,
    } as File;

    const mockFile2 = {
      name: 'file2.txt',
      type: 'text/plain',
      lastModified: 2000000000,
      size: 200,
    } as File;

    const result = mergeFileMetadata([], [mockFile1, mockFile2]);
    expect(result).toEqual([
      {
        name: 'file1.txt',
        type: 'text/plain',
        lastModified: 1000000000,
        size: 100,
        file: mockFile1,
      },
      {
        name: 'file2.txt',
        type: 'text/plain',
        lastModified: 2000000000,
        size: 200,
        file: mockFile2,
      },
    ]);
  });
});
