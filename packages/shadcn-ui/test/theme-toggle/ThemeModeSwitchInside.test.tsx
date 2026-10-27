import { fireEvent, render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { ThemeModeSwitchInside } from '../../src/theme-toggle';

describe('themeModeSwitchInside', () => {
  it('should render hidden and unchecked on the server', () => {
    const html = renderToString(<ThemeModeSwitchInside value="dark" />);

    expect(html).toContain('invisible');
    expect(html).toContain('aria-checked="false"');
  });

  it('should show the theme once mounted', () => {
    render(<ThemeModeSwitchInside value="dark" ariaLabel="Dark mode" />);
    const toggle = screen.getByRole('switch', { name: 'Dark mode' });

    expect(toggle.getAttribute('aria-checked')).toBe('true');
    expect(toggle.parentElement?.className).not.toContain('invisible');
  });

  it('should report the new theme', () => {
    const onChange = vi.fn();
    render(<ThemeModeSwitchInside value="light" onChange={onChange} />);

    fireEvent.click(screen.getByRole('switch'));

    expect(onChange).toHaveBeenCalledWith('dark');
  });
});
