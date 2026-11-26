import { gsap } from 'gsap';
import { prefersReducedMotion } from './motion';

const POP_FROM = { opacity: 0, y: 28, scaleX: 0.55, scaleY: 0.35, transformOrigin: '0% 100%' };
const POP_TO = { opacity: 1, y: 0, scaleX: 1, scaleY: 1, duration: 0.95, ease: 'elastic.out(1, 0.62)' };

/**
 * Headline build-in over the sizzle video, read as a sentence:
 * "Creative Director" lands on the bottom line, that line glides up to make room,
 * then "turned" and "Product Designer" build in beneath it.
 */
export function initHeroPills(): void {
  const rows = gsap.utils.toArray<HTMLElement>('[data-pill-row]');
  if (rows.length < 2 || prefersReducedMotion()) return;

  const [row1, row2] = rows;
  const [rainbow, creativeDirector] = Array.from(row1.querySelectorAll<HTMLElement>('[data-pill]'));
  const [turned, productDesigner, nerd] = Array.from(row2.querySelectorAll<HTMLElement>('[data-pill]'));
  const pills = [rainbow, creativeDirector, turned, productDesigner, nerd];

  const play = () => {
    // Distance from line 1 to line 2 (line height + gap); line 1 starts on the bottom line.
    const shift = row2.offsetTop - row1.offsetTop;

    gsap
      .timeline({
        delay: 0.4,
        onComplete: () => gsap.set([...rows, ...pills], { clearProps: 'transform' }),
      })
      .set(row1, { y: shift })
      .fromTo(creativeDirector, POP_FROM, POP_TO)
      .fromTo(rainbow, POP_FROM, POP_TO, '<0.12')
      .to(row1, { y: 0, duration: 0.7, ease: 'expo.inOut' }, '<0.55')
      .fromTo(turned, POP_FROM, POP_TO, '-=0.25')
      .fromTo(productDesigner, POP_FROM, POP_TO, '<0.14')
      .fromTo(nerd, POP_FROM, POP_TO, '<0.15');
  };

  // Wait for the display fonts so pill widths and line heights are final before measuring.
  const fontsReady = document.fonts?.ready ?? Promise.resolve();
  Promise.race([fontsReady, new Promise((r) => setTimeout(r, 1200))]).then(play);
}
