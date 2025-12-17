import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Layout, LayoutFooter, LayoutHeader, LayoutMain } from '../src/layout';

/**
 * Layout components for structuring the application interface.
 * Includes LayoutHeader, Layout, LayoutFooter, LayoutFooterBar, and LayoutMain container.
 *
 * ## Troubleshooting: "Disappearing Layout"
 *
 * If your Layout has zero height or disappears, it's likely because CSS percentage heights require
 * the parent to have a defined height. Here are two solutions:
 *
 * ### 1. Parent Container with Height
 * ```tsx
 * // ✅ Define the parent height
 * <div className="h-[500px]">
 *   <Layout>...</Layout>
 * </div>
 * ```
 *
 * ### 2. Full-Page App
 * Add this to your global CSS:
 * ```css
 * @layer base {
 *   html, body, #root {
 *     height: 100%;
 *   }
 * }
 * ```
 *
 * ## Key Points
 * - Use `LayoutMain` for scrollable content (it has `overflow-y-auto`)
 * - Header and Footer are pinned (won't scroll)
 * - The Layout uses `max-h-full` to respect parent dimensions
 */
const meta = {
  title: 'shadcn-ui/Layout',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

export const FullLayout: StoryObj = {
  render: () => (
    <Layout>
      <LayoutHeader className="bg-primary text-primary-foreground">Header</LayoutHeader>
      <LayoutMain className="bg-secondary">
        {[...Array.from({ length: 50 })].map((_, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <p key={i}>Content line {i + 1}</p>
        ))}
      </LayoutMain>
      <LayoutFooter className="bg-primary text-primary-foreground">Footer</LayoutFooter>
    </Layout>
  ),
};

export const MainOnly: StoryObj = {
  render: () => (
    <Layout>
      <LayoutMain className="bg-secondary">
        {[...Array.from({ length: 50 })].map((_, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <p key={i}>Content line {i + 1}</p>
        ))}
      </LayoutMain>
    </Layout>
  ),
};

export const HeaderOnly: StoryObj = {
  render: () => (
    <Layout>
      <LayoutHeader className="bg-primary text-primary-foreground">Header</LayoutHeader>
      <LayoutMain className="bg-secondary">
        {[...Array.from({ length: 50 })].map((_, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <p key={i}>Content line {i + 1}</p>
        ))}
      </LayoutMain>
    </Layout>
  ),
};

export const FooterOnly: StoryObj = {
  render: () => (
    <Layout>
      <LayoutMain className="bg-secondary">
        {[...Array.from({ length: 50 })].map((_, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <p key={i}>Content line {i + 1}</p>
        ))}
      </LayoutMain>
      <LayoutFooter className="bg-primary text-primary-foreground">Footer</LayoutFooter>
    </Layout>
  ),
};

export const WithInsideContainer: StoryObj = {
  render: () => (
    <div className="h-96 border-2 border-dashed">
      <Layout>
        <LayoutHeader className="bg-primary text-primary-foreground">Header</LayoutHeader>
        <LayoutMain className="bg-secondary">
          {[...Array.from({ length: 20 })].map((_, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <p key={i}>Content line {i + 1}</p>
          ))}
        </LayoutMain>
        <LayoutFooter className="bg-primary text-primary-foreground">Footer</LayoutFooter>
      </Layout>
    </div>
  ),
};

export const FullScreen: StoryObj = {
  render: () => (
    <Layout>
      <LayoutHeader className="bg-primary text-primary-foreground">Header</LayoutHeader>
      <LayoutMain className="bg-secondary">
        {[...Array.from({ length: 50 })].map((_, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <p key={i}>Content line {i + 1}</p>
        ))}
      </LayoutMain>
      <LayoutFooter className="bg-primary text-primary-foreground">Footer</LayoutFooter>
    </Layout>
  ),
};

export const NestedLayout: StoryObj = {
  render: () => (
    <Layout>
      <LayoutHeader className="bg-primary text-primary-foreground">
        Top Header
      </LayoutHeader>
      <LayoutMain className="bg-secondary">
        <div className="border-2 border-dashed border-accent m-4 flex flex-col overflow-hidden h-96">
          <Layout className="h-full">
            <LayoutHeader className="bg-accent text-accent-foreground">
              Nested Header
            </LayoutHeader>
            <LayoutMain className="bg-muted">
              {[...Array.from({ length: 15 })].map((_, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <p key={i}>Nested content line {i + 1}</p>
              ))}
            </LayoutMain>
            <LayoutFooter className="bg-accent text-accent-foreground">
              Nested Footer
            </LayoutFooter>
          </Layout>
        </div>
      </LayoutMain>
      <LayoutFooter className="bg-primary text-primary-foreground">
        Top Footer
      </LayoutFooter>
    </Layout>
  ),
};
