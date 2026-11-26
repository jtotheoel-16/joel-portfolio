import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from './motion';

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;

/** Inertial "liquid" scrolling, driven by GSAP's ticker so ScrollTrigger stays in sync. */
export function initSmoothScroll(): Lenis | null {
  if (prefersReducedMotion()) return null;

  lenis = new Lenis({
    lerp: 0.085,
    wheelMultiplier: 1,
    smoothWheel: true,
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

function headerOffset(): number {
  const header = document.querySelector<HTMLElement>('[data-header] .site-header__panel');
  return header ? -(header.offsetHeight + 24) : 0;
}

/** Smoothly scroll to a selector, leaving room for the sticky header. */
export function scrollToTarget(selector: string): void {
  const target = document.querySelector<HTMLElement>(selector);
  if (!target) return;
  // Measure without any in-flight reveal transform so we land exactly under the header.
  const revealY = Number(gsap.getProperty(target, 'y')) || 0;
  const top = target.getBoundingClientRect().top + window.scrollY - revealY + headerOffset();
  if (lenis) {
    lenis.scrollTo(top, { duration: 1.4, easing: (t) => 1 - Math.pow(1 - t, 4) });
  } else {
    window.scrollTo({ top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }
  target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
}

/** Wire every [data-scroll-to] link (e.g. About → "A born hybrid"). */
export function initAnchorLinks(onNavigate?: () => void): void {
  document.querySelectorAll<HTMLAnchorElement>('[data-scroll-to]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const selector = link.dataset.scrollTo;
      if (!selector) return;
      event.preventDefault();
      onNavigate?.();
      scrollToTarget(selector);
      history.replaceState(null, '', selector);
    });
  });

  document.querySelectorAll<HTMLAnchorElement>('a[href="#top"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      if (lenis) lenis.scrollTo(0, { duration: 1.2 });
      else window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    });
  });
}
