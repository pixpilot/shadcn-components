import { colorUtils } from '@pixpilot/shadcn';

export type ColorPickerBaseFormat = 'hex' | 'rgb' | 'hsl' | 'hsb';

const HEX_WITHOUT_ALPHA_SHORT_TOTAL_LENGTH = 4;
const HEX_WITHOUT_ALPHA_LONG_TOTAL_LENGTH = 7;
const OPAQUE_ALPHA_HEX = 'ff';

export function isHexWithoutAlphaString(value: string): boolean {
  const trimmed = value.trim().toLowerCase();
  if (!trimmed.startsWith('#')) return false;

  return (
    trimmed.length === HEX_WITHOUT_ALPHA_SHORT_TOTAL_LENGTH ||
    trimmed.length === HEX_WITHOUT_ALPHA_LONG_TOTAL_LENGTH
  );
}

export function toPickerValue(params: {
  currentValue: string;
  currentFormat: ColorPickerBaseFormat;
  forceOpaqueHex: string | null;
}): string {
  const { currentValue, currentFormat, forceOpaqueHex } = params;

  if (forceOpaqueHex === null) return currentValue;
  if (currentFormat !== 'hex') return currentValue;

  const normalizedCurrent = currentValue.trim().toLowerCase();
  if (normalizedCurrent !== forceOpaqueHex) return currentValue;

  return `${forceOpaqueHex}${OPAQUE_ALPHA_HEX}`;
}

export function getSwatchSelectionResult(params: {
  swatchValue: string;
  desiredFormat: ColorPickerBaseFormat;
}): {
  value: string;
  forceOpaqueHex: string | null;
} {
  const { swatchValue, desiredFormat } = params;

  const parsed = colorUtils.parseColorString(swatchValue);
  if (!parsed) {
    return {
      value: swatchValue,
      forceOpaqueHex: null,
    };
  }

  const isHexWithoutAlpha = isHexWithoutAlphaString(swatchValue);
  const normalizedColor = isHexWithoutAlpha ? { ...parsed, a: 1 } : parsed;

  if (desiredFormat === 'hex' && isHexWithoutAlpha) {
    const baseHex = colorUtils.colorToString(normalizedColor, 'hex');
    return {
      value: baseHex,
      forceOpaqueHex: baseHex.trim().toLowerCase(),
    };
  }

  return {
    value: colorUtils.colorToString(normalizedColor, desiredFormat),
    forceOpaqueHex: null,
  };
}
