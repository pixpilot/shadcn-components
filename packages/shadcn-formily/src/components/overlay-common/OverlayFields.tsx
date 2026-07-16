import type React from 'react';

export interface OverlayFieldsProps {
  children?: React.ReactNode;
}

/**
 * Keeps an object's fields mounted while its overlay (dialog/popover) is closed.
 *
 * Formily destroys a field instance when its component unmounts, and the fields
 * inside a closed overlay are unmounted. Without this, `form.submit()` would
 * skip them entirely — a required field the user never opened would pass
 * validation. Rendering them in a hidden container keeps the field instances
 * alive so form-level validation still covers them.
 *
 * `hidden` (rather than unmounting) is the same approach ListItem uses to keep
 * array item fields attached while a row is collapsed.
 */
export const OverlayFields: React.FC<OverlayFieldsProps> = ({ children }) => (
  <div hidden aria-hidden="true">
    {children}
  </div>
);

OverlayFields.displayName = 'OverlayFields';
