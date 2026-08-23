/**
 * Main JavaScript for Michael Kato's portfolio
 * Handles all interactive features including:
 * - Career section tabs
 * - Art gallery expansions
 * - Project modals
 * - Lightbox for images
 * - Dynamic header backgrounds
 */

document.addEventListener('DOMContentLoaded', () => {
  applyPortfolioVariant();

  initCareerSection();
  renderProjectCards();
  renderArtCards();
  setupBlogImages();
  setupModalHandlers();
  setupChatBot();
  setupComments();

  // Delay decryption and rendering to prioritize initial page load
  setTimeout(() => {
    renderProjectCards();
    renderArtCards();
    initDynamicBackground();
  }, 400);
});

function getProjectData() {
  const data = window.projectData || {};
  if (typeof data === 'string') {
    try { return JSON.parse(atob(data)); } catch(e) { return {}; }
  }
  return data;
}

function getArtData() {
  const data = window.artData || {};
  if (typeof data === 'string') {
    try { return JSON.parse(atob(data)); } catch(e) { return {}; }
  }
  return data;
}

const portfolioVariants = {
  programming: {
    bodyClass: 'variant-programming',
    title: 'Michael Kato | Programming Portfolio',
    about: 'Software-focused Technical Artist with 10+ years building production tools, automation systems, performance workflows, data dashboards, and content pipelines for games, XR, and synthetic data teams.',
    labels: {
      career: 'Programming Work'
    },
    hiddenSections: ['art', 'blog'],
    githubTitle: 'More Code',
    githubDescription: 'Browse additional projects on GitHub.'
  }
};

/**
 * Apply content, nav, and theme changes for clean URL portfolio variants.
 */
function applyPortfolioVariant() {
  const variant = getCurrentVariant();
  if (!variant) return;

  document.body.classList.add(variant.bodyClass);

  if (variant.title) {
    document.title = variant.title;
  }

  if (variant.about) {
    const aboutText = document.querySelector('#about .about-content p');
    if (aboutText) aboutText.textContent = variant.about;
  }

  if (variant.labels) {
    Object.entries(variant.labels).forEach(([sectionId, label]) => {
      const sectionHeading = document.querySelector(`#${sectionId} .section-header h2`);
      if (sectionHeading) sectionHeading.textContent = label;

      document.querySelectorAll(`nav a[href="#${sectionId}"]`).forEach(link => {
        link.textContent = label;
      });
    });
  }

  if (variant.githubTitle) {
    const githubTitle = document.querySelector('.github-link-title');
    if (githubTitle) githubTitle.textContent = variant.githubTitle;
  }

  if (variant.githubDescription) {
    const githubDescription = document.querySelector('.github-link-description');
    if (githubDescription) githubDescription.textContent = variant.githubDescription;
  }

  hideVariantSections(variant.hiddenSections || []);
}

/**
 * Prefer explicit page data, then fall back to the last clean URL segment.
 */
function getCurrentVariant() {
  const bodyVariant = document.body.dataset.variant;
  const pathVariant = window.location.pathname
    .split('/')
    .filter(Boolean)
    .pop();
  const variantKey = bodyVariant || pathVariant;

  return portfolioVariants[variantKey] || null;
}

/**
 * Hide sections and their same-page nav links for a focused variant.
 */
function hideVariantSections(sectionIds) {
  sectionIds.forEach(sectionId => {
    const section = document.getElementById(sectionId);
    if (section) section.hidden = true;

    document.querySelectorAll(`nav a[href="#${sectionId}"]`).forEach(link => {
      const navItem = link.closest('li');
      if (navItem) navItem.hidden = true;
    });
  });
}

/**
 * Dynamically render project cards inline based on data-project-ids attribute
 */
