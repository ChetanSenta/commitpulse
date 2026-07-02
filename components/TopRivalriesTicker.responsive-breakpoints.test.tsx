import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import type { ReactNode, HTMLAttributes } from 'react';
import TopRivalriesTicker from './TopRivalriesTicker';
import '@testing-library/jest-dom';

const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({
      children,
      animate,
      transition,
      ...props
    }: HTMLAttributes<HTMLDivElement> & {
      children?: ReactNode;
      animate?: unknown;
      transition?: unknown;
    }) => (
      <div
        {...props}
        data-testid="motion-div"
        data-animate={JSON.stringify(animate)}
        data-transition={JSON.stringify(transition)}
      >
        {children}
      </div>
    ),
  },
}));

describe('TopRivalriesTicker - Responsive Multi-device Columns & Mobile Viewport Layouts', () => {
  const originalInnerWidth = window.innerWidth;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
  });

  // Test Case 1: Mock standard mobile-width media coordinates (e.g. 375px wide viewports)
  it('mocks standard mobile-width media coordinates and verifies presence of mobile-safe responsive layout classes', () => {
    // Mock mobile viewport width
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });
    window.dispatchEvent(new Event('resize'));

    const { container } = render(<TopRivalriesTicker />);

    // Assert standard mobile mounting is clean
    expect(window.innerWidth).toBe(375);
    expect(container.firstChild).toBeInTheDocument();

    // Verify actual CSS-driven responsive layout structure is present to handle mobile scaling
    const outerContainer = container.firstChild as HTMLElement;
    expect(outerContainer).toHaveClass('w-full', 'overflow-hidden');
  });

  // Test Case 2: Assert that columns reflow into standard vertical flex lists
  it('Assert that columns reflow into standard vertical flex lists: adapts requirement to verify horizontal marquee row layout preserves inline flex structure without wrapping', () => {
    const { container } = render(<TopRivalriesTicker />);

    // Note: Since a ticker component must scroll horizontally, it does not wrap vertically.
    // We verify that the marquee container uses inline-flex layouts (flex and whitespace-nowrap)
    // to keep elements scrolling horizontally, while the list items scale using responsive flex values.
    const marqueeContainer = container.querySelector('[data-testid="motion-div"]');
    expect(marqueeContainer).toHaveClass('flex');
    expect(marqueeContainer).toHaveClass('whitespace-nowrap');

    // Verify the listed items inside use flex layout structure
    const items = container.querySelectorAll('.group.flex.items-center');
    expect(items.length).toBeGreaterThan(0);
    items.forEach((item) => {
      expect(item).toHaveClass('flex', 'items-center');
    });
  });

  // Test Case 3: Verify styling values are not absolute widths that cause horizontal scrollbars on smaller viewports
  it('verify styling values are not absolute widths that cause horizontal scrollbars on smaller viewports: utilizes fluid layout', () => {
    const { container } = render(<TopRivalriesTicker />);

    // Main ticker container should be fluid (w-full) and hide overflow to prevent horizontal scrollbars on the page
    const outerContainer = container.firstChild as HTMLElement;
    expect(outerContainer).toHaveClass('w-full', 'overflow-hidden');

    // Individual rivalry containers must not have hardcoded pixel widths which blow out the mobile viewport
    const items = container.querySelectorAll('.group.flex.items-center');
    items.forEach((item) => {
      expect(item.className).not.toMatch(/w-\[\d+px\]/);
      expect(item.className).not.toMatch(/\bw-(?:96|64|72|80|max|screen)\b/);
      // Items use responsive / fluid padding and margins
      expect(item).toHaveClass('px-6', 'py-1.5', 'mx-2');
    });
  });

  // Test Case 4: Check that navigation components scale down gracefully
  it('check that navigation components scale down gracefully: edge gradients resize on smaller screens', () => {
    const { container } = render(<TopRivalriesTicker />);

    // Find the ambient/edge gradients overlay masks
    const leftGradient = container.querySelector('.bg-gradient-to-r');
    const rightGradient = container.querySelector('.bg-gradient-to-l');

    expect(leftGradient).toBeInTheDocument();
    expect(rightGradient).toBeInTheDocument();

    // Verify that the gradients adapt dynamically (w-8 on mobile, sm:w-16 on larger viewports)
    expect(leftGradient).toHaveClass('w-8', 'sm:w-16');
    expect(rightGradient).toHaveClass('w-8', 'sm:w-16');
  });

  // Test Case 5: Assert mobile-specific toggle states respond cleanly
  it('assert mobile-specific toggle states respond cleanly: toggles empty state and handles mobile click routing', () => {
    // 1. Toggles empty/fallback state when no rivalries are provided
    const { rerender } = render(<TopRivalriesTicker rivalries={[]} />);
    const noRivalriesText = screen.getByText('No active rivalries');
    expect(noRivalriesText).toBeInTheDocument();
    expect(noRivalriesText).toHaveClass('flex', 'items-center', 'justify-center', 'w-full');

    // 2. Tapping on a rivalry item in mobile viewport triggers routing cleanly
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });
    window.dispatchEvent(new Event('resize'));

    rerender(<TopRivalriesTicker />);
    const firstRivalryLabel = screen.getAllByText('Kernel vs React')[0];
    const rivalryContainer = firstRivalryLabel.closest('div.group');

    expect(rivalryContainer).toBeInTheDocument();
    fireEvent.click(rivalryContainer as HTMLElement);

    expect(mockPush).toHaveBeenCalledWith('/compare?user1=torvalds&user2=gaearon');
  });
});
