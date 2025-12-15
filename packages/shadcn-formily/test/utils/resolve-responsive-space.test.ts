import type { SpacingConfig } from '../../src/utils/resolve-responsive-space';
import { describe, expect, it } from 'vitest';
import {
  gapYConfig,
  isResponsiveDensity,
  resolveResponsiveGapClass,
  resolveResponsiveSpaceClass,
  resolveSpacingClass,
  spaceYConfig,
} from '../../src/utils/resolve-responsive-space';

describe('resolveSpacingClass', () => {
  it('should return fixed spacing class for compact density', () => {
    const result = resolveSpacingClass('compact', spaceYConfig);
    expect(result).toBe('space-y-3');
  });

  it('should return fixed spacing class for normal density', () => {
    const result = resolveSpacingClass('normal', spaceYConfig);
    expect(result).toBe('space-y-4');
  });

  it('should return fixed spacing class for comfortable density', () => {
    const result = resolveSpacingClass('comfortable', spaceYConfig);
    expect(result).toBe('space-y-6');
  });

  it('should return responsive classes for responsive density', () => {
    const result = resolveSpacingClass('responsive', spaceYConfig);
    expect(result).toBe('space-y-3 md:space-y-4 lg:space-y-6');
  });

  it('should return responsive classes when density is undefined', () => {
    const result = resolveSpacingClass(undefined, spaceYConfig);
    expect(result).toBe('space-y-3 md:space-y-4 lg:space-y-6');
  });

  it('should work with gap config', () => {
    const result = resolveSpacingClass('compact', gapYConfig);
    expect(result).toBe('gap-y-3');
  });

  it('should work with custom spacing config', () => {
    const customConfig: SpacingConfig = {
      fixed: {
        sm: 'p-2',
        md: 'p-4',
        lg: 'p-6',
      },
      responsive: 'p-2 md:p-4 lg:p-6',
    };

    expect(resolveSpacingClass('compact', customConfig)).toBe('p-2');
    expect(resolveSpacingClass('normal', customConfig)).toBe('p-4');
    expect(resolveSpacingClass('comfortable', customConfig)).toBe('p-6');
    expect(resolveSpacingClass('responsive', customConfig)).toBe('p-2 md:p-4 lg:p-6');
  });
});

describe('resolveResponsiveSpaceClass', () => {
  it('should return space-y-3 for compact density', () => {
    const result = resolveResponsiveSpaceClass({ density: 'compact' });
    expect(result).toBe('space-y-3');
  });

  it('should return space-y-4 for normal density', () => {
    const result = resolveResponsiveSpaceClass({ density: 'normal' });
    expect(result).toBe('space-y-4');
  });

  it('should return space-y-6 for comfortable density', () => {
    const result = resolveResponsiveSpaceClass({ density: 'comfortable' });
    expect(result).toBe('space-y-6');
  });

  it('should return responsive classes for responsive density', () => {
    const result = resolveResponsiveSpaceClass({ density: 'responsive' });
    expect(result).toBe('space-y-3 md:space-y-4 lg:space-y-6');
  });

  it('should return responsive classes for undefined density', () => {
    const result = resolveResponsiveSpaceClass({});
    expect(result).toBe('space-y-3 md:space-y-4 lg:space-y-6');
  });

  it('should return responsive classes when formSpace is undefined', () => {
    const result = resolveResponsiveSpaceClass(undefined);
    expect(result).toBe('space-y-3 md:space-y-4 lg:space-y-6');
  });
});

