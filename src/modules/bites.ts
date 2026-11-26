import { hasFinePointer } from './motion';

/** Click-and-drag scrolling with momentum for the Creative Bites strip on mouse devices. */
export function initBitesDrag(): void {
  const track = document.querySelector<HTMLElement>('[data-bites]');
  if (!track || !hasFinePointer()) return;

  let down = false;
  let moved = false;
  let startX = 0;
  let startScroll = 0;
  let lastX = 0;
  let velocity = 0;
  let glide = 0;

  track.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    down = true;
    moved = false;
    startX = lastX = e.clientX;
    startScroll = track.scrollLeft;
    velocity = 0;
    cancelAnimationFrame(glide);
  });

  window.addEventListener('pointermove', (e) => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) > 5) {
      moved = true;
      track.classList.add('is-dragging');
    }
    if (moved) {
      velocity = e.clientX - lastX;
      lastX = e.clientX;
      track.scrollLeft = startScroll - dx;
    }
  });

  window.addEventListener('pointerup', () => {
    if (!down) return;
    down = false;
    track.classList.remove('is-dragging');
    const step = () => {
      velocity *= 0.94;
      track.scrollLeft -= velocity;
      if (Math.abs(velocity) > 0.3) glide = requestAnimationFrame(step);
    };
    if (moved) glide = requestAnimationFrame(step);
  });

  // Swallow the click that ends a drag so it doesn't open a link.
  track.addEventListener(
    'click',
    (e) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    },
    true,
  );
}
