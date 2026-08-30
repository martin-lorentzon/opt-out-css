const hamburgerBtn = document.querySelector('.hamburger');
const hamburgerMenu = document.getElementById('mobile-menu');

function setMenuOpen(open) {
  hamburgerBtn.setAttribute('aria-expanded', String(open));
  hamburgerMenu.hidden = !open;
  document.documentElement.classList.toggle('menu-open', open);
}

function closeMenu() {
  setMenuOpen(false);
}

hamburgerBtn.addEventListener('click', () => {
  const isOpen = hamburgerBtn.getAttribute('aria-expanded') === 'true';
  setMenuOpen(!isOpen);
});

hamburgerMenu.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && hamburgerBtn.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    hamburgerBtn.focus();
  }
});
