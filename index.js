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
  setupProjectCards();
  setupArtItems();
  setupBlogImages();
  setupModalHandlers();
  setupChatBot();
  setupComments();

  // Delay decryption and rendering to prioritize initial page load
  setTimeout(() => {
    renderProjectCards();
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
 * Dynamically render project cards based on data-project-ids attribute
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

      const tags = project.tags || [];
      const tagsHtml = tags.length > 0 
        ? `<div class="project-tags">${tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}</div>`
        : '';
      
      // Support up to 3 cards side-by-side as per CSS grid
      html += `
        <div class="project-card" id="${projectId}">
          <h3 class="project-header">${project.title}</h3>
          <p class="project-description">${project.summary || ''}</p>
          ${tagsHtml}
        </div>`;
    });
    container.innerHTML = html;
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
      // Toggle active class
      category.classList.toggle('active');
      
      // If opening this category, close others (accordion style)
      if (category.classList.contains('active')) {
        careerCategories.forEach((otherCategory, otherIndex) => {
          if (index !== otherIndex) {
            otherCategory.classList.remove('active');
          }
        });

        // Scroll to the top of the category after a short delay for the transition
        setTimeout(() => {
          category.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      }
    });
  });
  
  // Open the first category by default
  if (careerCategories.length > 0) {
    careerCategories[0].classList.add('active');
  }
}

/**
 * Set up event handlers for project cards
 */
function setupProjectCards() {
  const projectModal = document.getElementById('project-modal');
  if (!projectModal) return;

  // EVENT DELEGATION: Attach to document to handle dynamically rendered cards
  document.addEventListener('click', (e) => {
    const card = e.target.closest('.project-card');
    if (!card) return;

    const projectId = card.id;
    const project = getProjectData()[projectId] || {
      title: card.querySelector('.project-header')?.textContent || 'Project',
      description: `<p>${card.querySelector('.project-description')?.textContent || ''}</p>`,
      images: null,
      video: null
    };
    
    openProjectModal(project);
  });
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
    });
  }
}

/**
 * Set up event handlers for art items
 */
function setupArtItems() {
  // First make sure any existing expanded items are collapsed
  collapseAllArtItems();
  
  document.querySelectorAll('.art-item').forEach(item => {
    // Store original dimensions for restoration
    if (!item.dataset.originalWidth) {
      item.dataset.originalWidth = item.offsetWidth + 'px';
      item.dataset.originalHeight = item.offsetHeight + 'px';
    }
    
    // Store original content for restoration
    if (!item.dataset.originalContent) {
      item.dataset.originalContent = item.innerHTML;
    }
    
    // Add click handler
    item.addEventListener('click', function(e) {
      // Check if we're clicking on an already expanded item
      if (this.classList.contains('expanded')) {
        // If clicking on the header, collapse the item
        if (e.target.closest('.expanded-art-header')) {
          collapseArtItem(this);
          return;
        }
        
        // If clicking on an image in the expanded view, handle lightbox
        if (e.target.closest('.expanded-image-container')) {
          const container = e.target.closest('.expanded-image-container');
          const artId = this.id;
          const art = getArtData()[artId];
          if (!art) return;
          const processedImages = normalizeImageData(art.images);
          const imageIndex = parseInt(container.dataset.index);
          openLightbox(processedImages, imageIndex);
        }
        return;
      }
      
      // First, collapse any already expanded items
      collapseAllArtItems();
      
      // Now expand this item
      expandArtItem(this);
    });
  });
}

/**
 * Set up expansion handlers for images within blog/blog content
 */
function setupBlogImages() {
  const blogPosts = document.querySelectorAll('.blog-content');
  if (blogPosts.length === 0) return;

  blogPosts.forEach(post => {
    // Find all images within this specific post
    const imgElements = Array.from(post.querySelectorAll('img'));
    const imageData = imgElements.map(img => ({
      src: img.src,
      caption: img.alt || img.title || ''
    }));

    // Add click listeners to each image to open in a gallery for this post
    imgElements.forEach((img, index) => {
      img.addEventListener('click', () => {
        openLightbox(imageData, index);
      });
    });
  });
}

/**
 * Expand an art item with detailed content
 */
