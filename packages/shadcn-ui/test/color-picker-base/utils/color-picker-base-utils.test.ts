import { describe, expect, it } from 'vitest';
import {
  getSwatchSelectionResult,
  isHexWithoutAlphaString,
  toPickerValue,
} from '../../../src/ColorPickerBase/utils/color-picker-base-utils';

describe('color-picker-base-utils', () => {
  describe('isHexWithoutAlphaString', () => {
    it('returns true for #RGB and #RRGGBB', () => {
      expect(isHexWithoutAlphaString('#fff')).toBe(true);
      expect(isHexWithoutAlphaString('#FFFFFF')).toBe(true);
      expect(isHexWithoutAlphaString('  #a1B2c3  ')).toBe(true);
    });

    it('returns false for hex with alpha', () => {
      expect(isHexWithoutAlphaString('#ffff')).toBe(false);
      expect(isHexWithoutAlphaString('#ffffffff')).toBe(false);
    });

    it('returns false for non-hex strings', () => {
      expect(isHexWithoutAlphaString('rgb(0, 0, 0)')).toBe(false);
      expect(isHexWithoutAlphaString('')).toBe(false);
      expect(isHexWithoutAlphaString('   ')).toBe(false);
    });
  });

  describe('toPickerValue', () => {
    it('returns currentValue when forceOpaqueHex is null', () => {
      expect(
        toPickerValue({
          currentValue: '#ff0000',
          currentFormat: 'hex',
          forceOpaqueHex: null,
        }),
      ).toBe('#ff0000');
    });

    it('returns currentValue when currentFormat is not hex', () => {
      expect(
        toPickerValue({
          currentValue: '#ff0000',
          currentFormat: 'rgb',
          forceOpaqueHex: '#ff0000',
        }),
      ).toBe('#ff0000');
    });

    it('returns currentValue when currentValue does not match forceOpaqueHex', () => {
      expect(
        toPickerValue({
          currentValue: '#00ff00',
          currentFormat: 'hex',
          forceOpaqueHex: '#ff0000',
        }),
      ).toBe('#00ff00');
    });

    it('appends ff when currentValue matches forceOpaqueHex in hex format', () => {
      expect(
        toPickerValue({
          currentValue: '  #FF0000 ',
          currentFormat: 'hex',
          forceOpaqueHex: '#ff0000',
        }),
      ).toBe('#ff0000ff');
    });
  });

  describe('getSwatchSelectionResult', () => {
    it('returns raw value if the swatch value is not parseable', () => {
      expect(
        getSwatchSelectionResult({
          swatchValue: 'not-a-color',
          desiredFormat: 'rgb',
        }),
      ).toEqual({
        value: 'not-a-color',
        forceOpaqueHex: null,
      });
    });

    it('converts hex swatch to rgb when desiredFormat is rgb', () => {
      const result = getSwatchSelectionResult({
        swatchValue: '#ff0000',
        desiredFormat: 'rgb',
      });

      expect(result.forceOpaqueHex).toBe(null);
      expect(result.value).toBe('rgb(255, 0, 0)');
    });

    it('forces opaque alpha when desiredFormat is hex and swatch is hex without alpha', () => {
      const result = getSwatchSelectionResult({
        swatchValue: '#00ff00',
        desiredFormat: 'hex',
      });

      expect(result.value).toBe('#00ff00');
      expect(result.forceOpaqueHex).toBe('#00ff00');
    });

    it('keeps alpha when swatch includes alpha and desiredFormat is rgb', () => {
      const result = getSwatchSelectionResult({
        swatchValue: '#ff000080',
        desiredFormat: 'rgb',
      });

      expect(result.forceOpaqueHex).toBe(null);
      expect(result.value).toBe('rgba(255, 0, 0, 0.5019607843137255)');
    });
  });
});
