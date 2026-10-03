const MAX_INITIALS = 2;

/** Up to two initials for an avatar fallback; `?` when there is no name. */
export function getInitials(name: string | null | undefined): string {
  const value = name ?? '';
  const parts = value.split(/[\s._-]+/u).filter((part) => part.length > 0);

  if (parts.length === 0) {
    return '?';
  }

  return parts
    .slice(0, MAX_INITIALS)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}
