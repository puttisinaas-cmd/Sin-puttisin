// Additive behavior layer: original portfolio gallery remains intact.
const shell = document.querySelector('.header-shell');
const menu = document.querySelector('#mobile-menu');
const menuToggle = document.querySelector('.menu-toggle');
let lastScroll = window.scrollY;
let scrollQueued = false;
window.addEventListener('scroll', () => {
  if (scrollQueued) return;
  scrollQueued = true;
  requestAnimationFrame(() => {
    const y = Math.max(0, window.scrollY);
    shell.classList.toggle('is-scrolled', y > 20);
    if (Math.abs(y - lastScroll) > 3) {
      shell.classList.toggle('is-hidden', y > lastScroll && y > 120 && !menu.open);
      lastScroll = y;
    }
    scrollQueued = false;
  });
}, {passive: true});
menuToggle.addEventListener('click', () => {
  menu.showModal();
  menuToggle.setAttribute('aria-expanded', 'true');
  requestAnimationFrame(() => requestAnimationFrame(() => menu.classList.add('is-visible')));
});
const closeMenu = () => menu.close();
document.querySelector('.menu-close').addEventListener('click', closeMenu);
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
menu.addEventListener('close', () => {
  menu.classList.remove('is-visible');
  menuToggle.setAttribute('aria-expanded', 'false');
});
window.matchMedia('(min-width:768px)').addEventListener('change', event => {
  if (event.matches && menu.open) closeMenu();
});
document.querySelectorAll('[data-project]').forEach(card => {
  const count = projects[Number(card.dataset.project)].images.length;
  const line = document.createElement('span');
  line.className = 'project-count';
  line.textContent = `${count} photographs`;
  card.querySelector('.project-meta').append(line);
});
// Images fade in after loading; rapid next/previous actions cancel stale frames.
let photoAnimation;
photo.addEventListener('load', () => {
  photoAnimation?.cancel();
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    photoAnimation = photo.animate([{opacity:0},{opacity:1}], {duration:400,easing:'ease-in-out'});
  }
});
