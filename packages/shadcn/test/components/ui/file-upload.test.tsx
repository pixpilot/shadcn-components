import { describe, expect, it, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import React from 'react';
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadList,
  FileUploadTrigger,
} from '../../../src/components/ui/file-upload';

describe('fileUpload - onFilesReject prop', () => {
  it('should call onFilesReject with rejected files exceeding maxFiles', async () => {
    const onFilesReject = vi.fn();
    const { container } = render(
      React.createElement(
        FileUpload,
        { maxFiles: 2, onFilesReject },
        React.createElement(
          FileUploadDropzone,
          null,
          React.createElement(FileUploadTrigger, null, 'Upload'),
        ),
        React.createElement(FileUploadList, null),
      ),
    );

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const files = [
      new File(['content1'], 'file1.txt', { type: 'text/plain' }),
      new File(['content2'], 'file2.txt', { type: 'text/plain' }),
      new File(['content3'], 'file3.txt', { type: 'text/plain' }),
      new File(['content4'], 'file4.txt', { type: 'text/plain' }),
      new File(['content5'], 'file5.txt', { type: 'text/plain' }),
    ];

    // Use Object.defineProperty to set files on the input
    Object.defineProperty(input, 'files', {
      value: files,
      writable: true,
    });

    const event = new Event('change', { bubbles: true });
    input.dispatchEvent(event);

    await waitFor(() => {
      expect(onFilesReject).toHaveBeenCalled();
    });

    const rejectedFiles = onFilesReject.mock.calls[0]?.[0] as Array<{
      file: File;
      message: string;
    }>;
    expect(rejectedFiles).toHaveLength(3);
    expect(rejectedFiles[0]?.file.name).toBe('file3.txt');
    expect(rejectedFiles[0]?.message).toBe('Maximum 2 files allowed');
  });

  it('should call onFilesReject when files do not match accept type', async () => {
    const onFilesReject = vi.fn();
    const { container } = render(
      React.createElement(
        FileUpload,
        { accept: 'image/*', onFilesReject },
        React.createElement(
          FileUploadDropzone,
          null,
          React.createElement(FileUploadTrigger, null, 'Upload'),
        ),
        React.createElement(FileUploadList, null),
      ),
    );

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const files = [
      new File(['content'], 'document.pdf', { type: 'application/pdf' }),
      new File(['content'], 'document.txt', { type: 'text/plain' }),
    ];

    // Use Object.defineProperty to set files on the input
    Object.defineProperty(input, 'files', {
      value: files,
      writable: true,
    });

    const event = new Event('change', { bubbles: true });
    input.dispatchEvent(event);

    await waitFor(() => {
      expect(onFilesReject).toHaveBeenCalled();
    });

    const rejectedFiles = onFilesReject.mock.calls[0]?.[0] as Array<{
      file: File;
      message: string;
    }>;
    expect(rejectedFiles).toHaveLength(2);
    expect(rejectedFiles.every((r) => r.message === 'File type not accepted')).toBe(true);
  });

  it('should call onFilesReject when files exceed maxSize', async () => {
    const onFilesReject = vi.fn();
    const maxSize = 100;
    const { container } = render(
      React.createElement(
        FileUpload,
        { maxSize, onFilesReject },
        React.createElement(
          FileUploadDropzone,
          null,
          React.createElement(FileUploadTrigger, null, 'Upload'),
        ),
        React.createElement(FileUploadList, null),
      ),
    );

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const files = [
      new File(['a'.repeat(50)], 'small.txt', { type: 'text/plain' }),
      new File(['b'.repeat(150)], 'large.txt', { type: 'text/plain' }),
    ];

    // Use Object.defineProperty to set files on the input
    Object.defineProperty(input, 'files', {
      value: files,
      writable: true,
    });

    const event = new Event('change', { bubbles: true });
    input.dispatchEvent(event);

    await waitFor(() => {
      expect(onFilesReject).toHaveBeenCalled();
    });

    const rejectedFiles = onFilesReject.mock.calls[0]?.[0] as Array<{
      file: File;
      message: string;
    }>;
    expect(rejectedFiles).toHaveLength(1);
    expect(rejectedFiles[0]?.file.name).toBe('large.txt');
    expect(rejectedFiles[0]?.message).toBe('File too large');
  });

  it('should not call onFilesReject when all files are accepted', async () => {
    const onFilesReject = vi.fn();
    const onAccept = vi.fn();
    const { container } = render(
      React.createElement(
        FileUpload,
        { maxFiles: 5, accept: 'text/*', onFilesReject, onAccept },
        React.createElement(
          FileUploadDropzone,
          null,
          React.createElement(FileUploadTrigger, null, 'Upload'),
        ),
        React.createElement(FileUploadList, null),
      ),
    );

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const files = [
      new File(['content1'], 'file1.txt', { type: 'text/plain' }),
      new File(['content2'], 'file2.txt', { type: 'text/plain' }),
    ];

    // Use Object.defineProperty to set files on the input
    Object.defineProperty(input, 'files', {
      value: files,
      writable: true,
    });

    const event = new Event('change', { bubbles: true });
    input.dispatchEvent(event);

    await waitFor(() => {
      expect(onAccept).toHaveBeenCalled();
    });

    expect(onFilesReject).not.toHaveBeenCalled();
  });

  it('should call onFilesReject with correct file and message structure', async () => {
    const onFilesReject = vi.fn();
    const { container } = render(
      React.createElement(
        FileUpload,
        { maxFiles: 1, onFilesReject },
        React.createElement(
          FileUploadDropzone,
          null,
          React.createElement(FileUploadTrigger, null, 'Upload'),
        ),
        React.createElement(FileUploadList, null),
      ),
    );

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const files = [
      new File(['content'], 'file1.txt', { type: 'text/plain' }),
      new File(['content'], 'file2.txt', { type: 'text/plain' }),
    ];

    // Use Object.defineProperty to set files on the input
    Object.defineProperty(input, 'files', {
      value: files,
      writable: true,
    });

    const event = new Event('change', { bubbles: true });
    input.dispatchEvent(event);

    await waitFor(() => {
      expect(onFilesReject).toHaveBeenCalled();
    });

    const rejectedFiles = onFilesReject.mock.calls[0]?.[0] as Array<{
      file: File;
      message: string;
    }>;
    expect(rejectedFiles).toHaveLength(1);
    expect(rejectedFiles[0]).toHaveProperty('file');
    expect(rejectedFiles[0]).toHaveProperty('message');
    expect(rejectedFiles[0]?.file).toBeInstanceOf(File);
    expect(typeof rejectedFiles[0]?.message).toBe('string');
  });

  it('should call both onFileReject and onFilesReject', async () => {
    const onFileReject = vi.fn();
    const onFilesReject = vi.fn();
    const { container } = render(
      React.createElement(
        FileUpload,
        { maxFiles: 1, onFileReject, onFilesReject },
        React.createElement(
          FileUploadDropzone,
          null,
          React.createElement(FileUploadTrigger, null, 'Upload'),
        ),
        React.createElement(FileUploadList, null),
      ),
    );

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const files = [
      new File(['content'], 'file1.txt', { type: 'text/plain' }),
      new File(['content'], 'file2.txt', { type: 'text/plain' }),
      new File(['content'], 'file3.txt', { type: 'text/plain' }),
    ];

    // Use Object.defineProperty to set files on the input
    Object.defineProperty(input, 'files', {
      value: files,
      writable: true,
    });

    const event = new Event('change', { bubbles: true });
    input.dispatchEvent(event);

    await waitFor(() => {
      expect(onFileReject).toHaveBeenCalled();
      expect(onFilesReject).toHaveBeenCalled();
    });

    expect(onFileReject).toHaveBeenCalledTimes(2);

    const rejectedFiles = onFilesReject.mock.calls[0]?.[0] as Array<{
      file: File;
      message: string;
    }>;
    expect(rejectedFiles).toHaveLength(2);
  });
});
