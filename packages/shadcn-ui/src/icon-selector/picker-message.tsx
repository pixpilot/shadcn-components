import type { FC } from 'react';

interface LoadingMessageProps {
  message?: string;
}

const PickerMessage: FC<LoadingMessageProps> = ({ message = 'Loading...' }) => (
  <div className="flex items-center justify-center py-8">
    <p className="text-sm text-muted-foreground">{message}</p>
  </div>
);

export default PickerMessage;
