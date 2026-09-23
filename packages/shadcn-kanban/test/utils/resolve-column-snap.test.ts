import { describe, expect, it } from 'vitest';
import {
  COLUMN_SNAP_WIDTH_VAR,
  resolveColumnSnap,
} from '../../src/utils/resolve-column-snap';

describe('resolveColumnSnap', () => {
  describe('when snapping is off', () => {
    it('should contribute nothing to the board or its columns', () => {
      const snap = resolveColumnSnap(false, false);

      expect(snap).toEqual({ enabled: false, boardClassName: '', columnClassName: '' });
    });
  });

  describe('when snapping is on', () => {
    it('should snap only below the sm breakpoint', () => {
      const snap = resolveColumnSnap(true, false);

      /* Unprefixed snap classes would turn a desktop board into a slider too. */
      expect(snap.boardClassName).toContain('max-sm:snap-x');
      expect(snap.boardClassName).toContain('max-sm:snap-mandatory');
      expect(snap.columnClassName).toContain('max-sm:snap-start');
    });

    it('should stop a flick from skipping past a column', () => {
      expect(resolveColumnSnap(true, false).columnClassName).toContain(
        'max-sm:snap-always',
      );
    });

    it('should default to a column that leaves the next one peeking in', () => {
      const snap = resolveColumnSnap(true, false);

      expect(snap.style).toEqual({ [COLUMN_SNAP_WIDTH_VAR]: '85%' });
      expect(snap.columnClassName).toContain(
        'max-sm:w-[var(--kanban-column-snap-width)]',
      );
    });

    it('should take a custom width and alignment', () => {
      const snap = resolveColumnSnap({ align: 'center', columnWidth: '20rem' }, false);

      expect(snap.style).toEqual({ [COLUMN_SNAP_WIDTH_VAR]: '20rem' });
      expect(snap.columnClassName).toContain('max-sm:snap-center');
      expect(snap.columnClassName).not.toContain('max-sm:snap-start');
    });

    it('should treat an omitted prop as enabled', () => {
      expect(resolveColumnSnap(undefined, false).enabled).toBe(true);
    });
  });

  describe('while a drag is in flight', () => {
    it('should suspend snapping so auto-scroll is not pulled back', () => {
      const snap = resolveColumnSnap(true, true);

      expect(snap.boardClassName).toBe('snap-none');
      expect(snap.boardClassName).not.toContain('snap-mandatory');
    });

    it('should keep the column sized, so nothing reflows mid-gesture', () => {
      expect(resolveColumnSnap(true, true).columnClassName).toContain(
        'max-sm:w-[var(--kanban-column-snap-width)]',
      );
    });
  });
});
