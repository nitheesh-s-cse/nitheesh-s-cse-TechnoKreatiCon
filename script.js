// ...existing code...
// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks') || document.getElementById('navChips');

function toggleNav(force) {
  if (!navLinks || !hamburger) return;
  if (window.innerWidth > 900 && !force) return;
  const isVisible = getComputedStyle(navLinks).display !== 'none';
  const shouldOpen = force === 'open' ? true : force === 'close' ? false : !isVisible;
  navLinks.style.display = shouldOpen ? 'flex' : 'none';
  hamburger.setAttribute('aria-expanded', String(shouldOpen));
}

if (hamburger && navLinks) {
  if (navLinks.id) hamburger.setAttribute('aria-controls', navLinks.id);
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.addEventListener('click', () => toggleNav());
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      if (window.innerWidth <= 900) toggleNav('close');
    });
  });
  document.addEventListener('click', (e) => {
    if (window.innerWidth > 900) return;
    if (!navLinks.contains(e.target) && e.target !== hamburger) {
      toggleNav('close');
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') toggleNav('close');
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) {
      navLinks.style.display = '';
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
}

// Reveal on scroll
const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const revealEls = document.querySelectorAll('.reveal, .card, .agenda-card, .boxed, .faq');
if (reduceMotion) {
  revealEls.forEach(el => el.classList.add('in-view'));
} else if (revealEls.length) {
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => io.observe(el));
}