function renderProjectCards() {
  const containers = document.querySelectorAll('.career-projects');
  const data = getProjectData();

  if (Object.keys(data).length === 0) {
    return false;
  }
  
  containers.forEach(container => {
    const ids = container.dataset.projectIds ? container.dataset.projectIds.split(',') : [];
    if (ids.length === 0) return;
    
    let html = '';
    ids.forEach(id => {
      const projectId = id.trim();
      const project = data[projectId];
      if (!project) return;

      let imagesHtml = '';
      if (project.images && project.images.length > 0) {
        imagesHtml += `<div class="project-images">`;
        project.images.forEach((img, idx) => {
          const src = typeof img === 'string' ? img : img.src;
          const caption = typeof img === 'object' && img.caption ? img.caption : '';
          imagesHtml += `
            <div class="project-image-container" data-index="${idx}">
              <img src="${src}" alt="${project.title}" class="project-image" referrerpolicy="no-referrer" onerror="this.src='/api/placeholder/640/360'; this.onerror=null;">
              ${caption ? `<div class="project-image-caption">${caption}</div>` : ''}
            </div>`;
        });
        imagesHtml += `</div>`;
      }

      let videoHtml = '';
      if (project.video) {
        const embedUrl = typeof getYouTubeEmbedUrl === 'function' ? getYouTubeEmbedUrl(project.video) : null;
        if (Array.isArray(embedUrl)) {
          embedUrl.forEach(url => {
            videoHtml += `<div class="project-video-container"><iframe src="${url}" frameborder="0" allowfullscreen></iframe></div>`;
          });
        } else if (embedUrl) {
          videoHtml += `<div class="project-video-container"><iframe src="${embedUrl}" frameborder="0" allowfullscreen></iframe></div>`;
        }
      }

      html += `
        <div class="project-card" id="${projectId}">
          <h3 class="project-header">${project.title}</h3>
          <div class="project-body">
            ${project.description || ''}
            ${imagesHtml}
            ${videoHtml}
          </div>
        </div>`;
    });
    container.innerHTML = html;
  });

  // Attach lightbox click handlers for images inside project cards
  containers.forEach(container => {
    container.querySelectorAll('.project-card').forEach(card => {
      const projectId = card.id;
      const project = data[projectId];
      if (!project || !project.images || project.images.length === 0) return;
      const processedImages = typeof normalizeImageData === 'function' ? normalizeImageData(project.images) : [];
      card.querySelectorAll('.project-image-container').forEach(imgContainer => {
        imgContainer.addEventListener('click', () => {
          const index = parseInt(imgContainer.dataset.index) || 0;
          if (typeof openLightbox === 'function') {
            openLightbox(processedImages, index);
          }
        });
      });
    });
  });

  return true;
}

/**
 * Initialize career section collapsible functionality
 */
function initCareerSection() {
  const careerCategories = document.querySelectorAll('.career-category');
  
  careerCategories.forEach((category, index) => {
    const header = category.querySelector('.career-category-header');
    if (!header) return;
    
    header.addEventListener('click', () => {
      const isOpening = !category.classList.contains('active');
      category.classList.toggle('active');
      
      // If opening this category, close others (accordion style)
      if (isOpening) {
        careerCategories.forEach((otherCategory, otherIndex) => {
          if (index !== otherIndex) {
            otherCategory.classList.remove('active');
          }
        });

        // Scroll category to top of viewport (respecting scroll-margin-top)
        setTimeout(() => {
          category.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 60);
      }
    });
  });
  
  // Open the first category by default
  if (careerCategories.length > 0) {
    careerCategories[0].classList.add('active');
  }
}

/**
 * Project cards are rendered fixed inline; no modal setup required.
 */
function setupProjectCards() {
  // No modal click handlers needed
}

/**
 * Open project modal with specified project data
 */
function openProjectModal(project) {
  const projectModal = document.getElementById('project-modal');
  if (!projectModal) return;
  
  // Build modal content
  let modalContent = `
    <div class="modal-content">
      <span class="close-modal">&times;</span>
      <h2 class="modal-header">${project.title}</h2>
      <div class="modal-body">
        ${project.description}
      </div>`;
  
  // Add images if available
  if (project.images && project.images.length > 0) {
    modalContent += `<div class="modal-gallery">`;
    project.images.forEach((image, index) => {
      const imageUrl = typeof image === 'string' ? image : image.src;
      modalContent += `
        <div class="modal-image-container" data-index="${index}">
          <img src="${imageUrl}" alt="${project.title}" class="modal-image" referrerpolicy="no-referrer" onerror="this.src='/api/placeholder/640/360'; this.onerror=null;">
        </div>`;
    });
    modalContent += `</div>`;
  }
  
  // Add video if available
  if (project.video) {
    const embedUrl = getYouTubeEmbedUrl(project.video);
    if (Array.isArray(embedUrl)) {
      // Multiple videos
      embedUrl.forEach(url => {
        modalContent += `
          <div class="modal-video-container">
            <iframe class="modal-video" src="${url}" frameborder="0" allowfullscreen></iframe>
          </div>`;
      });
    } else if (embedUrl) {
      // Single video
      modalContent += `
        <div class="modal-video-container">
          <iframe class="modal-video" src="${embedUrl}" frameborder="0" allowfullscreen></iframe>
        </div>`;
    }
  }
  
  modalContent += `</div>`;
  
  // Update and show modal
  projectModal.innerHTML = modalContent;
  projectModal.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  // Add image click handlers for lightbox
  if (project.images && project.images.length > 0) {
    const processedImages = normalizeImageData(project.images);
    projectModal.querySelectorAll('.modal-image-container').forEach(container => {
      container.addEventListener('click', () => {
        const imageIndex = parseInt(container.dataset.index);
        openLightbox(processedImages, imageIndex);
      });
    });
  }
  
  // Add close handler
  const closeBtn = projectModal.querySelector('.close-modal');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      projectModal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }
}

