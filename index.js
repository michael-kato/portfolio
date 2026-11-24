/**
 * Main JavaScript for Michael Kato's portfolio
 * - Chronological project category filter
 * - Multi-video clip tabs
 * - Interactive Maya MeshOptimizer step & before/after slider
 * - On-demand Playable Unity WebGL modal
 * - Archive art renderer + fullscreen lightbox
 * - Copy buttons, Cloudflare AI Career Assistant, Blog comments
 */

document.addEventListener('DOMContentLoaded', () => {
  applyPortfolioVariant();
  setupProjectFilters();
  setupVideoTabs();
  setupMeshShowcase();
  setupPlayableModal();
  setupLightboxTriggers();
  renderArtCards();
  setupBlogImages();
  setupModalHandlers();
  setupCopyButtons();
  setupChatBot();
  setupComments();
});

function getArtData() {
  const data = window.artData || {};
  if (typeof data === 'string') {
    try { return JSON.parse(atob(data)); } catch (e) { return {}; }
  }
  return data;
}

/* ===== Clean URL Variant Support (/programming/) ===== */
const portfolioVariants = {
  programming: {
    bodyClass: 'variant-programming',
    title: 'Michael Kato | Tools & Pipeline Engineering',
    about: 'Software-focused Technical Artist with 10+ years building production tools, automation frameworks, performance workflows, telemetry dashboards, and content pipelines for games, XR, and synthetic data teams.',
    hiddenSections: []
  }
};

function applyPortfolioVariant() {
  const bodyVariant = document.body.dataset.variant;
  const pathVariant = window.location.pathname.split('/').filter(Boolean).pop();
  const variant = portfolioVariants[bodyVariant || pathVariant];
  if (!variant) return;

  document.body.classList.add(variant.bodyClass);
  if (variant.title) document.title = variant.title;
  if (variant.about) {
    const lede = document.querySelector('.hero__lede');
    if (lede) lede.textContent = variant.about;
  }
  (variant.hiddenSections || []).forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.hidden = true;
  });
}

/* ===== Chronological Project Filter ===== */
function setupProjectFilters() {
  const buttons = document.querySelectorAll('.filter-pill[data-filter]');
  const items = document.querySelectorAll('#projects-stream .project-entry');
  const countEl = document.getElementById('projects-count');
  if (!buttons.length || !items.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      buttons.forEach((b) => {
        const active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', String(active));
      });

      let visible = 0;
      items.forEach((item) => {
        const cats = (item.dataset.categories || '').split(/\s+/).filter(Boolean);
        const show = filter === 'all' || cats.includes(filter);
        item.hidden = !show;
        if (show) visible++;
      });

      if (countEl) {
        countEl.textContent = `${visible} ${visible === 1 ? 'item' : 'items'}`;
      }
    });
  });
}

/* ===== Multi-Video Clip Switcher ===== */
function setupVideoTabs() {
  document.querySelectorAll('[data-video-tabs]').forEach((wrap) => {
    const tabs = wrap.querySelectorAll('.media-tab[data-video-src]');
    const video = wrap.querySelector('video');
    if (!tabs.length || !video) return;

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const src = tab.dataset.videoSrc;
        if (!src || video.getAttribute('src') === src) return;

        tabs.forEach((t) => {
          const active = t === tab;
          t.classList.toggle('is-active', active);
          t.setAttribute('aria-selected', String(active));
        });

        video.pause();
        video.setAttribute('src', src);
        video.load();
        video.play().catch(() => {});
      });
    });
  });
}

