/**
 * Whether a field value holds nothing the user would consider data.
 *
 * Used to pick the trigger verb: an object with no data reads "Add <title>",
 * one with data reads "Edit <title>".
 *
 * Comparing `value` against `initialValue` does not work here: Formily gives an
 * object field an initial value of `{}` while its `initialValue` stays
 * undefined, so an untouched object would always look changed. Empty strings
 * count as empty because clearing an input leaves `''` behind, but `false` and
 * `0` are real values.
 */
export function isEmptyFieldValue(value: unknown): boolean {
  if (value == null || value === '') return true;

  if (Array.isArray(value)) {
    return value.every(isEmptyFieldValue);
  }

  if (typeof value === 'object') {
    return Object.values(value).every(isEmptyFieldValue);
  }

  return false;
}
