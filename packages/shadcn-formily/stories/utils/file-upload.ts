import type { FileUploadProgressCallBacks } from '../../src/components/file-upload';

export async function delay(val: number): Promise<void> {
  await new Promise((resolve) => {
    setTimeout(resolve, val);
  });
}

export function handleUpload(files: File[], options: FileUploadProgressCallBacks): void {
  const maxProgress = 90;
  const progressIncrement = 5;
  const minIncrement = 1;
  const intervalMs = 200;
  const minDelay = 2000;
  const delayRange = 2000;
  const finalProgress = 100;

  for (const uploadFile of files) {
    // eslint-disable-next-line no-void
    void (async () => {
      let progress = 0;
      const intervalId = setInterval(() => {
        progress += Math.random() * progressIncrement + minIncrement; // Increase progress gradually
        if (progress > maxProgress) progress = maxProgress;
        options.onProgress(uploadFile, progress);
      }, intervalMs); // Update every 200ms for smoother progress

      // Simulate upload time with random delay
      await delay(minDelay + Math.random() * delayRange); // 2-4 seconds

      clearInterval(intervalId);
      options.onProgress(uploadFile, finalProgress);

      await delay(500);

      options.onSuccess(uploadFile);
    })();
  }
}
