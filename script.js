const root = document.documentElement;
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
const themeToggle = document.getElementById('theme-toggle');

function syncThemeControl() {
  const isDark = root.dataset.theme ? root.dataset.theme === 'dark' : systemTheme.matches;
  themeToggle.setAttribute('aria-pressed', String(isDark));
}

themeToggle.addEventListener('click', () => {
  const theme = themeToggle.getAttribute('aria-pressed') === 'true' ? 'light' : 'dark';
  root.dataset.theme = theme;
  try {
    localStorage.setItem('theme', theme);
  } catch {
    // The current page can still switch themes when storage is unavailable.
  }
  syncThemeControl();
});

systemTheme.addEventListener('change', syncThemeControl);
window.addEventListener('storage', event => {
  if (event.key !== 'theme') return;
  if (event.newValue === 'light' || event.newValue === 'dark') {
    root.dataset.theme = event.newValue;
  } else {
    delete root.dataset.theme;
  }
  syncThemeControl();
});
syncThemeControl();
themeToggle.hidden = false;

const nav = document.getElementById('site-nav');
const menuToggle = document.getElementById('menu-toggle');
const header = nav.closest('header');
const compactHeader = window.matchMedia('(max-width: 52rem)');

function setMenuOpen(open) {
  menuToggle.setAttribute('aria-expanded', String(open));
  nav.hidden = compactHeader.matches && !open;
}

function syncNavigation() {
  if (compactHeader.matches) {
    menuToggle.hidden = false;
    if (nav.contains(document.activeElement)) menuToggle.focus();
  } else {
    nav.hidden = false;
    if (document.activeElement === menuToggle) nav.querySelector('a').focus();
    menuToggle.hidden = true;
  }
  setMenuOpen(false);
}

menuToggle.addEventListener('click', () => {
  const open = nav.hidden;
  setMenuOpen(open);
  if (open) nav.querySelector('a').focus();
});

nav.addEventListener('click', event => {
  const link = event.target.closest('a');
  if (!link || !compactHeader.matches || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const target = document.getElementById(link.hash.slice(1));
  setMenuOpen(false);
  if (target) {
    target.tabIndex = -1;
    target.focus({ preventScroll: true });
  }
});

document.addEventListener('keydown', event => {
  if (event.key !== 'Escape' || menuToggle.getAttribute('aria-expanded') !== 'true') return;
  setMenuOpen(false);
  menuToggle.focus();
});

function closeMenuOutsideHeader(event) {
  if (menuToggle.getAttribute('aria-expanded') === 'true' && !header.contains(event.target)) setMenuOpen(false);
}

document.addEventListener('click', closeMenuOutsideHeader);
document.addEventListener('focusin', closeMenuOutsideHeader);
compactHeader.addEventListener('change', syncNavigation);
root.classList.add('navigation-ready');
syncNavigation();

const copyEmail = document.getElementById('copy-email');
const emailAddress = document.getElementById('email-address');
const copyStatus = document.getElementById('copy-status');

copyEmail.addEventListener('click', async () => {
  copyStatus.textContent = '';
  try {
    await navigator.clipboard.writeText(emailAddress.textContent);
    copyStatus.textContent = 'Email address copied.';
  } catch {
    copyStatus.textContent = 'Copy unavailable. Select the email address to copy it.';
  }
});
copyEmail.hidden = !navigator.clipboard;

document.getElementById('year').textContent = new Date().getFullYear();
