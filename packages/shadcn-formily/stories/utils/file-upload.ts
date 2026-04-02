import type { FileUploadProgressCallBacks } from '../../src/components/file-upload';

export async function delay(val: number): Promise<void> {
  await new Promise((resolve) => {
    setTimeout(resolve, val);
  });
}

/**
 * Mock upload handler that always fails after a short progress simulation.
 * Use this in stories that demonstrate the error path of `mapUploadProps`.
 */
export function handleUploadWithError(
  files: File[],
  options: FileUploadProgressCallBacks,
): void {
  const progressIncrement = 8;
  const minIncrement = 2;
  const intervalMs = 200;
  const failAfterMs = 1500;
  const maxProgress = 60;

  for (const uploadFile of files) {
    // eslint-disable-next-line no-void
    void (async () => {
      let progress = 0;
      const intervalId = setInterval(() => {
        progress += Math.random() * progressIncrement + minIncrement;
        if (progress > maxProgress) progress = maxProgress;
        options.onProgress(uploadFile, progress);
      }, intervalMs);

      await delay(failAfterMs);

      clearInterval(intervalId);
      options.onError(uploadFile, new Error('Simulated upload failure'));
    })();
  }
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
