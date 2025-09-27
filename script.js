// ...existing code...
// ================== Mobile menu toggle ==================
const hamburger = document.getElementById('hamburger');
// Support either #navLinks (new) or #navChips (legacy)
const navLinks = document.getElementById('navLinks') || document.getElementById('navChips');

function toggleNav(force) {
  if (!navLinks || !hamburger) return;

  // Only toggle via button on mobile widths; desktop is controlled by CSS
  if (window.innerWidth > 900 && !force) return;

  const isVisible = getComputedStyle(navLinks).display !== 'none';
  const shouldOpen = force === 'open' ? true : force === 'close' ? false : !isVisible;

  navLinks.style.display = shouldOpen ? 'flex' : 'none';
  hamburger.setAttribute('aria-expanded', String(shouldOpen));
}

if (hamburger && navLinks) {
  // ARIA hooks
  if (navLinks.id) hamburger.setAttribute('aria-controls', navLinks.id);
  hamburger.setAttribute('aria-expanded', 'false');

  // Toggle on click
  hamburger.addEventListener('click', () => toggleNav());

  // Close on link click (mobile)
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      if (window.innerWidth <= 900) toggleNav('close');
    });
  });

  // Click outside closes (mobile)
  document.addEventListener('click', (e) => {
    if (window.innerWidth > 900) return;
    if (!navLinks.contains(e.target) && e.target !== hamburger) {
      toggleNav('close');
    }
  });

  // Escape closes
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') toggleNav('close');
  });

  // Reset inline style on resize so desktop layout isn't stuck hidden
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) {
      navLinks.style.display = '';
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
}

// ================== Reveal on scroll ==================
const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const revealEls = document.querySelectorAll('.reveal, .reveal-grid');

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

// ================== Theme switcher ==================
const themes = ['theme-sapphire', 'theme-emerald', 'theme-royal'];
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

function applyTheme(t) {
  themes.forEach(th => body.classList.remove(th));
  body.classList.add(t);
  try { localStorage.setItem('tk-theme', t); } catch {}
}

let saved = null;
try { saved = localStorage.getItem('tk-theme'); } catch {}
if (saved && themes.includes(saved)) applyTheme(saved);

if (themeToggle) {
  themeToggle.setAttribute('aria-label', 'Cycle theme');
  themeToggle.title = 'Change theme';
  themeToggle.addEventListener('click', () => {
    const current = themes.find(th => body.classList.contains(th)) || themes[0];
    const next = themes[(themes.indexOf(current) + 1) % themes.length];
    applyTheme(next);
  });
}

// ================== Constants ==================
const ENROLL_URL = 'https://ppgit-cse.formaloo.co/h248yb';
const CONTACT_EMAIL = 'technokreaticon.tech@gmail.com';
const CONTACT_PHONE = '+919730627087';

document.querySelectorAll('a[data-enroll]').forEach(a => {
  a.href = ENROLL_URL; a.target = '_blank'; a.rel = 'noopener';
});

// ================== FACULTY FIX: force styles even if CSS conflicts ==================
(function fixFaculty() {
  const css = `
    /* Injected overrides */
    #faculty .coord-grid{
      display: flex !important;
      flex-direction: column !important;
      gap: 16px !important;
      max-width: 760px !important;
      margin-inline: auto !important;
    }
    #faculty .coord-card{
      display: grid !important;
      grid-template-columns: 108px 1fr !important;
      align-items: center !important;
      column-gap: 16px !important;
      padding: 14px 16px !important;
      border-radius: 16px !important;
      background: rgba(255,255,255,.04) !important;
      border: 1px solid rgba(255,255,255,.10) !important;
      box-shadow: 0 10px 30px rgba(0,0,0,.28) !important;
      overflow: hidden !important;
      transform: translateZ(0) !important;
      transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease !important;
    }
    #faculty .coord-card .photo{
      width: 108px !important;
      height: 108px !important;
      border-radius: 14px !important;
      overflow: hidden !important;
      background: #0b1020 !important;
      border: 1px solid rgba(255,255,255,.10) !important;
      box-shadow: 0 8px 22px rgba(0,0,0,.28) !important;
    }
    #faculty .coord-card .photo img{
      width: 100% !important;
      height: 100% !important;
      object-fit: cover !important;
      display: block !important;
    }
    #faculty .coord-card .names{
      font-weight: 800 !important;
      margin: 0 0 2px !important;
      letter-spacing: .1px !important;
      font-family: 'Manrope', system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif !important;
    }
    #faculty .coord-card .role{
      color: #aab3cf !important;
      font-size: 14px !important;
      margin: 0 !important;
    }
    #faculty .coord-card:hover{
      transform: translateY(-3px) !important;
      box-shadow: 0 16px 46px rgba(59,130,255,.22) !important;
      border-color: rgba(59,130,255,.35) !important;
    }
    #faculty .coord-card.reveal{ opacity: 0 !important; transform: translateY(10px) scale(.98) !important; }
    #faculty .coord-card.in-view{ opacity: 1 !important; transform: translateY(0) scale(1) !important; transition: opacity .5s ease, transform .5s cubic-bezier(.2,.8,.2,1) !important; }
    @media (min-width: 980px){
      /* optional: 2 columns on desktop */
      #faculty .coord-grid{
        display: grid !important;
        grid-template-columns: repeat(2, minmax(320px, 1fr)) !important;
        gap: 18px !important;
        max-width: 1100px !important;
      }
    }
  `;

  // Inject CSS block
  const styleId = 'faculty-override-styles';
  let style = document.getElementById(styleId);
  if (!style) {
    style = document.createElement('style');
    style.id = styleId;
    document.head.appendChild(style);
  }
  style.textContent = css;

  // Inline fallback to guarantee immediate change
  const cards = document.querySelectorAll('#faculty .coord-card');
  const grid = document.querySelector('#faculty .coord-grid');

  if (grid) {
    grid.style.display = 'flex';
    grid.style.flexDirection = 'column';
    grid.style.gap = '16px';
    grid.style.maxWidth = '760px';
    grid.style.marginInline = 'auto';
  }

  cards.forEach(card => {
    card.style.display = 'grid';
    card.style.gridTemplateColumns = '108px 1fr';
    card.style.alignItems = 'center';
    card.style.columnGap = '16px';
    card.style.padding = '14px 16px';
    card.style.borderRadius = '16px';
    card.style.background = 'rgba(255,255,255,.04)';
    card.style.border = '1px solid rgba(255,255,255,.10)';
    card.style.boxShadow = '0 10px 30px rgba(0,0,0,.28)';
    card.style.overflow = 'hidden';
  });

  document.querySelectorAll('#faculty .coord-card .photo').forEach(p => {
    p.style.width = '108px';
    p.style.height = '108px';
    p.style.borderRadius = '14px';
    p.style.overflow = 'hidden';
    p.style.background = '#0b1020';
    p.style.border = '1px solid rgba(255,255,255,.10)';
    p.style.boxShadow = '0 8px 22px rgba(0,0,0,.28)';
  });

  document.querySelectorAll('#faculty .coord-card .photo img').forEach(i => {
    i.style.width = '100%';
    i.style.height = '100%';
    i.style.objectFit = 'cover';
    i.style.display = 'block';
  });

  // Expose a tiny status for quick debugging
  window.__tkFacultyFixStatus = {
    cards: cards.length,
    gridApplied: !!grid
  };
})();