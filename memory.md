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
- `_includes/home-content.html` contains the homepage body: the profiler (`_includes/profiler.html`).

This keeps alternate URLs from duplicating the full homepage markup.

## Recent updates

- **Custom Domain**: Site is now hosted at `michaelkato.work` with forced HTTPS.
- **Vertical Card Architecture (Career & Art)**: Replaced pop-up modals and interactive thumbnails with static, always-expanded vertical inline cards for both Career projects and Art entries.
- **Data Cleanup**: Pruned obsolete `summary` and `tags` fields from `site-content.js` to simplify data structures.
- **Career Section Accordion**: Multiple categories can remain open simultaneously. Headers feature Apple-style specular inner glow gradients in dark slate grey.
- **Deep Learning Section**: A dedicated landing page at `/deep_learning/` showcases AI research and hosts a live Hugging Face Spaces inference iframe.
- **Recruiter Chat**: The chat bubble is live. The Cloudflare Worker at `portfolio-chat.mkato.workers.dev` runs on Cloudflare Workers AI.
- `index.js` now includes `setupChatBot()` for chat open/close behavior and `setupBlogImages()` to make blog images zoomable with the existing lightbox.
- `/_layouts/post.html` now includes the blog post lightbox container so full-size image zoom works on post pages as well.
- The background uses the `star-nest` shader only (protean-clouds was removed). `resources/star-nest.frag` has inline comments exposing tunable parameters like sparkle brightness and star size clamping.
- **Chat UI Features**: Supports Markdown rendering via `marked.js`, inherits blog styling via the `blog-content` class, and previously featured a pulsing notification animation on the toggle bubble.
- **Desktop GUI Logic**: The chat window is resizable from the **top-left corner**. This is implemented via a CSS trick: rotating the entire window 180 degrees to move the native resize handle, then rotating internal containers back to keep text upright.
- **Stable Comments**: Comments are now linked via `post_id` in front matter rather than the URL slug, preventing comment loss if a post is renamed or moved.

## Navigation

For Jekyll-rendered pages other than the homepage (which has no nav bar), `_includes/site-nav.html` is the active nav include; it links to the homepage's `#timeline`.

`components.js` is a legacy dynamic header/nav/footer loader used by older/static pages. It still contains older assumptions, so check whether a page uses Jekyll includes or `components.js` before changing navigation globally.

## Content/data split

Project and art content lives in `site-content.js`:

- `window.projectData` and `window.artData` hold the project and art write-ups and images the profiler shows, by id.

Which projects and art sets appear, and when, is `_data/timeline.yml`. `index.js` now only handles the copy buttons and the recruiter chat.

## Career profiler (the homepage)

The homepage is the hero (with the contact links: resume, email, GitHub, LinkedIn) and the profiler (no nav bar, no Contact section); the career, blog and art sections are gone and live in the profiler. Markup is `_includes/profiler.html` (section `#timeline`), code `profiler.js`, styles the Profiler block in `style.css`.
- **Data:** `_data/timeline.yml` (career jobs with dates, nested `zones` and `events`; art sets; education), posts from `_posts` (both embedded as JSON in `#profiler-data`), write-ups and images from `site-content.js` by id.
- **Tracks:** Experience (jobs and art sets, each job's zones nested under it and overlapping ones stacked; everything after Meta sits under a "Career Break" job), Education, and Events (job releases, promotions and the kids' births, plus blog posts).
- **Interaction:** pinch or ctrl+scroll zooms (plain scroll scrolls the page; near the right edge it zooms about the edge, keeping the newest zones in view), drag pans, −/+/Fit buttons, double-click zooms to a zone, F frames the selection (or everything). Once in view it plays a short intro (load bar, UI, zones sweeping in; `data-intro` steps), then shows a controls card over the timeline until the first click. Clicking opens a details window (a modal `<dialog>` in the clicked zone's or marker's color, growing out of it): write-up, video, bound resources, a "media to come" slot for `media: pending`, and for a `link` to a GitHub repo its README (fetched live from raw.githubusercontent.com, rendered with marked). Posts show in full with comments. The address becomes `/#slug`, and loading one scrolls to and opens it (still zoomed out; following a `#slug` link in the page frames it).
- **Resources:** every image is a texture grouped by its zone ("draw call"); thumbnails open a texture viewer `<dialog>` over the current view (zoom, RGB/R/G/B/luma, previous/next); from the Resources tab it offers "Show in timeline". The art "fake depth" idea belongs in that viewer later.

## Blog System

