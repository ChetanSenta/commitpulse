// components/dashboard/ContributionCity3D.empty-fallback.test.tsx

import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import ContributionCity3D from './ContributionCity3D';

// Mock ResizeObserver
beforeAll(() => {
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  })) as unknown as typeof ResizeObserver;

  HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    closePath: vi.fn(),
    fill: vi.fn(),
    stroke: vi.fn(),
    ellipse: vi.fn(),
    createRadialGradient: vi.fn(() => ({
      addColorStop: vi.fn(),
    })),
    globalAlpha: 1,
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1,
  })) as never;
});

describe('ContributionCity3D Empty Data Handling', () => {
  it('does not crash with empty array', () => {
    expect(() => {
      render(<ContributionCity3D data={[]} />);
    }).not.toThrow();
  });

  it('renders canvas with empty array', () => {
    const { container } = render(<ContributionCity3D data={[]} />);

    expect(container.querySelector('canvas')).toBeInTheDocument();
  });

  it('renders controls with empty array', () => {
    render(<ContributionCity3D data={[]} />);

    expect(screen.getByText(/drag to rotate/i)).toBeInTheDocument();

    expect(screen.getByText(/scroll to zoom/i)).toBeInTheDocument();
  });
});
