
// Project data with detailed information
const projectData = {
    "project-perf-framework": {
      title: "Performance Automation",
      description: `
  <div class="project-section">
    <p>I collaborated with lead engineers to develop a comprehensive performance monitoring solution for Horizon Worlds' rapid weekly release schedule. What began as my solo effort evolved into a dedicated performance team initiative.</p>
    
    <p>The framework enabled us to:</p>
    <ul class="project-list">
      <li>Track dozens of high and low-level code subsystems like physics, script, and rendering</li>
      <li>Run automated benchmarks on a scheduled cadence and to test new code submissions</li>
      <li>Detect issues within hours of code changes and provide profiler artifacts as a downloadable file</li>
      <li>Proactively address performance problems before weekly releases went live</li>
    </ul>
  </div>
      `,
      images: null,
      video: null
    },
    
  "project-perf-dashboards": {
    title: "Performance Visualization Dashboards",
    description: `
  <div class="project-section">
    <p>Horizon Worlds generated massive performance data from multiple sources—instrumentation, automation, playtests, and production. To make this information accessible to all team members, I developed interactive dashboards that transformed our performance workflow.</p>
    
    <p>These visualization tools:</p>
    <ul class="project-list">
      <li>Enabled users to drill down in many performance dimensions including world, player count, device type, time of day, etc.</li>
      <li>Automatically detected regressions and emailed alerts to relevant stakeholders</li>
      <li>Enabled data-driven prioritization of optimizations and helped teams demonstrate impact of performance work</li>
      <li>Helped non-technical stakeholders understand and share performance trends</li>
    </ul>
  </div>
    `,
    images: [
      "resources/hitch_dashboard.PNG",
      "resources/fps_dashboard.PNG"
    ],
    video: null
  },
  
  "project-asset-qa": {
    title: "Asset Validation QA Tools",
    description: `
  <div class="project-section">
    <p>At Apple, we processed thousands of 3D models from internal teams and external vendors. Quality issues frequently caused pipeline failures, wasting resources during training data generation. I developed validation tools that transformed our asset pipeline.</p>
    
    <p>These QA tools:</p>
    <ul class="project-list">
      <li>Checked for a host of common asset importation errors such as abnormal size, missing textures, improper material settings, etc.</li>
      <li>Generated thumbnail images automatically for use the asset browser</li>
      <li>Standardized quality and saved artists time</li>
    </ul>
  </div>
    `,
    images: null,
    video: null
  },
  
  "project-proc-scene": {
    title: "Procedural Scene Generation",
    description: `
  <div class="project-section">
    <p>Apple Vision Pro required massive amounts of diverse visual scenes to train it's visual recognition capability. I architected a procedural generation system that created semi-randomized sets of interior layouts to help generate new data overnight without the need for additional artists.</p>
    
    <p>The system:</p>
    <ul class="project-list">
      <li>Proceedurally modified the floorplan of existing interior scenes and dynamically extruded new walls, then deleted assets clipping through the space, and saved incremental files for offline rendering</li>
    </ul>
  </div>
    `,
    images: null,
    video: null
  },
  
  "project-lod-pipeline": {
    title: "LOD Generation Pipeline",
    description: `
  <div class="project-section">
    <p>For Call of Duty: WWII, creating multiple LODs for thousands of assets consumed significant artist resources with inconsistent results. I integrated and customized a proprietary LOD generation system that saved hundreds, possibly thousands of hours of artist time.</p>
    
    <p>This automated system:</p>
    <ul class="project-list">
      <li>Reduced LOD creation time from hours to minutes per asset, so much so that I was able to effectively add LODs to nearly the entire game</li>
      <li>Enabled more consistent and aggressive LODs compared to what artists typically author manually</li>
      <li>Maintained consistent visual quality across LOD transitions, often better than manually authored</li>
      <li>Helped achieve 60fps across all game modes and console platforms</li>
    </ul>
  </div>
    `,
    images: null,
    video: null
  },
  
  "project-edge-cleanup": {
    title: "Edge Cleanup Tool",
    description: `
  <div class="project-section">
    <p>During modeling, artists often create additional edges for construction that don't contribute to the final appearance but increase polygon counts, and in our engine there was an issue where tangents would be explicitly imported in a broken state due to data moving between programs, which caused vertex counts to massively inflate. I developed a Maya Python tool that analyzes mesh topology to identify redundant edges.</p>
    
    <p>This optimization tool:</p>
    <ul class="project-list">
      <li>Automatically smoothed normals which resulted in lower verted counts in engine, while our engineers figured out a more permanent solution</li>
      <li>Uses adjustable thresholds to determine which edges to remove</li>
      <li>Maintains UV mapping and material boundaries during optimization</li>
      <li>Became a standard part of our asset export process</li>
    </ul>
  </div>
    `,
    images: [
      "https://lh5.googleusercontent.com/1Q15n_Eyxk7RXPCthwuFvqyC_ft8RIm3ck0GY4xiK1JibG90slSW-vA8LJOwcp75kZ17NjMkCX9MFC6Pqgb1VbnJxP7bsbj6djgqvwdn9H3jHrYDnQPD2KUrP55MYmSOeMB37CHH",
      "https://lh3.googleusercontent.com/pKYtVNI01Qr9OcI4gQvu0w_j_8lqGlx6iVZIW3JHJdVTIDT9OtAZbM8iaFV4sun43ve0_4CAaZ-9muuxgQkyyeSzGkhRVI78GPVcLW08G-khNAhlZrzA9qOlvcTwqiJHIj591a14"
    ],
    video: null
  }
  };
  
  
  // Art data with detailed information
  const artData = {
    "art-escape-game": {
      title: "Escape From Nuckinfutts Factory",
      description: `
        <p>Assets created for my Unity game "Escape from Nuckinfutts Factory". I created this as a solo project, so I modelled, textured, rigged, animated, scripted, did the VFX and lighting for everything in this project. It was quite the undertaking and parts of it remained unfinished, but I'm still proud of what I was able to achieve alone while learning Unity for the first time.</p>
      `,
      images: [
        {
          src: "http://i.imgur.com/UGUc4yz.jpg",
          caption: "Factory room overview, hero shot."
        },
        {
          src: "https://i.imgur.com/3lby5.jpg",
          caption: "Closeup of the crane, which was rigged and animated, part of the final boss fight"
        },
        {
          src: "http://i.imgur.com/6nSUBCj.jpg",
          caption: "Level 01, this a recycling facility where the player, a robot, is discarded into."
        },
        {
          src: "http://i.imgur.com/jMMIZtA.png",
          caption: "Nuckinfutts at his workbench, assembling who knows what."
        },
        {
          src: "https://i.imgur.com/UlNQaO3.jpg",
          caption: "Boss fight room, showing the fire traps in the ground"
        },
        {
          src: "https://i.imgur.com/lOccZy0.jpg",
          caption: "Boss fight room, showing the crusher traps in the ceiling"
        },
        {
          src: "https://i.imgur.com/PmVOx.jpg",
          caption: "Corridors"
        },
        {
          src: "https://i.imgur.com/hGK34.jpg",
          caption: "Corridors to the boss fight room"
        },
        {
          src: "https://i.imgur.com/woft3Rd.png",
          caption: "Nuckinfutts rigged"
        }
      ],
      video: "https://www.youtube.com/watch?v=UBwfiO89y6c"
    },
    "art-mod-props": {
      title: "Half-Life 2 Mod Props",
      description: `
        <p>A collection of props created for the Half-Life 2 mod "No More Room in Hell," modeled in Softimage XSI. Was done in the Source engine and was my first time collaborating within a team.</p>
      `,
      images: [
        {
          src: "http://i.imgur.com/DYKhtLU.jpg",
          caption: "Collage of some of the props I made"
        },
        {
          src: "https://i.imgur.com/UOpEx.jpg",
          caption: "AO renders were my go to for showing off models back then"
        },
        {
          src: "https://i.imgur.com/vzDNH.png",
          caption: "Lexus IS 300"
        },
        {
          src: "https://i.imgur.com/fkiQQ.png",
          caption: "Crashed version"
        },
        {
          src: "https://i.imgur.com/9p3N6.jpg",
          caption: "Color variant in-engine"
        },
        {
          src: "https://i.imgur.com/bTzPY.png",
          caption: "Hydrant!"
        },
        {
          src: "https://i.imgur.com/4QiuN.jpg",
          caption: "Popcorn!"
        },
        {
          src: "https://i.imgur.com/f2njW.png",
          caption: "Smaller variant of the shelves"
        },
        {
          src: "https://i.imgur.com/bs6Bc.png",
          caption: "Let there be floodlight"
        },
        {
          src: "https://i.imgur.com/pcnr7.png",
          caption: "Basic hand truck, minimal texture detail"
        },
        {
          src: "https://i.imgur.com/1gRU6.png",
          caption: "Ceiling fan"
        }
      ],
      video: null
    },
    "art-school-work": {
      title: "Misc School Work",
      description: `
        <p>Various projects from my time at The Art Institute of Sunnyvale (closed). I wish I still had the source files for these, most of my best work from this time was lost due to hard drive failures and network wipes. Massive bummer.</p>
      `,
      images: [
        {
          src: "http://i.imgur.com/DClkapV.jpg",
          caption: "Kitchen render in Maya with mental ray"
        },
        {
          src: "http://i.imgur.com/nhb5Um2.jpg",
          caption: "Kitchen render alt"
        },
        {
          src: "https://i.imgur.com/R6wXnNE.png",
          caption: "Zbrush tactical glove"
        },
        {
          src: "https://i.imgur.com/n6MVQ2g.jpg",
          caption: "AK-74"
        },
        {
          src: "https://i.imgur.com/0mRUG.png",
          caption: "Soviet 2s7 Pion"
        },
        {
          src: "https://i.imgur.com/lWwi2.png",
          caption: "Soviet 2s7 Pion"
        },
        {
          src: "https://i.imgur.com/ZwzAT.png",
          caption: "WIP Notre Dame cathedral"
        },
        {
          src: "https://i.imgur.com/DaRyA.jpg",
          caption: "Laser cube from Portal 2"
        },
        {
          src: "https://i.imgur.com/bMGks.jpg",
          caption: "Test chamber from Portal 2. The finished version was lost."
        },
        {
          src: "https://i.imgur.com/0OXOc92.png",
          caption: "Lizard thing."
        },
        {
          src: "https://i.imgur.com/JmRB0.jpg",
          caption: "Character from Star Wars: Clone Wars. I modelled, texture, rigged, and animated this character but the files are lost :(("
        }
        
      ],
      video: "https://www.youtube.com/watch?v=2k-cztTwVzU"
    },
    "art-personal": {
      title: "Misc Personal Work",
      description: `
        <p>Creative explorations and fun projects I've worked on in my spare time.</p>
      `,
      images: [
        {
          src: "https://i.imgur.com/AKTrC.png",
          caption: "Recreation of a Caldari Caracal from EVE: Online. Probably my first high-poly model. I went way too far with the details."
        },
        {
          src: "https://i.imgur.com/NINiT.jpg",
          caption: "Inspired by Silent Hill 3"
        },
        {
          src: "https://i.imgur.com/zcL8d.png",
          caption: "Inspired by Silent Hill 3"
        },
        {
          src: "https://i.imgur.com/xSTlO.jpg",
          caption: "Half-Life 2 mapping competition entry"
        },
        {
          src: "https://i.imgur.com/gS3Ak.jpg",
          caption: "Half-Life 2 mapping competition entry (winner)"
        },
        {
          src: "https://i.imgur.com/7RAEA.png",
          caption: "Random vista building for someone's mod"
        }
      ],
      video: [
        "https://www.youtube.com/watch?v=Ks5aLLREdqA",
        "https://www.youtube.com/watch?v=9AEscHkULjU"
      ]
    },
    "art-speed-challenge": {
      title: "2-Hour Speed Challenges",
      description: `
        <p>Models created during timed challenges I used to run on a HL2 forum, typically completed within a strict 2-hour timeframe.</p>
      `,
      images: [
        {
          src: "https://i.imgur.com/tiUt0.png",
          caption: "Conker from the N64 game. This took me about 5 hours start to finish. The challenge prompt was 'Plush'"
        },
        {
          src: "https://i.imgur.com/fkg1b.png",
          caption: "Texture"
        },
        {
          src: "https://i.imgur.com/xkucH.jpg",
          caption: "Garage"
        },
        {
          src: "https://i.imgur.com/dHQ1c.png",
          caption: "Prompt was 'Intelligence'"
        },
        {
          src: "https://i.imgur.com/YJjhJ.png",
          caption: "Just some trash"
        },
        {
          src: "https://i.imgur.com/NJVA8.png",
          caption: "Giant person headphones"
        },
        {
          src: "https://i.imgur.com/UVkBb.png",
          caption: "2 hour modelling challenge"
        },
        {
          src: "https://i.imgur.com/bP6i3.jpg",
          caption: "First time using 3DS Max"
        },
        {
          src: "https://i.imgur.com/QcLAR.png",
          caption: ""
        }
      ],
      video: null
    }

    ,
    "art-shaders": {
      title: "Shaders",
      description: `
        <p>This is just an implementation of a shader by <a href=https://www.pouet.net/prod.php?which=57245]>Danilo Guanabara</a>, while I continue learning to fill this gallery with my own. Embedding it dyanmically in a website is pretty cool though!</p>
      `,
      images: null,
      video: null,
      shaders: [
        `<canvas id="canvas1" height=100% width=100% style="border:1px solid #000000;"></canvas>`]
    }

  };
  
  
  
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
    
    console.warn('Could not parse YouTube URL:', url);
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
          images: ["/api/placeholder/640/360"],
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
        modalContent += `
          <div class="modal-image-container" data-index="${index}">
            <img src="${image}" alt="${project.title}" class="modal-image" onerror="this.src='/api/placeholder/640/360'; this.onerror=null;">
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
    projectModal.querySelectorAll('.modal-image-container').forEach(container => {
      container.addEventListener('click', () => {
        const images = project.images.map(src => ({ src, caption: '' }));
        const imageIndex = parseInt(container.dataset.index);
        openLightbox(images, imageIndex);
      });
    });
    
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
  /**
   * Update the click handler for art items to make entire header clickable
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
    // redraw shaders (there can be only 1!)
    initShaders();
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
      video: null,
      shaders: null
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


    if (art.shaders) {
      art.shaders.forEach(shaderCanvas => {
        expandedContent += `${shaderCanvas}`;
      })
    };


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

    // redraw shaders (there can be only 1!)
    initShaders();
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

    // redraw shaders (there can be only 1!)
    initShaders();
  }
  
  /**
   * Set up global modal and lightbox handlers
   */
  function setupModalHandlers() {
    const projectModal = document.getElementById('project-modal');
    const lightbox = document.getElementById('lightbox-container');
    
    // Close modals when clicking outside content
    window.addEventListener('click', (e) => {
      if (e.target === projectModal) projectModal.style.display = 'none';
      if (e.target === lightbox) lightbox.style.display = 'none';
    });
    
    // Global keyboard navigation
    window.addEventListener('keydown', (e) => {
      // Only handle keys if a modal is visible
      if (projectModal.style.display === 'block' || lightbox.style.display === 'block') {
        if (e.key === 'Escape') {
          // Close all modals
          projectModal.style.display = 'none';
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
  
  
  
  
  // Function to collect all image URLs from art data or DOM
  function collectGalleryImages() {
    const imageUrls = [];
    
    // First try to get images from artData if available
    if (typeof artData !== 'undefined') {
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
    }
    
    // If no images found in artData or artData is undefined, get images from DOM
    if (imageUrls.length === 0) {
      document.querySelectorAll('.art-item img').forEach(img => {
        if (img.src && !img.src.includes('/api/placeholder/') && !img.src.includes('placeholder')) {
          imageUrls.push(img.src);
        }
      });
    }
    
    return imageUrls;
  }
  
  // Function to set a random background image
  function setRandomHeaderBackground() {
    const headerBackground = document.querySelector('.header-background');
    if (!headerBackground) return;
    
    // Get all gallery images
    const galleryImages = collectGalleryImages();
    
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
  
  // Function to initialize the dynamic background
  function initDynamicBackground() {
    // Set initial background
    setRandomHeaderBackground();
    
    // Change background every 10 seconds
    setInterval(setRandomHeaderBackground, 4000);
  }

  
  // Function to initialize tech section collapsible functionality
  function initTechSection() {
    // Find all tech categories
    const techCategories = document.querySelectorAll('.tech-category');
    
    // Add click handlers to toggle content visibility
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
  
// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  setupProjectCards();
  setupArtItems();
  setupModalHandlers();
  initDynamicBackground();
  initTechSection();
});
