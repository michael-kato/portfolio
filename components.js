/**
 * Shared components loader for Michael Kato's portfolio
 * Dynamically injects header, nav, and footer across all pages.
 *
 * Usage: Add <script src="components.js"></script> (or "../components.js" for subdirs)
 *        before any other scripts. Set data attributes on <body> to customize:
 *
 *   data-header-title   – Header h1 text (default: "Michael Kato")
 *   data-header-subtitle – Header subtitle (default: "Technically an artist!")
 *   data-header-link    – If set, header title becomes a link to this URL
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
  const headerSubtitle = body.dataset.headerSubtitle || 'Technically an artist!';
  const headerLink = body.dataset.headerLink || '';

  // ── Header ──────────────────────────────────────────────────────────
  const titleHtml = headerLink
    ? `<a href="${headerLink}" style="color: inherit; text-decoration: none;">${headerTitle}</a>`
    : headerTitle;

  const headerEl = document.createElement('header');
  headerEl.id = 'dynamic-header';
  headerEl.innerHTML = `
    <div class="header-background"></div>
    <div class="header-content">
      <h1 class="header-title">${titleHtml}</h1>
      ${headerSubtitle ? `<p class="header-subtitle">${headerSubtitle}</p>` : ''}
    </div>
  `;

  // ── Nav ─────────────────────────────────────────────────────────────
  // On the index page itself, use plain hash links for smooth scrolling
  const isIndex = /\/(index\.html)?(\?|#|$)/.test(window.location.pathname);
  const indexBase = isIndex ? '' : `${root}index.html`;

  const navEl = document.createElement('nav');
  navEl.innerHTML = `
    <ul>
      <li><a href="${indexBase}#tech">Tech</a></li>
      <li><a href="${indexBase}#art">Art</a></li>
      <li><a href="${indexBase}#animations">Animations</a></li>
      <li><a href="${indexBase}#contact">Contact</a></li>
      <li><a href="${root}notebook.html">Notebooks</a></li>
    </ul>
  `;

  // ── Footer ──────────────────────────────────────────────────────────
  const footerEl = document.createElement('footer');
  footerEl.innerHTML = `<p>&copy; ${new Date().getFullYear()} Michael Kato. All rights reserved.</p>`;

  // ── Inject ──────────────────────────────────────────────────────────
  // Insert header + nav before <main> (or as first children of body)
  const main = document.querySelector('main');
  if (main) {
    body.insertBefore(navEl, main);
    body.insertBefore(headerEl, navEl);
  } else {
    body.prepend(navEl);
    body.prepend(headerEl);
  }

  // Append footer at the end of body (before scripts if possible)
  const existingScripts = body.querySelectorAll('body > script');
  if (existingScripts.length > 0) {
    body.insertBefore(footerEl, existingScripts[0]);
  } else {
    body.appendChild(footerEl);
  }
})();
