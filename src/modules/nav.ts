/** Mobile "•••" menu: expands the header panel in place. */
export function initMobileMenu(): { close: () => void } {
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const menu = document.querySelector<HTMLElement>('[data-menu]');
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!toggle || !menu || !header) return { close: () => {} };

  const links = Array.from(menu.querySelectorAll<HTMLAnchorElement>('a'));
  const setLinksFocusable = (on: boolean) => links.forEach((a) => (a.tabIndex = on ? 0 : -1));
  setLinksFocusable(false);

  const setOpen = (open: boolean) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.classList.toggle('is-open', open);
    setLinksFocusable(open);
  };
  const close = () => setOpen(false);

  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  links.forEach((a) => a.addEventListener('click', close));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) {
      close();
      toggle.focus();
    }
  });
  document.addEventListener('click', (e) => {
    if (menu.classList.contains('is-open') && !header.contains(e.target as Node)) close();
  });
  window.matchMedia('(min-width: 768px)').addEventListener('change', (e) => e.matches && close());

  return { close };
}
