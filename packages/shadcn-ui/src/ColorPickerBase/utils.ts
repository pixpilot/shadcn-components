export function isTransparent(color: string | null | undefined): boolean {
  if (color == null) return true;
  const colorNormalized = color.trim().toLowerCase().split(' ').join('');
  const ALPHA_LENGTH = 2;

  // Check for 8-digit hex with alpha (e.g., #27874f00)
  if (/^#[0-9a-f]{8}$/u.test(colorNormalized)) {
    const alpha = colorNormalized.slice(-ALPHA_LENGTH);
    if (alpha === '00') return true;
  }

  // Check for rgba with alpha = 0
  if (
    /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*0\s*\)$/u.test(
      colorNormalized.replace(/\s/gu, ''),
    )
  ) {
    return true;
  }

  // Check for hsla/hsva with alpha = 0
  if (
    /^hsla?\(\s*\d+\s*,\s*\d+%?\s*,\s*\d+%?\s*,\s*0\s*\)$/u.test(
      colorNormalized.replace(/\s/gu, ''),
    )
  ) {
    return true;
  }

  // Check for specific values
  return colorNormalized === '#00000000' || colorNormalized === 'transparent';
}
