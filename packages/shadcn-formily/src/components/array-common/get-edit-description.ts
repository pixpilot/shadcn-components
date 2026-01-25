/**
 * Get description text for edit dialog/popover based on context
 */
export function getEditDescription(isNew: boolean, autoSave: boolean): string {
  if (isNew) {
    return autoSave
      ? 'Fill in the details for the new item. Changes are applied immediately.'
      : "Fill in the details for the new item. Click save when you're done.";
  }

  return autoSave
    ? 'Make changes to the item. Changes are applied immediately.'
    : "Make changes to the item. Click save when you're done.";
}
