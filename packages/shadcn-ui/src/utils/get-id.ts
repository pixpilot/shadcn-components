export function getId(baseId: string | undefined, suffix: string): string | undefined {
  if (baseId != null) return `${baseId}-${suffix}`;
  return undefined;
}