/**
 * Set up event handlers for art items
 */
/**
 * Dynamically render art items inline within .art-grid
 */
function renderArtCards() {
  const artItems = document.querySelectorAll('.art-item');
  const data = typeof getArtData === 'function' ? getArtData() : (window.artData || {});
  if (!artItems.length || Object.keys(data).length === 0) return;

  artItems.forEach(item => {
    const artId = item.id;
    const art = data[artId];
    if (!art) return;

    const processedImages = typeof normalizeImageData === 'function' ? normalizeImageData(art.images) : [];

    let imagesHtml = '';
    if (processedImages && processedImages.length > 0) {
      imagesHtml += `<div class="art-images">`;
      processedImages.forEach((img, idx) => {
        imagesHtml += `
          <div class="art-image-container" data-index="${idx}">
            <img src="${img.src}" alt="${art.title}" class="art-image" referrerpolicy="no-referrer" onerror="this.src='/api/placeholder/640/360'; this.onerror=null;">
            ${img.caption ? `<div class="art-image-caption">${img.caption}</div>` : ''}
          </div>`;
      });
      imagesHtml += `</div>`;
    }

    let videoHtml = '';
    if (art.video) {
      const embedUrl = typeof getYouTubeEmbedUrl === 'function' ? getYouTubeEmbedUrl(art.video) : null;
      if (Array.isArray(embedUrl)) {
        embedUrl.forEach(url => {
          videoHtml += `<div class="art-video-container"><iframe src="${url}" frameborder="0" allowfullscreen></iframe></div>`;
        });
      } else if (embedUrl) {
        videoHtml += `<div class="art-video-container"><iframe src="${embedUrl}" frameborder="0" allowfullscreen></iframe></div>`;
      }
    }

    item.innerHTML = `
      <div class="art-card">
        <h3 class="art-header">${art.title}</h3>
        <div class="art-body">
          ${art.description || ''}
          ${imagesHtml}
          ${videoHtml}
        </div>
      </div>`;

    item.querySelectorAll('.art-image-container').forEach(imgContainer => {
      imgContainer.addEventListener('click', () => {
        const index = parseInt(imgContainer.dataset.index) || 0;
        if (typeof openLightbox === 'function') {
          openLightbox(processedImages, index);
        }
      });
    });
  });
}

function setupBlogImages() {
  document.querySelectorAll('.blog-content').forEach((content) => {
    const images = Array.from(content.querySelectorAll('img')).map((image) => ({
      src: image.currentSrc || image.src,
      caption: image.closest('figure')?.querySelector('figcaption')?.textContent.trim() || image.alt || ''
    }));

    content.querySelectorAll('img').forEach((image, index) => {
      image.addEventListener('click', () => openLightbox(images, index));
    });
  });
}

/**
 * Set up the AI Career Assistant widget
 */
