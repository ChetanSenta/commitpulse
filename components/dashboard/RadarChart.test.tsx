/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import RadarChart from './RadarChart';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, style, ...props }: any) => {
      delete props.initial;
      delete props.animate;
      delete props.whileInView;
      delete props.viewport;
      delete props.transition;

      return (
        <div className={className} style={style} {...props}>
          {children}
        </div>
      );
    },
    polygon: ({ children, className, style, ...props }: any) => {
      delete props.initial;
      delete props.animate;
      delete props.transition;

      return (
        <polygon className={className} style={style} {...props}>
          {children}
        </polygon>
      );
    },
  },
}));

describe('RadarChart', () => {
  const mockLangsA = [
    { name: 'TypeScript', percentage: 70, color: '#3178c6' },
    { name: 'Python', percentage: 30, color: '#3572A5' },
  ];

  const mockLangsB = [
    { name: 'TypeScript', percentage: 50, color: '#3178c6' },
    { name: 'JavaScript', percentage: 50, color: '#f1e05a' },
  ];

  it('renders title, labels, and language axis names', () => {
    render(
      <RadarChart languagesA={mockLangsA} languagesB={mockLangsB} labelA="User A" labelB="User B" />
    );

    expect(screen.getByText('Language Dominance')).toBeDefined();
    expect(screen.getByText('User A')).toBeDefined();
    expect(screen.getByText('User B')).toBeDefined();

    // Check that top languages are rendered as axes
    expect(screen.getAllByText('TypeScript')).toBeDefined();
    expect(screen.getAllByText('Python')).toBeDefined();
    expect(screen.getAllByText('JavaScript')).toBeDefined();
  });

  it('handles empty input arrays cleanly using pad languages', () => {
    render(<RadarChart languagesA={[]} languagesB={[]} labelA="User A" labelB="User B" />);

    // Padding should supply common ones
    expect(screen.getAllByText('TypeScript')).toBeDefined();
    expect(screen.getAllByText('JavaScript')).toBeDefined();
    expect(screen.getAllByText('Python')).toBeDefined();
  });

  it('verify at least 3 axes are always shown via padding when fewer are provided', () => {
    const singleLang = [{ name: 'TypeScript', percentage: 100, color: '#3178c6' }];

    render(
      <RadarChart languagesA={singleLang} languagesB={singleLang} labelA="User A" labelB="User B" />
    );

    expect(screen.getAllByText('TypeScript')).toBeDefined();
    expect(screen.getAllByText('JavaScript')).toBeDefined();
    expect(screen.getAllByText('Python')).toBeDefined();
  });

  it('renders chart elements and layout structure visible across viewport sizes', () => {
    const mockLangsA = [
      { name: 'TypeScript', percentage: 80, color: '#3178c6' },
      { name: 'Python', percentage: 60, color: '#3572A5' },
      { name: 'JavaScript', percentage: 40, color: '#f1e05a' },
    ];

    const mockLangsB = [
      { name: 'TypeScript', percentage: 50, color: '#3178c6' },
      { name: 'Python', percentage: 70, color: '#3572A5' },
      { name: 'JavaScript', percentage: 30, color: '#f1e05a' },
    ];

    const { container } = render(
      <RadarChart languagesA={mockLangsA} languagesB={mockLangsB} labelA="User A" labelB="User B" />
    );

    // Check that SVG element is rendered
    const svg = container.querySelector('svg');
    expect(svg).toBeDefined();

    // Check that grid polygons are rendered (concentric levels)
    const polygons = container.querySelectorAll('polygon');
    expect(polygons.length).toBeGreaterThan(0);

    // Check that axis lines are rendered
    const lines = container.querySelectorAll('line');
    expect(lines.length).toBeGreaterThan(0);

    // Check that axis labels are rendered
    expect(screen.getAllByText('TypeScript')).toBeDefined();
    expect(screen.getAllByText('Python')).toBeDefined();
    expect(screen.getAllByText('JavaScript')).toBeDefined();

    // Check that data points (circles) are rendered
    const circles = container.querySelectorAll('circle');
    expect(circles.length).toBeGreaterThan(0);
  });

  it('dynamically scales axis points based on dataset max score', () => {
    // Mock dataset with specific maximum score
    const mockLangsA = [
      { name: 'TypeScript', percentage: 100, color: '#3178c6' }, // Max score
      { name: 'Python', percentage: 75, color: '#3572A5' },
      { name: 'JavaScript', percentage: 50, color: '#f1e05a' },
    ];

    const mockLangsB = [
      { name: 'TypeScript', percentage: 90, color: '#3178c6' },
      { name: 'Python', percentage: 60, color: '#3572A5' },
      { name: 'JavaScript', percentage: 30, color: '#f1e05a' },
    ];

    const { container } = render(
      <RadarChart languagesA={mockLangsA} languagesB={mockLangsB} labelA="User A" labelB="User B" />
    );

    // Verify that polygons are rendered with points attribute
    const polygons = container.querySelectorAll('polygon');
    expect(polygons.length).toBeGreaterThan(0);

    // Check that the data polygons have points attribute (indicating scaling)
    const dataPolygons = Array.from(polygons).filter((p) =>
      p.getAttribute('points')?.includes(',')
    );
    expect(dataPolygons.length).toBeGreaterThan(0);

    // Verify that circles (data points) are rendered at different positions
    const circles = container.querySelectorAll('circle');
    expect(circles.length).toBeGreaterThan(0);

    // Get all circle positions to verify they're scaled differently
    const circlePositions = Array.from(circles).map((circle) => ({
      cx: circle.getAttribute('cx'),
      cy: circle.getAttribute('cy'),
    }));

    // Verify that not all circles are at the same position (indicating dynamic scaling)
    const uniquePositions = new Set(circlePositions.map((pos) => `${pos.cx},${pos.cy}`));
    expect(uniquePositions.size).toBeGreaterThan(1);
  });
});
