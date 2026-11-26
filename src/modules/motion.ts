/** True when the visitor asked the OS for less motion. Everything animated checks this first. */
export const prefersReducedMotion = (): boolean =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** True on devices with a precise, hover-capable pointer (mouse / trackpad). */
export const hasFinePointer = (): boolean =>
  window.matchMedia('(hover: hover) and (pointer: fine)').matches;