describe('resolveResponsiveGapClass', () => {
  it('should return gap-y-3 for compact density', () => {
    const result = resolveResponsiveGapClass({ density: 'compact' });
    expect(result).toBe('gap-y-3');
  });

  it('should return gap-y-4 for normal density', () => {
    const result = resolveResponsiveGapClass({ density: 'normal' });
    expect(result).toBe('gap-y-4');
  });

  it('should return gap-y-6 for comfortable density', () => {
    const result = resolveResponsiveGapClass({ density: 'comfortable' });
    expect(result).toBe('gap-y-6');
  });

  it('should return responsive classes for responsive density', () => {
    const result = resolveResponsiveGapClass({ density: 'responsive' });
    expect(result).toBe('gap-y-3 md:gap-y-4 lg:gap-y-6');
  });

  it('should return responsive classes for undefined density', () => {
    const result = resolveResponsiveGapClass({});
    expect(result).toBe('gap-y-3 md:gap-y-4 lg:gap-y-6');
  });

  it('should return responsive classes when formSpace is undefined', () => {
    const result = resolveResponsiveGapClass(undefined);
    expect(result).toBe('gap-y-3 md:gap-y-4 lg:gap-y-6');
  });
});

describe('isResponsiveDensity', () => {
  it('should return true for responsive density', () => {
    expect(isResponsiveDensity('responsive')).toBe(true);
  });

  it('should return false for compact density', () => {
    expect(isResponsiveDensity('compact')).toBe(false);
  });

  it('should return false for normal density', () => {
    expect(isResponsiveDensity('normal')).toBe(false);
  });

  it('should return false for comfortable density', () => {
    expect(isResponsiveDensity('comfortable')).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(isResponsiveDensity(undefined)).toBe(false);
  });

  it('should return false for empty string', () => {
    expect(isResponsiveDensity('')).toBe(false);
  });

  it('should return false for unknown strings', () => {
    expect(isResponsiveDensity('unknown')).toBe(false);
  });
});

describe('spacing config objects', () => {
  it('should have spaceYConfig with correct structure', () => {
    expect(spaceYConfig).toHaveProperty('fixed');
    expect(spaceYConfig).toHaveProperty('responsive');
    expect(spaceYConfig.fixed).toHaveProperty('sm', 'space-y-3');
    expect(spaceYConfig.fixed).toHaveProperty('md', 'space-y-4');
    expect(spaceYConfig.fixed).toHaveProperty('lg', 'space-y-6');
    expect(spaceYConfig.responsive).toBe('space-y-3 md:space-y-4 lg:space-y-6');
  });

  it('should have gapYConfig with correct structure', () => {
    expect(gapYConfig).toHaveProperty('fixed');
    expect(gapYConfig).toHaveProperty('responsive');
    expect(gapYConfig.fixed).toHaveProperty('sm', 'gap-y-3');
    expect(gapYConfig.fixed).toHaveProperty('md', 'gap-y-4');
    expect(gapYConfig.fixed).toHaveProperty('lg', 'gap-y-6');
    expect(gapYConfig.responsive).toBe('gap-y-3 md:gap-y-4 lg:gap-y-6');
  });
});

describe('edge cases', () => {
  it('should handle custom config with non-standard class names', () => {
    const customConfig: SpacingConfig = {
      fixed: {
        sm: 'custom-small',
        md: 'custom-medium',
        lg: 'custom-large',
      },
      responsive: 'custom-small md:custom-medium lg:custom-large',
    };

    expect(resolveSpacingClass('compact', customConfig)).toBe('custom-small');
    expect(resolveSpacingClass('normal', customConfig)).toBe('custom-medium');
    expect(resolveSpacingClass('comfortable', customConfig)).toBe('custom-large');
    expect(resolveSpacingClass('responsive', customConfig)).toBe(
      'custom-small md:custom-medium lg:custom-large',
    );
  });

  it('should handle empty string responsive classes', () => {
    const emptyConfig: SpacingConfig = {
      fixed: {
        sm: 'sm-class',
        md: 'md-class',
        lg: 'lg-class',
      },
      responsive: '',
    };

    expect(resolveSpacingClass('responsive', emptyConfig)).toBe('');
    expect(resolveSpacingClass('compact', emptyConfig)).toBe('sm-class');
  });
});
