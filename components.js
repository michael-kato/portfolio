/**
 * Shared components loader for Michael Kato's portfolio
 * Dynamically injects header, nav, and footer across all pages.
 *
 * Usage: Add <script src="components.js"></script> (or "../components.js" for subdirs)
 *        before any other scripts. Set data attributes on <body> to customize:
 *
 *   data-header-title   - Header h1 text (default: "Michael Kato")
 *   data-header-subtitle - Header subtitle (default: none)
 *   data-header-link    - If set, header title becomes a link to this URL
 */

(function () {
  // Determine path prefix based on directory depth
  const depth = (window.location.pathname.match(/\//g) || []).length - 1;
  const scriptSrc = document.currentScript?.src || '';
  const prefix = scriptSrc.includes('/components.js')
    ? scriptSrc.substring(0, scriptSrc.lastIndexOf('/') + 1)
    : '';

  // Compute relative root from the page's perspective
  function getRoot() {
    // Check if current script tag has a src with "../"
    const scripts = document.querySelectorAll('script[src*="components.js"]');
    for (const s of scripts) {
      const src = s.getAttribute('src');
      if (src.startsWith('../')) return '../';
      if (src.startsWith('./') || !src.includes('/')) return '';
    }
    return '';
  }

  const root = getRoot();

  // Read customisation from body data attributes
  const body = document.body;
  const headerTitle = body.dataset.headerTitle || 'Michael Kato';
  const headerSubtitle = body.dataset.headerSubtitle || '';
  const headerLink = body.dataset.headerLink || '';

  // ── Header ──────────────────────────────────────────────────────────
  const titleHtml = headerLink
    ? `<a href="${headerLink}" style="color: inherit; text-decoration: none;">${headerTitle}</a>`
    : headerTitle;

  const headerEl = document.createElement('header');
  headerEl.id = 'dynamic-header';
  headerEl.className = 'hero';
  headerEl.innerHTML = `
    <div class="container header-content">
      ${headerSubtitle ? `<p class="eyebrow header-subtitle">${headerSubtitle}</p>` : ''}
      <h1 class="header-title">${titleHtml}</h1>
    </div>
    <div class="shader-controls">
      <button id="prev-shader" class="shader-toggle-btn" type="button" title="Previous background" aria-label="Previous background">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
      </button>
      <button id="next-shader" class="shader-toggle-btn" type="button" title="Next background" aria-label="Next background">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </button>
    </div>
  `;

  // ── Nav ─────────────────────────────────────────────────────────────
  // On the index page itself, use plain hash links for smooth scrolling
  const isIndex = /\/(index\.html)?(\?|#|$)/.test(window.location.pathname);
  const indexBase = isIndex ? '' : `${root}index.html`;

  const navEl = document.createElement('nav');
  navEl.className = 'topbar';
  navEl.setAttribute('aria-label', 'Main');
  navEl.innerHTML = `
    <div class="container topbar__row">
      <a class="brand" href="${root}index.html"><svg class="brand__mark" viewBox="0 0 100 100" aria-hidden="true" focusable="false"><circle cx="50" cy="50" r="46" class="brand__disc"/><ellipse cx="50" cy="52" rx="38" ry="13" class="brand__orbit" transform="rotate(-18 50 52)"/><text x="50" y="60" text-anchor="middle" class="brand__initials">MK</text></svg><span class="brand__name">Michael Kato</span></a>
      <ul>
        <li><a href="${indexBase}#career">Career</a></li>
        <li><a href="${indexBase}#art">Art</a></li>
        <li><a href="${indexBase}#contact">Contact</a></li>
        <li><a href="${root}blog/">Blog</a></li>
      </ul>
      <a class="btn btn--accent btn--sm" href="${root}resources/Michael_Kato_Resume.pdf" download>Résumé ↓</a>
    </div>
  `;

  // ── Footer ──────────────────────────────────────────────────────────
  const footerEl = document.createElement('footer');
  footerEl.className = 'site-footer';
  footerEl.innerHTML = `<div class="container site-footer__row"><span class="mono">&copy; ${new Date().getFullYear()} Michael Kato</span></div>`;

  // ── Inject ──────────────────────────────────────────────────────────
  // Insert nav + header before <main> (or as first children of body)
  const main = document.querySelector('main');
  if (main) {
    body.insertBefore(headerEl, main);
    body.insertBefore(navEl, headerEl);
  } else {
    body.prepend(headerEl);
    body.prepend(navEl);
  }

  // Append footer at the end of body (before scripts if possible)
  const existingScripts = body.querySelectorAll('body > script');
  if (existingScripts.length > 0) {
    body.insertBefore(footerEl, existingScripts[0]);
  } else {
    body.appendChild(footerEl);
  }
})();
