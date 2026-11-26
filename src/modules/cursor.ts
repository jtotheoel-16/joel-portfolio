import { hasFinePointer, prefersReducedMotion } from './motion';

/** Pill cursor ("Video Highlights ↗", …) that trails the pointer over case-study images. */
export function initCaseCursor(): void {
  const el = document.querySelector<HTMLElement>('[data-cursor-el]');
  const label = document.querySelector<HTMLElement>('[data-cursor-label]');
  const cards = document.querySelectorAll<HTMLElement>('[data-cursor]');
  if (!el || !label || !cards.length || !hasFinePointer()) return;

  document.documentElement.classList.add('has-cursor');
  const follow = prefersReducedMotion() ? 1 : 0.2;
  let x = -200, y = -200, tx = x, ty = y;
  let active = false;
  let raf = 0;

  const loop = () => {
    x += (tx - x) * follow;
    y += (ty - y) * follow;
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    if (active || Math.abs(tx - x) > 0.1 || Math.abs(ty - y) > 0.1) raf = requestAnimationFrame(loop);
    else raf = 0;
  };
  const kick = () => {
    if (!raf) raf = requestAnimationFrame(loop);
  };

  cards.forEach((card) => {
    card.addEventListener('pointerenter', (e) => {
      label.textContent = card.dataset.cursor ?? '';
      if (!active) {
        // Start from the entry point so the pill doesn't fly in from the last card.
        x = tx = e.clientX;
        y = ty = e.clientY;
      }
      active = true;
      el.classList.add('is-visible');
      kick();
    });
    card.addEventListener('pointermove', (e) => {
      tx = e.clientX;
      ty = e.clientY;
      kick();
    });
    card.addEventListener('pointerleave', () => {
      active = false;
      el.classList.remove('is-visible');
    });
  });
}