/* ===== Interactive Maya MeshOptimizer Showcase ===== */
function setupMeshShowcase() {
  document.querySelectorAll('[data-mesh-showcase]').forEach((showcase) => {
    const modeTabs = showcase.querySelectorAll('[data-mesh-mode]');
    const panels = showcase.querySelectorAll('[data-mesh-panel]');

    modeTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.meshMode;
        modeTabs.forEach((t) => {
          const active = t === tab;
          t.classList.toggle('is-active', active);
          t.setAttribute('aria-selected', String(active));
        });
        panels.forEach((panel) => {
          const active = panel.dataset.meshPanel === target;
          panel.hidden = !active;
          panel.classList.toggle('is-active', active);
        });
      });
    });

    // Before/After range sliders
    showcase.querySelectorAll('[data-ba-slider]').forEach((slider) => {
      const range = slider.querySelector('.ba-range');
      if (!range) return;
      const sync = () => slider.style.setProperty('--pos', `${range.value}%`);
      range.addEventListener('input', sync);
      sync();
    });

    // Step pills inside each panel
    panels.forEach((panel) => {
      const pills = panel.querySelectorAll('.step-pill');
      const slider = panel.querySelector('[data-ba-slider]');
      const singleWrap = panel.querySelector('.step-single');
      const singleImg = singleWrap?.querySelector('img');
      const captionEl = panel.querySelector('[data-mesh-caption]');
      if (!pills.length || !slider || !singleWrap || !singleImg) return;

      const defaultCaption = captionEl ? captionEl.textContent : '';

      pills.forEach((pill) => {
        pill.addEventListener('click', () => {
          pills.forEach((p) => p.classList.toggle('is-active', p === pill));

          if (pill.dataset.stepView === 'compare') {
            slider.hidden = false;
            singleWrap.hidden = true;
            if (captionEl) captionEl.textContent = defaultCaption;
          } else {
            slider.hidden = true;
            singleWrap.hidden = false;
            singleImg.src = pill.dataset.stepSrc;
            singleImg.alt = pill.dataset.stepNote || 'MeshOptimizer step';
            if (captionEl) captionEl.textContent = pill.dataset.stepNote || defaultCaption;
          }
        });
      });

      // Clicking the single step image opens all steps in lightbox
      const stepImages = Array.from(pills)
        .filter((p) => p.dataset.stepSrc)
        .map((p) => ({ src: p.dataset.stepSrc, caption: p.dataset.stepNote || '' }));

      singleImg.addEventListener('click', () => {
        const idx = Math.max(0, stepImages.findIndex((s) => singleImg.src.endsWith(s.src)));
        if (stepImages.length) openLightbox(stepImages, idx);
      });
    });
  });
}

/* ===== On-Demand Playable Unity WebGL Modal ===== */
function setupPlayableModal() {
  const modal = document.getElementById('playable-modal');
  const iframe = document.getElementById('playable-iframe');
  const titleEl = document.getElementById('playable-modal-title');
  const openLink = document.getElementById('playable-modal-open');
  const closeBtn = document.getElementById('playable-modal-close');
  if (!modal || !iframe) return;

  const closeModal = () => {
    modal.close();
    iframe.src = 'about:blank';
  };

  document.querySelectorAll('[data-playable]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const url = btn.dataset.playable;
      if (!url) return;
      if (titleEl) titleEl.textContent = `${btn.dataset.playableTitle || 'Unity WebGL Build'} (Interactive)`;
      if (openLink) openLink.href = url;
      iframe.src = url;
      modal.showModal();
    });
  });

  closeBtn?.addEventListener('click', closeModal);
  modal.addEventListener('close', () => { iframe.src = 'about:blank'; });
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

/* ===== Direct Single-Image Lightbox Triggers ===== */
function setupLightboxTriggers() {
  document.querySelectorAll('[data-lightbox-src]').forEach((btn) => {
    btn.addEventListener('click', () => {
      openLightbox([{
        src: btn.dataset.lightboxSrc,
        caption: btn.dataset.lightboxCaption || ''
      }], 0);
    });
  });
}

/* ===== Archive Page Art Cards ===== */
function renderArtCards() {
  const artItems = document.querySelectorAll('.art-item');
  const data = getArtData();
  if (!artItems.length || Object.keys(data).length === 0) return;

  artItems.forEach((item) => {
    const art = data[item.id];
    if (!art) return;

    const processedImages = normalizeImageData(art.images);
    let imagesHtml = '';
    if (processedImages.length > 0) {
      imagesHtml += `<div class="art-images">`;
      processedImages.forEach((img, idx) => {
        imagesHtml += `
          <button type="button" class="art-image-container" data-index="${idx}">
            <span class="art-image-frame"><img src="${img.src}" alt="${escapeHtml(img.caption || art.title)}" class="art-image" loading="lazy" referrerpolicy="no-referrer"></span>
            ${img.caption ? `<span class="art-image-caption">${escapeHtml(img.caption)}</span>` : ''}
          </button>`;
      });
      imagesHtml += `</div>`;
    }

    let videoHtml = '';
    if (art.video) {
      const embedUrl = getYouTubeEmbedUrl(art.video);
      if (embedUrl) {
        videoHtml += `<div class="art-video-container"><iframe src="${embedUrl}" title="${escapeHtml(art.title)}" frameborder="0" allowfullscreen loading="lazy"></iframe></div>`;
      }
    }

    item.innerHTML = `
      <div class="art-card">
        <h2 class="art-header">${escapeHtml(art.title)}</h2>
        <div class="art-body">
          ${art.description || ''}
          ${imagesHtml}
          ${videoHtml}
        </div>
      </div>`;

    item.querySelectorAll('.art-image-container').forEach((imgContainer) => {
      imgContainer.addEventListener('click', () => {
        const index = parseInt(imgContainer.dataset.index, 10) || 0;
        openLightbox(processedImages, index);
      });
    });
  });
}

