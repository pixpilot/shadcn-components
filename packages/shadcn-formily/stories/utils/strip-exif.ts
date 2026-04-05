async function toBlob(canvas: HTMLCanvasElement, fileType: string): Promise<Blob> {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob == null) {
          reject(new Error('toBlob failed'));
          return;
        }

        resolve(blob);
      },
      fileType,
      fileType === 'image/jpeg' ? 0.9 : undefined,
    );
  });
}

export async function stripExif(file: File): Promise<File> {
  if (!file.type.startsWith('image/')) {
    return file;
  }

  const url = URL.createObjectURL(file);

  try {
    const bitmap = await createImageBitmap(file);

    try {
      const canvas = document.createElement('canvas');
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;

      const context = canvas.getContext('2d');

      if (context == null) {
        throw new Error('Unable to access canvas context');
      }

      context.drawImage(bitmap, 0, 0);

      const blob = await toBlob(canvas, file.type);

      return new File([blob], file.name, {
        type: blob.type || file.type,
        lastModified: file.lastModified,
      });
    } finally {
      bitmap.close();
    }
  } finally {
    URL.revokeObjectURL(url);
  }
}
