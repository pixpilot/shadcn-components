import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { AvatarUpload } from '../../src/avatar-upload/AvatarUpload';

const fileUploadSpy = vi.fn();

vi.mock('@pixpilot/shadcn', () => {
  return {
    FileUpload: ({ children, onAccept, multiple }: any) => {
      fileUploadSpy({ onAccept, multiple });

      return (
        <div>
          <button
            type="button"
            onClick={() => {
              onAccept?.([
                new File(['avatar'], 'avatar-one.png', {
                  type: 'image/png',
                  lastModified: 1,
                }),
                new File(['avatar'], 'avatar-two.png', {
                  type: 'image/png',
                  lastModified: 2,
                }),
              ]);
            }}
          >
            accept files
          </button>
          {children}
        </div>
      );
    },
    FileUploadDropzone: ({ children, className }: any) => {
      return <div className={className}>{children}</div>;
    },
    FileUploadList: ({ children }: any) => {
      return <div>{children}</div>;
    },
  };
});

vi.mock('../../src/avatar-upload/AvatarUploadItem', () => {
  return {
    AvatarUploadItem: ({ file }: { file: File }) => {
      return <div>{file.name}</div>;
    },
  };
});

describe('avatar-upload', () => {
  it('forces single-file mode and keeps only the first accepted file', () => {
    const onAccept = vi.fn();

    render(<AvatarUpload onAccept={onAccept} />);

    expect(fileUploadSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        multiple: false,
        onAccept: expect.any(Function),
      }),
    );

    fireEvent.click(screen.getByRole('button', { name: 'accept files' }));

    expect(onAccept).toHaveBeenCalledWith([
      expect.objectContaining({
        name: 'avatar-one.png',
      }),
    ]);
    expect(onAccept).not.toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ name: 'avatar-two.png' })]),
    );
    expect(screen.getByText('avatar-one.png')).toBeTruthy();
    expect(screen.queryByText('avatar-two.png')).toBeNull();
  });
});
