/**
 * Main JavaScript for Michael Kato's portfolio
 * Handles all interactive features including:
 * - Tech section tabs
 * - Art gallery expansions
 * - Project modals
 * - Lightbox for images
 * - Dynamic header backgrounds
 */

document.addEventListener('DOMContentLoaded', () => {
  initTechSection();
  setupProjectCards();
  setupArtItems();
  setupModalHandlers();
  initDynamicBackground();
});

/**
 * Initialize tech section collapsible functionality
 */
function initTechSection() {
  const techCategories = document.querySelectorAll('.tech-category');
  
  techCategories.forEach((category, index) => {
    const header = category.querySelector('.tech-category-header');
    
    header.addEventListener('click', () => {
      // Toggle active class
      category.classList.toggle('active');
      
      // If opening this category, close others (accordion style)
      if (category.classList.contains('active')) {
        techCategories.forEach((otherCategory, otherIndex) => {
          if (index !== otherIndex) {
            otherCategory.classList.remove('active');
          }
        });
      }
    });
  });
  
  // Open the first category by default
  if (techCategories.length > 0) {
    techCategories[0].classList.add('active');
  }
}

/**
 * Set up event handlers for project cards
 */
function setupProjectCards() {
  const projectModal = document.getElementById('project-modal');
  
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
      const projectId = card.id;
      const project = projectData[projectId] || {
        title: card.querySelector('.project-header').textContent,
        description: `<p>${card.querySelector('.project-description').textContent}</p>
                     <h4>Detailed information coming soon</h4>
                     <p>This project is currently being documented with full implementation details and impact metrics.</p>`,
        images: null,
        video: null
      };
      
      openProjectModal(project);
    });
  });
}

/**
 * Open project modal with specified project data
 */
function openProjectModal(project) {
  const projectModal = document.getElementById('project-modal');
  
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
          <img src="${imageUrl}" alt="${project.title}" class="modal-image" onerror="this.src='/api/placeholder/640/360'; this.onerror=null;">
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
  projectModal.style.display = 'block';
  
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
      projectModal.style.display = 'none';
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
          const art = artData[artId];
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
 * Expand an art item with detailed content
 */
function expandArtItem(item) {
  const artId = item.id;
  const art = artData[artId] || {
    title: item.querySelector('.art-title').textContent,
    description: `<p>Detailed information about this artwork is coming soon.</p>`,
    images: [{
      src: item.querySelector('img').src,
      caption: item.querySelector('.art-title').textContent
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
        <img src="${image.src}" alt="${art.title}" class="expanded-image" onerror="this.src='/api/placeholder/640/360'; this.onerror=null;">
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
  
  // Scroll to make sure expanded item is visible
  setTimeout(() => {
    item.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
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
 * Set up global modal and lightbox handlers
 */
function setupModalHandlers() {
  const projectModal = document.getElementById('project-modal');
  const artModal = document.getElementById('art-modal');
  const lightbox = document.getElementById('lightbox-container');
  
  // Close modals when clicking outside content
  window.addEventListener('click', (e) => {
    if (e.target === projectModal) projectModal.style.display = 'none';
    if (e.target === artModal) artModal.style.display = 'none';
    if (e.target === lightbox) lightbox.style.display = 'none';
  });
  
  // Global keyboard navigation
  window.addEventListener('keydown', (e) => {
    // Only handle keys if a modal is visible
    if (projectModal.style.display === 'block' || artModal.style.display === 'block' || lightbox.style.display === 'block') {
      if (e.key === 'Escape') {
        // Close all modals
        projectModal.style.display = 'none';
        artModal.style.display = 'none';
        lightbox.style.display = 'none';
      } else if (e.key === 'ArrowLeft' && lightbox.style.display === 'block') {
        // Previous image in lightbox
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        if (prevBtn && !prevBtn.disabled) prevBtn.click();
      } else if (e.key === 'ArrowRight' && lightbox.style.display === 'block') {
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
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const lightboxCounter = lightbox.querySelector('.lightbox-counter');
  const prevButton = lightbox.querySelector('.lightbox-prev');
  const nextButton = lightbox.querySelector('.lightbox-next');
  const closeButton = lightbox.querySelector('.lightbox-close');
  
  let currentIndex = startIndex || 0;
  
  // Function to update lightbox content
  function updateLightbox() {
    // Set image with fallback
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
      lightbox.style.display = 'none';
    };
  }
  
  // Show lightbox with current image
  updateLightbox();
  lightbox.style.display = 'block';
}

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
  
  // Select a random image
  const randomIndex = Math.floor(Math.random() * galleryImages.length);
  const selectedImage = galleryImages[randomIndex];
  
  // Fade out current background
  headerBackground.style.opacity = 0;
  
  // After fade-out, set new background and fade in
  setTimeout(() => {
    headerBackground.style.backgroundImage = `url(${selectedImage})`;
    headerBackground.style.opacity = 0.15;
  }, 300);
}

/**
 * Collect all image URLs from art data
 */
function collectGalleryImages() {
  const imageUrls = [];
  
  Object.values(artData).forEach(artProject => {
    if (artProject.images && artProject.images.length > 0) {
      artProject.images.forEach(image => {
        const imageUrl = typeof image === 'string' ? image : image.src;
        if (imageUrl && !imageUrl.includes('/api/placeholder/') && !imageUrl.includes('placeholder')) {
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