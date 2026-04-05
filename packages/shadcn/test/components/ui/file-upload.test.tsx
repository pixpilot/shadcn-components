import { describe, expect, it, vi } from 'vitest';
import { act, render, waitFor } from '@testing-library/react';
import React from 'react';
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadList,
  FileUploadTrigger,
  useFileUpload,
} from '../../../src/components/ui/file-upload';

/**
 * Keep these tests passing when updating or overriding this component from the shadcn registry.
 * They guard the upload-state behavior that can regress during registry syncs.
 */

function StatusProbe({ file }: { file: File }) {
  const status = useFileUpload((store) => store.files.get(file)?.status ?? 'missing');

  return <span data-testid="status">{status}</span>;
}

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
    act(() => {
      input.dispatchEvent(event);
    });

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
    act(() => {
      input.dispatchEvent(event);
    });

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
    act(() => {
      input.dispatchEvent(event);
    });

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
    act(() => {
      input.dispatchEvent(event);
    });

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
    act(() => {
      input.dispatchEvent(event);
    });

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
    act(() => {
      input.dispatchEvent(event);
    });

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

  it('should keep success state when progress is queued before immediate success', async () => {
    const uploadFile = new File(['content'], 'file.txt', { type: 'text/plain' });
    const queuedFrames = new Map<number, FrameRequestCallback>();
    let nextFrameId = 1;

    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      const frameId = nextFrameId++;
      queuedFrames.set(frameId, callback);
      return frameId;
    });

    vi.stubGlobal('cancelAnimationFrame', (frameId: number) => {
      queuedFrames.delete(frameId);
    });

    const flushAnimationFrames = () => {
      while (queuedFrames.size > 0) {
        const [frameId, callback] = queuedFrames.entries().next().value as [
          number,
          FrameRequestCallback,
        ];

        queuedFrames.delete(frameId);
        callback(performance.now());
      }
    };

    try {
      const { container, getByTestId } = render(
        React.createElement(
          FileUpload,
          {
            onUpload: (files, options) => {
              for (const file of files) {
                options.onProgress(file, 100);
                options.onSuccess(file);
              }
            },
          },
          React.createElement(
            FileUploadDropzone,
            null,
            React.createElement(FileUploadTrigger, null, 'Upload'),
          ),
          React.createElement(FileUploadList, null),
          React.createElement(StatusProbe, { file: uploadFile }),
        ),
      );

      const input = container.querySelector('input[type="file"]') as HTMLInputElement;

      Object.defineProperty(input, 'files', {
        value: [uploadFile],
        writable: true,
      });

      act(() => {
        input.dispatchEvent(new Event('change', { bubbles: true }));
      });

      act(() => {
        flushAnimationFrames();
      });

      await waitFor(() => {
        expect(getByTestId('status').textContent).toBe('success');
      });
    } finally {
      vi.unstubAllGlobals();
    }
  });
});

describe('fileUpload - transformFile prop', () => {
  it('should add the transformed file to the store, not the original', async () => {
    const originalFile = new File(['original'], 'photo.jpg', { type: 'image/jpeg' });
    const transformedFile = new File(['stripped'], 'photo.jpg', { type: 'image/jpeg' });

    function OriginalStatusProbe() {
      const status = useFileUpload(
        (store) => store.files.get(originalFile)?.status ?? 'missing',
      );
      return <span data-testid="original-status">{status}</span>;
    }

    function TransformedStatusProbe() {
      const status = useFileUpload(
        (store) => store.files.get(transformedFile)?.status ?? 'missing',
      );
      return <span data-testid="transformed-status">{status}</span>;
    }

    const { container, getByTestId } = render(
      React.createElement(
        FileUpload,
        {
          transformFile: () => transformedFile,
        },
        React.createElement(
          FileUploadDropzone,
          null,
          React.createElement(FileUploadTrigger, null, 'Upload'),
        ),
        React.createElement(FileUploadList, null),
        React.createElement(OriginalStatusProbe),
        React.createElement(TransformedStatusProbe),
      ),
    );

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    Object.defineProperty(input, 'files', { value: [originalFile], writable: true });
    act(() => {
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });

    await waitFor(() => {
      expect(getByTestId('original-status').textContent).toBe('missing');
      expect(getByTestId('transformed-status').textContent).toBe('idle');
    });
  });

  it('should call onSuccess with the transformed file after upload', async () => {
    const originalFile = new File(['original'], 'photo.jpg', { type: 'image/jpeg' });
    const transformedFile = new File(['stripped'], 'photo.jpg', { type: 'image/jpeg' });

    let capturedOnSuccess: ((file: File) => void) | undefined;

    function TransformedStatusProbe() {
      const status = useFileUpload(
        (store) => store.files.get(transformedFile)?.status ?? 'missing',
      );
      return <span data-testid="transformed-status">{status}</span>;
    }

    const { container, getByTestId } = render(
      React.createElement(
        FileUpload,
        {
          transformFile: () => transformedFile,
          onUpload: (_files, options) => {
            capturedOnSuccess = options.onSuccess;
          },
        },
        React.createElement(
          FileUploadDropzone,
          null,
          React.createElement(FileUploadTrigger, null, 'Upload'),
        ),
        React.createElement(FileUploadList, null),
        React.createElement(TransformedStatusProbe),
      ),
    );

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    Object.defineProperty(input, 'files', { value: [originalFile], writable: true });
    act(() => {
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });

    await waitFor(() => {
      expect(capturedOnSuccess).toBeDefined();
    });

    act(() => {
      capturedOnSuccess!(transformedFile);
    });

    await waitFor(() => {
      expect(getByTestId('transformed-status').textContent).toBe('success');
    });
  });

  it('should support async transforms', async () => {
    const originalFile = new File(['original'], 'photo.jpg', { type: 'image/jpeg' });
    const transformedFile = new File(['async-stripped'], 'photo.jpg', {
      type: 'image/jpeg',
    });

    function TransformedStatusProbe() {
      const status = useFileUpload(
        (store) => store.files.get(transformedFile)?.status ?? 'missing',
      );
      return <span data-testid="transformed-status">{status}</span>;
    }

    const { container, getByTestId } = render(
      React.createElement(
        FileUpload,
        {
          transformFile: async () => transformedFile,
        },
        React.createElement(
          FileUploadDropzone,
          null,
          React.createElement(FileUploadTrigger, null, 'Upload'),
        ),
        React.createElement(FileUploadList, null),
        React.createElement(TransformedStatusProbe),
      ),
    );

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    Object.defineProperty(input, 'files', { value: [originalFile], writable: true });
    act(() => {
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });

    await waitFor(() => {
      expect(getByTestId('transformed-status').textContent).toBe('idle');
    });
  });
});
