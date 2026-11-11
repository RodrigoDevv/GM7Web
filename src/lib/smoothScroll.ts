import Lenis from 'lenis';

let lenis: Lenis | null = null;

export function initSmoothScroll(): () => void {
  if (lenis || typeof window === 'undefined') return () => {};
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};

  lenis = new Lenis({
    duration: 1.05,
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.4,
    allowNestedScroll: true,
    anchors: { offset: -64 },
  });

  let frame = 0;
  const raf = (time: number) => {
    lenis?.raf(time);
    frame = requestAnimationFrame(raf);
  };
  frame = requestAnimationFrame(raf);

  return () => {
    cancelAnimationFrame(frame);
    lenis?.destroy();
    lenis = null;
  };
}

interface SmoothScrollOptions {
  offset?: number;
  immediate?: boolean;
}

export function smoothScrollTo(
  target: number | string | HTMLElement,
  { offset = 0, immediate = false }: SmoothScrollOptions = {},
) {
  if (lenis) {
    lenis.scrollTo(target, { offset, immediate, duration: immediate ? 0 : 1.05 });
    return;
  }

  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: immediate ? 'auto' : 'smooth' });
    return;
  }

  const element = typeof target === 'string' ? document.querySelector(target) : target;
  element?.scrollIntoView({ behavior: immediate ? 'auto' : 'smooth' });
}

export function smoothScrollToTop(immediate = false) {
  smoothScrollTo(0, { immediate });
}

let fallbackPreviousOverflow: string | null = null;

/**
 * Locks page scrolling while a modal/panel is open.
 * Uses Lenis' own stop/start so the lock is always released cleanly.
 */
export function stopSmoothScroll() {
  if (lenis) {
    lenis.stop();
    return;
  }
  if (typeof document === 'undefined') return;
  if (fallbackPreviousOverflow === null) {
    fallbackPreviousOverflow = document.body.style.overflow;
  }
  document.body.style.overflow = 'hidden';
}

export function startSmoothScroll() {
  if (lenis) {
    lenis.start();
    return;
  }
  if (typeof document === 'undefined') return;
  document.body.style.overflow = fallbackPreviousOverflow ?? '';
  fallbackPreviousOverflow = null;
}
