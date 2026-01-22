/**
 * Checks if a value is an SVG markup string
 * @param value - The value to check
 * @returns True if the value is a string starting with '<svg' and ending with '</svg>'
 */
export function isSvgMarkupString(value: unknown): value is string {
  if (typeof value !== 'string') return false;

  const trimmed = value.trim();
  return trimmed.startsWith('<svg') && trimmed.endsWith('</svg>');
}

/**
 * Converts SVG markup string to a CSS mask-image data URL
 * Useful for rendering SVG strings as masked icons that inherit currentColor
 * @param svgMarkup - The SVG markup string
 * @returns A CSS url() value for use in mask-image properties
 */
export function svgMarkupToMaskUrl(svgMarkup: string): string {
  const encoded = encodeURIComponent(svgMarkup)
    .replace(/'/gu, '%27')
    .replace(/"/gu, '%22');
  return `url("data:image/svg+xml,${encoded}")`;
}
