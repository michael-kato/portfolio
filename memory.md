# Site Memory

## Project shape

This is a Jekyll/GitHub Pages portfolio site. The public base URL is configured in `_config.yml` as:

- `baseurl: ""`

That means generated pages now publish at the root. For example, the programming variant is `/programming/`.

## Homepage structure

The homepage now uses a shared layout/content split:

- `index.html` is only front matter for the default homepage.
- `programming.html` is front matter for the programming-focused clean URL variant.
- `_layouts/home.html` contains the shared HTML shell, includes, scripts, and `data-variant` hook.
- `_includes/home-content.html` contains the shared homepage body: about, career, art, blogs preview, contact, recruiter chat, modals, and lightbox.

This keeps alternate URLs from duplicating the full homepage markup.

## Recent updates

- A recruiter chat widget has been added. The UI is placed at the root of `_layouts/home.html` to bypass stacking context issues, ensuring it draws on top of all elements (z-index: 99999).
- `index.js` now includes `setupChatBot()` for chat open/close behavior and `setupBlogImages()` to make blog images zoomable with the existing lightbox.
- `/_layouts/post.html` now includes the blog post lightbox container so full-size image zoom works on post pages as well.
- `shaders.js` now has inline comments for both `protean-clouds` and `star-nest` shaders, exposing tunable parameters like tunnel exit size, glow intensity, sparkle brightness, and star size clamping.
- Cloudflare Worker files power the chat API: `chat.js` handles requests, while `wrangler.toml` manages deployment. The worker queries GPT-4o-mini via GitHub's Azure AI inference.
- **Chat UI Features**: Supports Markdown rendering via `marked.js`, inherits blog styling via the `blog-content` class, and features a pulsing notification animation on the toggle bubble.
- **Desktop GUI Logic**: The chat window is resizable from the **top-left corner**. This is implemented via a CSS trick: rotating the entire window 180 degrees to move the native resize handle, then rotating internal containers back to keep text upright.

## Navigation

For Jekyll-rendered pages, `_includes/site-nav.html` is the active nav include. On home-style pages it links directly to same-page anchors such as `#career`, `#art`, `#contact`

`components.js` is a legacy dynamic header/nav/footer loader used by older/static pages. It still contains older assumptions, so check whether a page uses Jekyll includes or `components.js` before changing navigation globally.

## Content/data split

Project and art modal content (used for dynamic injection) lives in `portfolio-data.js`:

- `projectData` powers project modal details.
- `artData` powers expanded art gallery details.

The cards and section structure live in `_includes/home-content.html`. The interactive behavior for those cards lives in `index.js`.

## Blog System (formerly blogs)

The site now uses a single-page blog feed at `/blog/` (source: `blog.html`).
- **Feed Structure:** All posts are rendered in full within a vertical feed.
- **Navigation:** A Table of Contents (ToC) at the top allows jumping to specific posts using anchor links (`#post-title-slug`).
- **Redirects:** The homepage "Read more" links now point directly to the post's anchor on the blog page rather than separate pages.

## Comment System

Anonymous comments are supported on blog posts using Cloudflare D1 and a dedicated Worker.
- **Storage:** Cloudflare D1 (SQL) with table `comments`.
- **Moderation:** Handled via Cloudflare D1 dashboard (SQL `is_approved` flag).
- **Backend:** `portfolio-comments.mkato.workers.dev` handles GET/POST.
- **Email:** Sends notifications upon new comment submissions via Resend API or Cloudflare Email Routing.
- **Frontend:** Injected dynamically into `.blog-content` containers via `setupComments()` in `index.js`.

## Variant system

Clean URL variants are implemented as real Jekyll pages plus JavaScript configuration:

1. Add a page like `programming.html`.
2. Set `layout: home`.
3. Set `variant: some-key`.
4. Set `permalink: /some-key/`.
5. Add a matching entry to `portfolioVariants` in `index.js`.

`_layouts/home.html` writes `data-variant="{{ page.variant }}"` onto the body when a variant exists. `index.js` reads that value first, then falls back to the final URL path segment.

The current `programming` variant:

- changes the page title in JavaScript
- changes the about copy
- renames `Career` to `Programming Work`
- hides `art` and `blog`
- updates the GitHub CTA copy
- adds `body.variant-programming` for CSS theme overrides

## Layout & Styling Notes

- **Color Hierarchy:**
  - `bright-wheat`: Used for site and blog post titles.
  - `light-wheat`: Used for section headers (About, Career, etc.), nav links, and tags.
  - `accent-color` (Orange): Used for career category headers and project titles.
  - `wheat`: Used for standard body and descriptive text.
  - `dark-burnt-orange`: Used for accent lines, arrows, logos, and UI-specific links (Read more).
- **Lists:** Bullets in cards and modals are explicitly indented.
- **Overlays:** Header background overlays and canvas opacities are tuned to ensure the shader remains visible; modal backdrops use higher opacity (0.92) for better legibility.
- **Scrolling:** `scroll-behavior: smooth` is enabled globally. Career categories and Art items use `scrollIntoView` when expanded to align with the top of the viewport, using `scroll-margin-top` (80px) to account for the sticky navigation bar.

Variant styling lives in `style.css` as body-level CSS custom property overrides.

## Local preview

Build:

```sh
bundle exec jekyll build
```

Serve:

```sh
bundle exec jekyll serve
```

Default local URL:

```text
http://127.0.0.1:4000/
```

Programming local URL:

```text
http://127.0.0.1:4000/programming/
```

## Cloudflare Worker Deployment

The chat API is powered by a Cloudflare Worker that handles POST requests to `/api/chat`.

### Files

- `chat.js`: Main worker script using the standard Cloudflare Workers API
- `wrangler.toml`: Wrangler configuration for deployment
- `functions/api/chat.js`: Alternative implementation for Cloudflare Pages Functions

### Environment Variables

Set these in your Cloudflare dashboard or via Wrangler:
- `GITHUB_TOKEN`: GitHub token for Azure AI inference API access

### Data Storage (KV)

Due to size limits (5KB) on environment variables, the career history is stored in Cloudflare KV:
- **Namespace Binding**: `PORTFOLIO_KV`
- **Key**: `CAREER_OVERVIEW`

### Deployment

Install Wrangler CLI:

```sh
npm install -g wrangler
```

Login and deploy:

```sh
wrangler auth login
wrangler deploy
```

The worker will be available at the configured route (e.g., `https://portfolio-chat.mkato.workers.dev`).
