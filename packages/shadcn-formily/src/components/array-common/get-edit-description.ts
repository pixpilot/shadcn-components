/**
 * Get description text for edit dialog/popover based on context
 */
export function getEditDescription(isNew: boolean, autoSave: boolean): string {
  if (isNew) {
    return autoSave
      ? 'Enter details. Changes apply instantly.'
      : 'Enter details, then click save.';
  }

  return autoSave
    ? 'Edit details. Changes apply instantly.'
    : 'Edit details, then click save.';
}