/* ===== Blog Inline Images -> Lightbox ===== */
function setupBlogImages() {
  document.querySelectorAll('.blog-content').forEach((content) => {
    const imgs = Array.from(content.querySelectorAll('img'));
    if (!imgs.length) return;

    const images = imgs.map((image) => ({
      src: image.currentSrc || image.src,
      caption: image.closest('figure')?.querySelector('figcaption')?.textContent.trim() || image.alt || ''
    }));

    imgs.forEach((image, index) => {
      image.addEventListener('click', () => openLightbox(images, index));
    });
  });
}

/* ===== Copy-to-Clipboard Buttons ===== */
function setupCopyButtons() {
  document.querySelectorAll('[data-copy]').forEach((button) => {
    const label = button.textContent;
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(button.dataset.copy);
        button.textContent = 'Copied';
      } catch (e) {
        button.textContent = 'Failed';
      }
      setTimeout(() => { button.textContent = label; }, 1600);
    });
  });
}

/* ===== Cloudflare AI Career Assistant ===== */
function setupChatBot() {
  const toggle = document.getElementById('chat-toggle');
  const chatWindow = document.getElementById('chat-window');
  const close = document.getElementById('close-chat');
  const send = document.getElementById('send-chat');
  const input = document.getElementById('chat-input');
  const messages = document.getElementById('chat-messages');

  if (!toggle || !chatWindow || !input || !messages) return;

  const setOpen = (isOpen) => {
    chatWindow.classList.toggle('active', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    if (isOpen) setTimeout(() => input.focus(), 120);
  };

  toggle.addEventListener('click', () => setOpen(!chatWindow.classList.contains('active')));
  close?.addEventListener('click', () => setOpen(false));

  const handleSend = async () => {
    const text = input.value.trim();
    if (!text) return;

    const userHtml = typeof marked !== 'undefined' ? marked.parse(text) : escapeHtml(text);
    messages.innerHTML += `<div class="message user-message">${userHtml}</div>`;
    input.value = '';
    messages.scrollTop = messages.scrollHeight;
    input.disabled = true;

    const typingId = 'bot-typing-' + Date.now();
    messages.innerHTML += `<div id="${typingId}" class="message bot-message">Thinking…</div>`;
    messages.scrollTop = messages.scrollHeight;

    try {
      let timezone = 'unknown';
      try { timezone = Intl.DateTimeFormat().resolvedOptions().timeZone; } catch (e) {}

      const response = await fetch('https://portfolio-chat.mkato.workers.dev', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          language: navigator.language,
          timezone,
          screenRes: `${window.screen.width}x${window.screen.height}`,
          deviceMemory: navigator.deviceMemory || null,
          cores: navigator.hardwareConcurrency || null
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server Error (${response.status})`);
      }

      const data = await response.json();
      document.getElementById(typingId)?.remove();
      const botReply = data.reply || "Try asking about Michael's work at Meta, Apple, or Sledgehammer.";
      const botHtml = typeof marked !== 'undefined' ? marked.parse(botReply) : escapeHtml(botReply);
      messages.innerHTML += `<div class="message bot-message">${botHtml}</div>`;
    } catch (error) {
      document.getElementById(typingId)?.remove();
      messages.innerHTML += `<div class="message bot-message"><strong>Connection error:</strong> ${escapeHtml(error.message)}</div>`;
    } finally {
      input.disabled = false;
      input.focus();
      messages.scrollTop = messages.scrollHeight;
    }
  };

  send?.addEventListener('click', handleSend);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleSend(); });
}

/* ===== Blog Comments (Cloudflare D1 Worker) ===== */
function setupComments() {
  const targets = document.querySelectorAll('.blog-feed-item, #blog-post .container');
  if (!targets.length) return;

  targets.forEach(async (target) => {
    const slug = target.dataset.postId || target.id || window.location.pathname.split('/').filter(Boolean).pop();
    if (!slug || slug === 'blog') return;

    const commentWrapper = document.createElement('div');
    commentWrapper.className = 'comments-section';
    commentWrapper.innerHTML = `
      <h3 class="comments-title">Comments</h3>
      <div class="comments-list" id="comments-list-${slug}">Loading comments…</div>
      <form class="comment-form" id="comment-form-${slug}">
        <input type="text" placeholder="Name (optional)" class="comment-name-input" maxlength="50">
        <textarea placeholder="Share your thoughts..." required class="comment-text-input" maxlength="2000"></textarea>
        <button type="submit" class="comment-submit-btn">Post Comment</button>
        <div class="comment-status"></div>
      </form>
    `;
    target.appendChild(commentWrapper);

    const listContainer = document.getElementById(`comments-list-${slug}`);
    const form = document.getElementById(`comment-form-${slug}`);
    const status = form.querySelector('.comment-status');
    const submitBtn = form.querySelector('.comment-submit-btn');

    try {
      const response = await fetch(`https://portfolio-comments.mkato.workers.dev/comments?slug=${encodeURIComponent(slug)}`);
      if (response.ok) {
        const comments = await response.json();
        if (!comments.length) {
          listContainer.innerHTML = '<p style="color: var(--text-muted); font-size: 0.88rem;">No comments yet.</p>';
        } else {
          listContainer.innerHTML = comments.map((c) => `
            <div class="comment-item">
              <div class="comment-meta">
                <span class="comment-author">${escapeHtml(c.author)}</span>
                <span class="comment-date">${new Date(c.created_at).toLocaleDateString()}</span>
              </div>
              <div class="comment-body">${escapeHtml(c.text)}</div>
            </div>
          `).join('');
        }
      }
    } catch (e) {
      listContainer.innerHTML = '<p style="color: var(--text-muted); font-size: 0.88rem;">Unable to load comments right now.</p>';
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const author = form.querySelector('.comment-name-input').value.trim() || 'Anonymous';
      const text = form.querySelector('.comment-text-input').value.trim();

      submitBtn.disabled = true;
      status.textContent = 'Posting…';

      try {
        let timezone = 'unknown';
        try { timezone = Intl.DateTimeFormat().resolvedOptions().timeZone; } catch (err) {}

        const response = await fetch('https://portfolio-comments.mkato.workers.dev/comments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            slug,
            author,
            text,
            userAgent: navigator.userAgent,
            language: navigator.language,
            timezone,
            screenRes: `${window.screen.width}x${window.screen.height}`,
            deviceMemory: navigator.deviceMemory || null,
            cores: navigator.hardwareConcurrency || null
          })
        });

        if (response.ok) {
          status.textContent = 'Comment submitted. It will appear once approved.';
          form.reset();
        } else {
          throw new Error();
        }
      } catch (err) {
        status.textContent = 'Failed to post. Please try again later.';
      } finally {
        submitBtn.disabled = false;
      }
    });
  });
}

