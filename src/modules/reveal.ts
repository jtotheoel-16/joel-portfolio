import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from './motion';

gsap.registerPlugin(ScrollTrigger);

const EASE = 'expo.out';

/**
 * Scroll build-ins.
 *  [data-reveal]          fades and floats up as it enters the viewport
 *  [data-reveal="card"]   unmasks from a soft inset with the image settling from a slight zoom
 *  [data-reveal="scale"]  grows in from a slightly smaller, rounder shape (hero)
 *  [data-reveal-stagger]  reveals its children one after another
 */
export function initReveals(): void {
  if (prefersReducedMotion()) return;

  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
    const kind = el.dataset.reveal;
    const trigger = { trigger: el, start: 'top 88%', once: true };

    if (kind === 'card') {
      const img = el.querySelector('img');
      const tl = gsap.timeline({ scrollTrigger: trigger });
      tl.fromTo(
        el,
        { opacity: 0, y: 60, clipPath: 'inset(8% 8% 8% 8% round 64px)' },
        { opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 1.4, ease: EASE, clearProps: 'clipPath,transform' },
      );
      if (img) tl.fromTo(img, { scale: 1.18 }, { scale: 1.001, duration: 1.8, ease: EASE, clearProps: 'transform' }, 0);
      return;
    }

    if (kind === 'scale') {
      gsap.fromTo(
        el,
        { opacity: 0, scale: 0.94, y: 24 },
        { opacity: 1, scale: 1, y: 0, duration: 1.4, ease: EASE, delay: 0.1, clearProps: 'transform' },
      );
      return;
    }

    gsap.fromTo(
      el,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1.2, ease: EASE, scrollTrigger: trigger, clearProps: 'transform' },
    );
  });

  gsap.utils.toArray<HTMLElement>('[data-reveal-stagger]').forEach((group) => {
    const children = Array.from(group.children) as HTMLElement[];
    const horizontal = group.hasAttribute('data-bites');
    gsap.fromTo(
      children,
      horizontal ? { opacity: 0, x: 80, scale: 0.92 } : { opacity: 0, y: 32 },
      {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        duration: horizontal ? 1.3 : 1.1,
        ease: EASE,
        stagger: horizontal ? 0.08 : 0.1,
        clearProps: 'transform',
        scrollTrigger: { trigger: group, start: 'top 88%', once: true },
      },
    );
  });

  // Images and fonts change layout heights after load; re-measure trigger points.
  window.addEventListener('load', () => ScrollTrigger.refresh());
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}