function expandArtItem(item) {
  const artId = item.id;
  const art = getArtData()[artId] || {
    title: item.querySelector('.art-title')?.textContent || 'Artwork',
    description: `<p>Detailed information about this artwork is coming soon.</p>`,
    images: [{
      src: item.querySelector('img')?.src || '',
      caption: item.querySelector('.art-title')?.textContent || ''
    }],
    video: null
  };
  
  const processedImages = normalizeImageData(art.images);
  
  // Build expanded content
  let expandedContent = `
    <div class="expanded-art-container">
      <div class="expanded-art-header">
        <h3>${art.title}</h3>
        <button class="collapse-button" aria-label="Collapse">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="18 15 12 9 6 15"></polyline>
          </svg>
        </button>
      </div>
      <div class="expanded-art-description">
        ${art.description}
      </div>
      <div class="expanded-art-gallery">`;
  
  // Add images
  processedImages.forEach((image, index) => {
    expandedContent += `
      <div class="expanded-image-container" data-index="${index}">
        <img src="${image.src}" alt="${art.title}" class="expanded-image" referrerpolicy="no-referrer" onerror="this.src='/api/placeholder/640/360'; this.onerror=null;">
        ${image.caption ? `<div class="expanded-image-caption">${image.caption}</div>` : ''}
      </div>`;
  });

  expandedContent += `</div>`;
  
  // Add video if available
  if (art.video) {
    const embedUrl = getYouTubeEmbedUrl(art.video);
    expandedContent += `<div class="expanded-art-videos">`;
    
    if (Array.isArray(embedUrl)) {
      // Multiple videos
      embedUrl.forEach(url => {
        expandedContent += `
          <div class="expanded-video-container">
            <iframe class="expanded-video" src="${url}" frameborder="0" allowfullscreen></iframe>
          </div>`;
      });
    } else if (embedUrl) {
      // Single video
      expandedContent += `
        <div class="expanded-video-container">
          <iframe class="expanded-video" src="${embedUrl}" frameborder="0" allowfullscreen></iframe>
        </div>`;
    }
    
    expandedContent += `</div>`;
  }
  
  expandedContent += `</div>`;
  
  // Update content and add expanded class
  item.innerHTML = expandedContent;
  
  // Need to set some explicit styles to ensure expansion works correctly
  item.style.position = 'relative';
  item.style.gridColumn = '1 / -1';
  item.style.width = '100%';
  item.style.height = 'auto';
  item.style.aspectRatio = 'auto';
  
  // Add expanded class last to trigger animations
  item.classList.add('expanded');

  // Scroll to the top of the art item
  setTimeout(() => {
    item.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 150);
}

/**
 * Collapse all expanded art items
 */
function collapseAllArtItems() {
  document.querySelectorAll('.art-item.expanded').forEach(item => {
    collapseArtItem(item);
  });
}

/**
 * Collapse an expanded art item back to its original state
 */
function collapseArtItem(item) {
  // Restore original content
  if (item.dataset.originalContent) {
    item.innerHTML = item.dataset.originalContent;
  }
  
  // Remove inline styles
  item.style.position = '';
  item.style.gridColumn = '';
  item.style.width = '';
  item.style.height = '';
  item.style.aspectRatio = '';
  
  // Remove expanded class
  item.classList.remove('expanded');
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

  toggle.onclick = () => chatWindow.classList.toggle('active');
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
      // Update this URL to your actual worker URL after running 'wrangler deploy'
      const response = await fetch('https://portfolio-chat.mkato.workers.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: text,
          timestamp: new Date().toISOString() 
        })
      });

      if (response.status === 404) {
        throw new Error("Chat endpoint not found. Ensure your serverless proxy is deployed.");
      }

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();
      document.getElementById(typingId)?.remove();
      const botReply = data.reply || "I'm not sure about that. Try asking about his work at Meta or Apple!";
      const botHtml = typeof marked !== 'undefined' ? marked.parse(botReply) : botReply;
      messages.innerHTML += `<div class="message bot-message">${botHtml}</div>`;
    } catch (error) {
      console.error("Career Assistant Error:", error);
      document.getElementById(typingId)?.remove();
      messages.innerHTML += `<div class="message bot-message">I'm having trouble connecting to my brain. Please try again later!</div>`;
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
  const posts = document.querySelectorAll('.blog-content');
  if (posts.length === 0) return;

  // Inject basic styles for the comment section
  if (!document.getElementById('comments-style')) {
    const style = document.createElement('style');
    style.id = 'comments-style';
    style.textContent = `
      .comments-section { margin-top: 4rem; border-top: 1px solid var(--dark-burnt-orange); padding-top: 2rem; max-width: 800px; }
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

  posts.forEach(async (post) => {
    const slug = post.id || post.parentElement?.id || window.location.pathname.split('/').filter(Boolean).pop();
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
    post.appendChild(commentWrapper);

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
        const response = await fetch('https://portfolio-comments.mkato.workers.dev/comments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug, author, text })
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
      }
    });
  });

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      const clickedControls = e.target.closest('.lightbox-image, .lightbox-nav, .lightbox-close');
      if (!clickedControls) {
        lightbox.classList.remove('active');
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
        if (projectModal) projectModal.classList.remove('active');
        if (artModal) artModal.classList.remove('active');
        if (lightbox) lightbox.classList.remove('active');
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
  
  // Close lightbox when clicking X
  if (closeButton) {
    closeButton.onclick = () => {
      lightbox.classList.remove('active');
    };
  }
  
  // Show lightbox with current image
  updateLightbox();
  lightbox.classList.add('active');
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
