/**
 * Main JavaScript for Michael Kato's portfolio
 * Handles the copy-to-clipboard buttons and the recruiter chat; the timeline is profiler.js.
 */

document.addEventListener('DOMContentLoaded', () => {
  applyPortfolioVariant();

  setupCopyButtons();
  setupChatBot();
});

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
    const aboutText = document.querySelector('.hero__lede');
    if (aboutText) aboutText.textContent = variant.about;
  }

  if (variant.labels) {
    Object.entries(variant.labels).forEach(([sectionId, label]) => {
      const sectionHeading = document.querySelector(`#${sectionId} .section-header h2`);
      if (sectionHeading) sectionHeading.textContent = label;

      // Section labels read "01 Career"; keep the number, swap the name
      const tapeLabel = document.querySelector(`#${sectionId} .tape-label`);
      if (tapeLabel) tapeLabel.textContent = tapeLabel.textContent.replace(/^(\d+\s+).*/, `$1${label}`);

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
 * Buttons with data-copy put that text on the clipboard and confirm briefly
 */
function setupCopyButtons() {
  document.querySelectorAll('[data-copy]').forEach(button => {
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

