const hamburgerBtn = document.querySelector('.hamburger');
const hamburgerMenu = document.getElementById('mobile-menu');

function closeMenu() {
  hamburgerBtn.setAttribute('aria-expanded', 'false');
  hamburgerMenu.hidden = true;
}

hamburgerBtn.addEventListener('click', () => {
  const isOpen = hamburgerBtn.getAttribute('aria-expanded') === 'true';
  hamburgerBtn.setAttribute('aria-expanded', String(!isOpen));
  hamburgerMenu.hidden = isOpen;
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