Posts are Jekyll posts in `_posts/` (`YYYY-MM-DD-title.md`) and appear only on the profiler's Events track. `/blog/`, each post's own page (`/blog/:title/`, via `_layouts/post.html`) and `/profiler/` redirect to the homepage, keeping or adding the `#slug`.

## Comment System

Anonymous comments are supported on blog posts using Cloudflare D1 and a dedicated Worker.
- **Storage:** Cloudflare D1 (SQL) with table `comments`.
- **Moderation:** Handled via Cloudflare D1 dashboard (SQL `is_approved` flag).
- **Backend:** `portfolio-comments.mkato.workers.dev` handles API requests.
- **Email:** Sends notifications upon new comment submissions via Resend API or Cloudflare Email Routing.
- **Frontend:** `attachComments()` in `profiler.js` adds the comment list and form under a post in the details window, keyed by `post_id` (or the slugified title).
- **Stability**: Uses `data-post-id` attribute; lookups prioritize `post_id` from front matter, falling back to slug.

## Analytics System

The site uses a custom cookieless analytics system to track visitor metrics while respecting GDPR and ePrivacy directives.
- **Storage:** Cloudflare D1 (SQL) with table `analytics_events`.
- **Backend:** `portfolio-analytics.mkato.workers.dev` handles `/api/analytics` POST requests.
- **Frontend:** Collects `maxScrollDepth`, `loadTimeMs`, `ttfbMs`, and `clickCount` via `analytics.js` without setting cookies or `sessionStorage`.
- **Privacy:** IP addresses are NOT stored. Instead, the backend captures `request.cf.asOrganization` to log B2B corporate network traffic, and generates an ephemeral daily device fingerprint hash for session linking.
- **Email:** Sends real-time notifications with tabular session data upon each visit via the Resend API.

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

- **Theme:** space, but lived-in. The Star Nest shader is a fixed full-page canvas, so stars show the whole way down; one flat translucent `--veil` (`body::before`, fixed, between the shader and the page) dims them for legibility, and a fixed grain overlay (`body::after`) adds grit.
- **Tokens:** all colors live on `:root` in `style.css` as OKLCH. `--space` (page), `--surface` / `--surface-2` (panels), `--text` / `--text-strong` / `--text-muted`, `--line` / `--line-strong`, `--accent` (international orange: buttons, links, open state), `--gold` (patch thread), `--go` (green status).
- **Type:** Jost for display (`--font-display`), IBM Plex Sans for reading, IBM Plex Mono for small uppercase labels (`.mono`). Loaded from Google Fonts in `_includes/page_head.html`.
- **Theme details, used sparingly on purpose:** `.tape-label` (label-maker tape) on section names; the profiler's GPU-tool wording (zones, draw calls, textures).
- **Videos:** embeds are centered and capped at `--video-width` (40rem).
- **Shader:** `#background-canvas` is fixed behind the page (in each layout). `.low-power` (no GPU) drops blur and the grain overlay.
- **Scrolling:** `scroll-behavior: smooth` is set on `html` only under `prefers-reduced-motion: no-preference`. Anchor targets clear the sticky nav via `html { scroll-padding-top: var(--nav-offset) }`.

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

The chat API is powered by a Cloudflare Worker that handles POST requests. GitHub Models inference was retired on July 30, 2026, so the Worker now uses Cloudflare Workers AI through the `AI` binding in `wrangler.toml`. It tries `@cf/meta/llama-3.3-70b-instruct-fp8-fast` first, then falls back to `@cf/meta/llama-4-scout-17b-16e-instruct`. No model API keys are needed.

### Files

- `chat.js`: Main worker script using the standard Cloudflare Workers API
- `wrangler.toml`: Wrangler configuration for deployment
- `functions/api/chat.js`: Alternative implementation for Cloudflare Pages Functions

### Environment Variables

- `EMAIL_API_KEY` (secret, optional): Resend key for usage notification emails.
- `NOTIFICATION_EMAIL` (var): Recipient for notifications.

### Data Storage (KV)

Due to size limits (5KB) on environment variables, the career history is stored in Cloudflare KV:
- **Namespace Binding**: `PORTFOLIO_KV`
- **Key**: `CAREER_OVERVIEW`

### Deployment

Install Wrangler CLI if needed:

```sh
npm install -g wrangler
```

Login and deploy:

```sh
wrangler auth login
wrangler deploy --config wrangler.toml
```

The worker will be available at the configured route (e.g., `https://portfolio-chat.mkato.workers.dev`).