/* ===== Lightbox Dialog ===== */
function setupModalHandlers() {
  const lightbox = document.getElementById('lightbox-container');
  if (!lightbox) return;

  lightbox.addEventListener('click', (e) => {
    const isImage = e.target.closest('.lightbox-image');
    const isNav = e.target.closest('.lightbox-prev, .lightbox-next, .lightbox-counter');
    if (!isImage && !isNav) lightbox.close();
  });

  lightbox.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      const prevBtn = lightbox.querySelector('.lightbox-prev');
      if (prevBtn && !prevBtn.disabled) prevBtn.click();
    } else if (e.key === 'ArrowRight') {
      const nextBtn = lightbox.querySelector('.lightbox-next');
      if (nextBtn && !nextBtn.disabled) nextBtn.click();
    }
  });
}

function openLightbox(images, startIndex = 0) {
  const lightbox = document.getElementById('lightbox-container');
  if (!lightbox || !images.length) return;

  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const lightboxCounter = lightbox.querySelector('.lightbox-counter');
  const prevButton = lightbox.querySelector('.lightbox-prev');
  const nextButton = lightbox.querySelector('.lightbox-next');
  const nav = lightbox.querySelector('.lightbox-nav');
  if (!lightboxImage || !lightboxCaption || !lightboxCounter || !prevButton || !nextButton) return;

  let currentIndex = startIndex || 0;

  function updateLightbox() {
    lightboxImage.referrerPolicy = 'no-referrer';
    lightboxImage.src = images[currentIndex].src;
    lightboxCaption.textContent = images[currentIndex].caption || '';
    lightboxCounter.textContent = `${currentIndex + 1} / ${images.length}`;
    prevButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === images.length - 1;
    if (nav) nav.hidden = images.length <= 1;
  }

  prevButton.onclick = () => {
    if (currentIndex > 0) { currentIndex--; updateLightbox(); }
  };
  nextButton.onclick = () => {
    if (currentIndex < images.length - 1) { currentIndex++; updateLightbox(); }
  };

  updateLightbox();
  if (!lightbox.open) lightbox.showModal();
}

function getYouTubeEmbedUrl(url) {
  if (!url) return null;
  const regexPatterns = [
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/,
    /^([^"&?/\s]{11})$/
  ];
  for (const pattern of regexPatterns) {
    const match = url.match(pattern);
    if (match && match[1]) return `https://www.youtube.com/embed/${match[1]}`;
  }
  return url;
}

function normalizeImageData(images) {
  if (!images) return [];
  return images.map((img) => (typeof img === 'string' ? { src: img, caption: '' } : img));
}

function escapeHtml(unsafe) {
  return String(unsafe || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
