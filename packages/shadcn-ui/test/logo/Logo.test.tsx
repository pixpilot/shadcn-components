import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BrandLogo, Logo } from '../../src/logo';

describe('logo', () => {
  it('should render the favicon as a decorative square icon', () => {
    const { container } = render(<Logo size={32} />);
    const img = container.querySelector('img');

    expect(img?.getAttribute('src')).toBe('/favicon.svg');
    expect(img?.getAttribute('width')).toBe('32');
    expect(img?.getAttribute('height')).toBe('32');
    expect(img?.style.width).toBe('32px');
    expect(img?.getAttribute('alt')).toBe('');
    expect(img?.getAttribute('aria-hidden')).toBe('true');
  });

  it('should use a custom src and merge class names', () => {
    const { container } = render(<Logo src="/icon.svg" className="rounded" />);
    const img = container.querySelector('img');

    expect(img?.getAttribute('src')).toBe('/icon.svg');
    expect(img?.getAttribute('width')).toBe('24');
    expect(img?.className).toContain('shrink-0');
    expect(img?.className).toContain('rounded');
  });

  it('should render the brand name next to the icon', () => {
    const { container, getByText } = render(
      <BrandLogo name="Acme" size={20} logoProps={{ src: '/icon.svg' }} />,
    );
    const img = container.querySelector('img');

    expect(getByText('Acme')).toBeTruthy();
    expect(img?.getAttribute('width')).toBe('20');
    expect(img?.getAttribute('src')).toBe('/icon.svg');
  });
});
