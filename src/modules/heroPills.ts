import { gsap } from 'gsap';
import { prefersReducedMotion } from './motion';

/** Pills over the sizzle video pop in one by one with a springy, liquid overshoot. */
export function initHeroPills(): void {
  const pills = gsap.utils.toArray<HTMLElement>('[data-pill]');
  if (!pills.length || prefersReducedMotion()) return;

  const play = () =>
    gsap.fromTo(
      pills,
      { opacity: 0, y: 28, scaleX: 0.55, scaleY: 0.35, transformOrigin: '0% 100%' },
      {
        opacity: 1,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        duration: 1.25,
        ease: 'elastic.out(1, 0.62)',
        stagger: 0.11,
        delay: 0.55,
        clearProps: 'transform',
      },
    );

  // Wait for the display fonts so pill widths don't jump mid-animation.
  const fontsReady = document.fonts?.ready ?? Promise.resolve();
  Promise.race([fontsReady, new Promise((r) => setTimeout(r, 1200))]).then(play);
}
