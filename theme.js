const root = document.documentElement;
const toggleBtn = document.getElementById('theme-toggle');

function getCurrentTheme() {
  return root.getAttribute('data-theme')
    || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
}

toggleBtn.addEventListener('click', () => {
  const next = getCurrentTheme() === 'dark' ? 'light' : 'dark';

  const applyTheme = () => {
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  };

  if (!document.startViewTransition) {
    applyTheme();
    return;
  }

  document.startViewTransition(applyTheme);
});