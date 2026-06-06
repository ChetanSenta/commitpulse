import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useGlowEffect } from './useGlowEffect';

class MockResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

describe('useGlowEffect - Empty/Missing Inputs Verification', () => {
  beforeEach(() => {
    vi.stubGlobal('ResizeObserver', MockResizeObserver);

    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      callback(0);
      return 1;
    });

    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('initializes successfully without a DOM element', () => {
    const { result } = renderHook(() => useGlowEffect());

    expect(result.current.shellRef.current).toBeNull();
  });

  it('provides default CSS variable values in empty state', () => {
    const { result } = renderHook(() => useGlowEffect());

    expect(result.current.shellVars['--mx']).toBe('50%');
    expect(result.current.shellVars['--my']).toBe('50%');
    expect(result.current.shellVars['--glow-opacity']).toBe('0');
    expect(result.current.shellVars['--border-opacity']).toBe('0');
  });

  it('does not throw when handleMouseLeave is called before interaction', () => {
    const { result } = renderHook(() => useGlowEffect());

    expect(() => {
      result.current.handleMouseLeave();
    }).not.toThrow();
  });

  it('safely ignores mouse move when bounding rect is unavailable', () => {
    const { result } = renderHook(() => useGlowEffect());

    expect(() => {
      result.current.handleMouseMove({
        clientX: 10,
        clientY: 20,
        currentTarget: {
          getBoundingClientRect: () => null,
        },
      } as unknown as React.MouseEvent<HTMLDivElement>);
    }).not.toThrow();
  });

  it('unmounts cleanly without active animations', () => {
    const { unmount } = renderHook(() => useGlowEffect());

    expect(() => unmount()).not.toThrow();
  });
});
