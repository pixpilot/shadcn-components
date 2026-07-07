import type { ComponentMeta } from '../src/types';
import { describe, expect, it } from 'vitest';

import { DEFAULT_SEARCH_LIMIT, searchComponents } from '../src/search';

function meta(
  name: string,
  category: string,
  description: string,
  keywords: string[] = [],
): ComponentMeta {
  return { name, category, description, keywords, props: {}, examples: [] };
}

const registry: ComponentMeta[] = [
  meta('Button', 'Actions', 'A clickable button with variants.', [
    'click',
    'submit',
    'cta',
  ]),
  meta('Input', 'Forms', 'A single-line text field.', ['text', 'field', 'form']),
  meta('Dialog', 'Overlay', 'A modal dialog overlay.', ['modal', 'popup', 'overlay']),
  meta('Alert', 'Feedback', 'A callout for important messages.', [
    'notification',
    'banner',
  ]),
  meta('Card', 'Layout', 'A container that groups related content.', [
    'container',
    'panel',
  ]),
  meta('Accordion', 'Disclosure', 'A vertically stacked set of collapsible sections.', [
    'collapse',
    'expand',
  ]),
];

const names = (results: { name: string }[]): string[] => results.map((r) => r.name);

describe('searchComponents', () => {
  it('returns an alphabetical list in query-less list mode', () => {
    const results = searchComponents(registry, '');

    expect(names(results)).toEqual([
      'Accordion',
      'Alert',
      'Button',
      'Card',
      'Dialog',
      'Input',
    ]);
    expect(results.every((r) => r.score === 0)).toBe(true);
  });

  it('treats a whitespace-only query as list mode', () => {
    const results = searchComponents(registry, '   ');

    expect(names(results)).toEqual([
      'Accordion',
      'Alert',
      'Button',
      'Card',
      'Dialog',
      'Input',
    ]);
  });

  it('ranks an exact name match first', () => {
    const results = searchComponents(registry, 'button');

    expect(results[0]?.name).toBe('Button');
    expect(results[0]?.score).toBeGreaterThan(0);
  });

  it('is case insensitive', () => {
    expect(searchComponents(registry, 'BUTTON')[0]?.name).toBe('Button');
  });

  it('scores a prefix match higher than a substring-only match', () => {
    const registryWithPrefix: ComponentMeta[] = [
      meta('Card', 'Layout', 'A card.'),
      meta('Placard', 'Misc', 'Contains the letters card inside.'),
    ];
    const results = searchComponents(registryWithPrefix, 'card');

    expect(results[0]?.name).toBe('Card');
    expect(names(results)).toContain('Placard');
    const card = results.find((r) => r.name === 'Card');
    const placard = results.find((r) => r.name === 'Placard');
    expect(card?.score).toBeGreaterThan(placard?.score ?? 0);
  });

  it('matches on keywords', () => {
    const results = searchComponents(registry, 'modal');

    expect(results[0]?.name).toBe('Dialog');
  });

  it('matches on category', () => {
    const results = searchComponents(registry, 'forms');

    expect(names(results)).toContain('Input');
  });

  it('matches on description tokens for multi-word queries', () => {
    const results = searchComponents(registry, 'collapsible sections');

    expect(results[0]?.name).toBe('Accordion');
  });

  it('tolerates a small typo in the component name', () => {
    const results = searchComponents(registry, 'buton');

    expect(names(results)).toContain('Button');
  });

  it('does not fuzzy-match wildly different queries', () => {
    const results = searchComponents(registry, 'xyzzy');

    expect(results).toEqual([]);
  });

  it('excludes non-matching components', () => {
    const results = searchComponents(registry, 'dialog');

    expect(names(results)).toEqual(['Dialog']);
  });

  it('respects the provided limit', () => {
    const results = searchComponents(registry, '', 2);

    expect(results).toHaveLength(2);
  });

  it('defaults to DEFAULT_SEARCH_LIMIT results', () => {
    const many: ComponentMeta[] = Array.from(
      { length: DEFAULT_SEARCH_LIMIT + 5 },
      (_, i) => meta(`Widget${i}`, 'Misc', 'A widget.'),
    );
    const results = searchComponents(many, 'widget');

    expect(results).toHaveLength(DEFAULT_SEARCH_LIMIT);
  });

  it('sorts equal scores alphabetically for stable output', () => {
    const tied: ComponentMeta[] = [
      meta('Zeta', 'Misc', 'The widget component.', ['widget']),
      meta('Alpha', 'Misc', 'The widget component.', ['widget']),
    ];
    const results = searchComponents(tied, 'widget');

    expect(names(results)).toEqual(['Alpha', 'Zeta']);
  });

  it('handles components without keywords', () => {
    const noKeywords: ComponentMeta[] = [
      {
        name: 'Plain',
        category: 'Misc',
        description: 'No keywords here.',
        props: {},
        examples: [],
      },
    ];

    expect(() => searchComponents(noKeywords, 'plain')).not.toThrow();
    expect(searchComponents(noKeywords, 'plain')[0]?.name).toBe('Plain');
  });
});