function setupChatBot() {
  const toggle = document.getElementById('chat-toggle');
  const chatWindow = document.getElementById('chat-window');
  const close = document.getElementById('close-chat');
  const send = document.getElementById('send-chat');
  const input = document.getElementById('chat-input');
  const messages = document.getElementById('chat-messages');

  if (!toggle || !chatWindow) return;

  toggle.onclick = () => {
    const isActive = chatWindow.classList.toggle('active');
    if (isActive) {
      // Focus the input field after a short delay for the window transition
      setTimeout(() => input.focus(), 150);
    }
  };
  close.onclick = () => chatWindow.classList.remove('active');

  const handleSend = async () => {
    const text = input.value.trim();
    if (!text) return;

    // Use markdown for user messages if marked is available
    const userHtml = typeof marked !== 'undefined' ? marked.parse(text) : text;
    messages.innerHTML += `<div class="message user-message">${userHtml}</div>`;
    input.value = '';
    messages.scrollTop = messages.scrollHeight;
    input.disabled = true;

    const typingId = 'bot-typing-' + Date.now();
    messages.innerHTML += `<div id="${typingId}" class="message bot-message italic">Consulting Career Assistant...</div>`;
    messages.scrollTop = messages.scrollHeight;

    try {
      let timezone = "unknown";
      try {
        timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      } catch (e) {}

      // Update this URL to your actual worker URL after running 'wrangler deploy'
      const response = await fetch('https://portfolio-chat.mkato.workers.dev', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ 
          prompt: text,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          language: navigator.language,
          timezone: timezone,
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
      const botReply = data.reply || "I'm not sure about that. Try asking about his work at Meta or Apple!";
      const botHtml = typeof marked !== 'undefined' ? marked.parse(botReply) : botReply;
      messages.innerHTML += `<div class="message bot-message">${botHtml}</div>`;
    } catch (error) {
      console.error("Career Assistant Error:", error);
      document.getElementById(typingId)?.remove();
      messages.innerHTML += `<div class="message bot-message"><strong>Error:</strong> ${error.message}<br><br>I'm having trouble connecting to my brain. Please try again later!</div>`;
    } finally {
      input.disabled = false;
      input.focus();
    }
    messages.scrollTop = messages.scrollHeight;
  };

  send.onclick = handleSend;
  input.onkeypress = (e) => { if (e.key === 'Enter') handleSend(); };
}

/**
 * Setup simple anonymous commenting for blog posts
 */
async function setupComments() {
  // Target the post containers (cards in the feed or the main container on single pages)
  const targets = document.querySelectorAll('.blog-feed-item, #blog-post .container');
  if (targets.length === 0) return;

  // Inject basic styles for the comment section
  if (!document.getElementById('comments-style')) {
    const style = document.createElement('style');
    style.id = 'comments-style';
    style.textContent = `
      .comments-section { margin-top: 1rem; border-top: 1px solid var(--dark-burnt-orange);  max-width: 800px; }
      .comment-item { margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 1px solid #222; }
      .comment-meta { font-size: 0.85rem; color: var(--light-wheat); margin-bottom: 0.5rem; opacity: 0.8; }
      .comment-author { font-weight: bold; color: var(--accent-color); margin-right: 0.5rem; }
      .comment-body { line-height: 1.6; color: var(--wheat); white-space: pre-wrap; }
      .comment-form { display: flex; flex-direction: column; gap: 1rem; margin-top: 3rem; background: rgba(0,0,0,0.3); padding: 1.5rem; border-radius: 4px; }
      .comment-name-input, .comment-text-input { background: #0a0a0a; border: 1px solid #333; color: var(--wheat); padding: 0.8rem; font-family: inherit; }
      .comment-text-input { min-height: 120px; resize: vertical; }
      .comment-submit-btn { background: var(--dark-burnt-orange); color: white; border: none; padding: 0.8rem; cursor: pointer; font-weight: bold; transition: opacity 0.2s; }
      .comment-submit-btn:hover { opacity: 0.8; }
      .comment-submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
      .comment-status { font-size: 0.9rem; margin-top: 0.5rem; font-style: italic; color: var(--light-wheat); }
    `;
    document.head.appendChild(style);
  }

  targets.forEach(async (target) => {
    const slug = target.dataset.postId || target.id || window.location.pathname.split('/').filter(Boolean).pop();
    if (!slug || slug === 'blog') return;

    const commentWrapper = document.createElement('div');
    commentWrapper.className = 'comments-section';
    commentWrapper.innerHTML = `
      <h3 class="comments-title">Comments</h3>
      <div class="comments-list" id="comments-list-${slug}">Loading comments...</div>
      <form class="comment-form" id="comment-form-${slug}">
        <input type="text" placeholder="Name (anonymous)" class="comment-name-input" maxlength="50">
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

    // Load existing approved comments
    try {
      const response = await fetch(`https://portfolio-comments.mkato.workers.dev/comments?slug=${slug}`);
      if (response.ok) {
        const comments = await response.json();
        if (comments.length === 0) {
          listContainer.innerHTML = '<p style="font-style: italic; opacity: 0.6;">No comments yet. Be the first!</p>';
        } else {
          listContainer.innerHTML = comments.map(c => `
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
      listContainer.innerHTML = '<p>Error loading comments.</p>';
    }

    // Handle submission
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const author = form.querySelector('.comment-name-input').value.trim() || 'Anonymous';
      const text = form.querySelector('.comment-text-input').value.trim();

      submitBtn.disabled = true;
      status.textContent = 'Posting...';

      try {
        let timezone = "unknown";
        try {
          timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        } catch (e) {}

        const response = await fetch('https://portfolio-comments.mkato.workers.dev/comments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            slug, 
            author, 
            text,
            userAgent: navigator.userAgent,
            language: navigator.language,
            timezone: timezone,
            screenRes: `${window.screen.width}x${window.screen.height}`,
            deviceMemory: navigator.deviceMemory || null,
            cores: navigator.hardwareConcurrency || null
          })
        });

        if (response.ok) {
          status.textContent = 'Comment submitted! It will appear once approved.';
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

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Set up global modal and lightbox handlers
 */
function setupModalHandlers() {
  const projectModal = document.getElementById('project-modal');
  const artModal = document.getElementById('art-modal');
  const lightbox = document.getElementById('lightbox-container');

  [projectModal, artModal].forEach(modal => {
    if (!modal) return;

    modal.addEventListener('click', (e) => {
      if (!e.target.closest('.modal-content')) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      const isImage = e.target.closest('.lightbox-image');
      const isNav = e.target.closest('.lightbox-prev, .lightbox-next, .lightbox-counter');
      if (!isImage && !isNav) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
  
  // Global keyboard navigation
  window.addEventListener('keydown', (e) => {
    // Only handle keys if a modal is visible
    const projectOpen = projectModal?.classList.contains('active');
    const artOpen = artModal?.classList.contains('active');
    const lightboxOpen = lightbox?.classList.contains('active');

    if (projectOpen || artOpen || lightboxOpen) {
      if (e.key === 'Escape') {
        // Close all modals
        if (projectModal) { projectModal.classList.remove('active'); document.body.style.overflow = ''; }
        if (artModal) { artModal.classList.remove('active'); document.body.style.overflow = ''; }
        if (lightbox) { lightbox.classList.remove('active'); document.body.style.overflow = ''; }
      } else if (e.key === 'ArrowLeft' && lightboxOpen) {
        // Previous image in lightbox
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        if (prevBtn && !prevBtn.disabled) prevBtn.click();
      } else if (e.key === 'ArrowRight' && lightboxOpen) {
        // Next image in lightbox
        const nextBtn = lightbox.querySelector('.lightbox-next');
        if (nextBtn && !nextBtn.disabled) nextBtn.click();
      }
    }
  });
}

/**
 * Open lightbox to display images at specified index
 */
function openLightbox(images, startIndex = 0) {
  const lightbox = document.getElementById('lightbox-container');
  if (!lightbox || !images.length) return;

  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const lightboxCounter = lightbox.querySelector('.lightbox-counter');
  const prevButton = lightbox.querySelector('.lightbox-prev');
  const nextButton = lightbox.querySelector('.lightbox-next');
  const closeButton = lightbox.querySelector('.lightbox-close');
  if (!lightboxImage || !lightboxCaption || !lightboxCounter || !prevButton || !nextButton) return;
  
  let currentIndex = startIndex || 0;
  
  // Function to update lightbox content
  function updateLightbox() {
    // Set image with fallback
    lightboxImage.referrerPolicy = 'no-referrer';
    lightboxImage.src = images[currentIndex].src;
    lightboxImage.onerror = function() {
      this.src = '/api/placeholder/640/360';
      this.onerror = null;
    };
    
    // Update caption and counter
    lightboxCaption.textContent = images[currentIndex].caption || '';
    lightboxCounter.textContent = `${currentIndex + 1} / ${images.length}`;
    
    // Update buttons state
    prevButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === images.length - 1;
  }
  
  // Set up navigation
  prevButton.onclick = () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateLightbox();
    }
  };
  
  nextButton.onclick = () => {
    if (currentIndex < images.length - 1) {
      currentIndex++;
      updateLightbox();
    }
  };
  
  // Close lightbox when clicking X or outside the image
  lightbox.onclick = (e) => {
    const isImage = e.target.closest('.lightbox-image');
    const isNav = e.target.closest('.lightbox-prev, .lightbox-next, .lightbox-counter');
    if (!isImage && !isNav) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  if (closeButton) {
    closeButton.onclick = (e) => {
      e.stopPropagation();
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    };
  }
  
  // Show lightbox with current image
  updateLightbox();
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Global to track the last used header image to prevent consecutive repeats
let lastHeaderImage = '';

/**
 * Function to set a random header background from gallery images
 */
function initDynamicBackground() {
  const headerBackground = document.querySelector('.header-background');
  if (!headerBackground) return;
  
  // Get all gallery images
  const galleryImages = collectGalleryImages();
  
  // Set initial background
  setRandomHeaderBackground(galleryImages);
  
  // Change background every 10 seconds
  setInterval(() => setRandomHeaderBackground(galleryImages), 4000);
}

/**
 * Set random header background from available images
 */
function setRandomHeaderBackground(galleryImages) {
  const headerBackground = document.querySelector('.header-background');
  if (!headerBackground || !galleryImages.length) return;
  
  // Select a random image, ensuring it's not the same as the current one
  let selectedImage;
  if (galleryImages.length > 1) {
    do {
      selectedImage = galleryImages[Math.floor(Math.random() * galleryImages.length)];
    } while (selectedImage === lastHeaderImage);
  } else {
    selectedImage = galleryImages[0];
  }
  
  lastHeaderImage = selectedImage;
  
  // Fade out current background
  headerBackground.style.opacity = 0;
  
  // After fade-out, set new background and fade in
  setTimeout(() => {
    headerBackground.style.backgroundImage = `url(${selectedImage})`;
    headerBackground.style.opacity = 0.25; // Slightly increased for better visibility of alpha images
  }, 300);
}

/**
 * Collect all image URLs from art data
 */
function collectGalleryImages() {
  const imageUrls = [];
  
  Object.values(getArtData()).forEach(artProject => {
    if (artProject.images && artProject.images.length > 0) {
      artProject.images.forEach(image => {
        const imageUrl = typeof image === 'string' ? image : image.src;
        
        // Filter out video files which cannot be used as CSS background-images
        const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(imageUrl);
        
        if (imageUrl && !isVideo && !imageUrl.includes('/api/placeholder/') && !imageUrl.includes('placeholder')) {
          imageUrls.push(imageUrl);
        }
      });
    }
  });
  
  // If no images found in artData, get images from DOM
  if (imageUrls.length === 0) {
    document.querySelectorAll('.art-item img').forEach(img => {
      if (img.src && !img.src.includes('/api/placeholder/') && !img.src.includes('placeholder')) {
        imageUrls.push(img.src);
      }
    });
  }
  
  return imageUrls;
}

/**
 * Convert YouTube watch URLs to embed URLs
 */
function getYouTubeEmbedUrl(url) {
  if (!url) return null;
  
  // Handle array of videos
  if (Array.isArray(url)) {
    return url.map(u => getYouTubeEmbedUrl(u)).filter(Boolean);
  }
  
  // Handle various YouTube URL formats
  const regexPatterns = [
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
    /^([^"&?\/\s]{11})$/ // Direct video ID
  ];
  
  for (const pattern of regexPatterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
  }
  
  return url; // Return original if can't be parsed
}

/**
 * Normalize image data to consistent format
 */
function normalizeImageData(images) {
  if (!images) return [];
  
  return images.map(img => {
    if (typeof img === 'string') return { src: img, caption: '' };
    return img;
  });
}
