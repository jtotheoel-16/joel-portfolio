import '@fontsource-variable/inter';
import './styles/tokens.css';
import './styles/fonts.css';
import './styles/base.css';
import './styles/sections.css';

import { initSmoothScroll, initAnchorLinks } from './modules/smoothScroll';
import { initReveals } from './modules/reveal';
import { initHeroPills } from './modules/heroPills';
import { initMobileMenu } from './modules/nav';
import { initCaseCursor } from './modules/cursor';
import { initBitesDrag } from './modules/bites';

const menu = initMobileMenu();
initSmoothScroll();
initAnchorLinks(menu.close);
initHeroPills();
initReveals();
initCaseCursor();
initBitesDrag();

// Case-study pages are still to come; keep the cards from jumping to the top in the meantime.
document.querySelectorAll<HTMLAnchorElement>('[data-case][href="#"]').forEach((a) =>
  a.addEventListener('click', (e) => e.preventDefault()),
);
