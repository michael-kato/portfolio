# Site Memory

## Project shape

This is a Jekyll / GitHub Pages portfolio site hosted at `https://michaelkato.work` (`baseurl: ""`).

## Visual & Layout Architecture (Precision Dark Studio)

- **Design system:** Matte dark studio charcoal (`#0d0e11`), elevated cards (`#14161b`), hairline borders, warm industrial orange accent (`#e86a33`), `Space Grotesk` display + `IBM Plex Sans` reading + `IBM Plex Mono` metadata.
- **No background WebGL shader:** The third-party Star Nest shader was removed from site layouts for instant load times and visual focus.
- **Homepage (`index.html` → `_layouts/home.html` + `_includes/home-content.html`):**
  1. Hero with positioning, direct actions (Resume, GitHub, LinkedIn, copyable email), and 4 key metrics.
  2. **01 · Recent Projects & Tools (`#projects`)**: Chronological feed powered by the `_projects/` Jekyll collection, sorted newest-first with category filter pills (`All`, `Pipelines & Tools`, `Real-Time & Games`, `ML & Sim`), inline video previews, multi-clip tabs, and an on-demand modal launcher for the playable Unity 2D WebGL build (`/resources/match2/index.html`).
  3. **02 · Production Experience (`#experience`)**: Always-open studio blocks for Meta Reality Labs, Apple (Vision Pro synthetic data), and Sledgehammer Games (Call of Duty), featuring custom SVG pipeline diagrams, vector dashboard reconstructions, and an interactive before/after + step inspector for the Maya MeshOptimizer tool.
  4. **03 · Core Stack (`#skills`)**: 4-column technical spec sheet.
  5. **04 · Writing & Breakdowns (`#writing`)**: Latest posts from `_posts/`.
  6. **05 · Contact (`#contact`)**: Direct links and pointer to `/archive/`.

## Adding New Projects Chronologically

Drop a new Markdown file into `_projects/` named `YYYY-MM-slug.md` with front matter (`title`, `date`, `category`, `tags`, `repo`, `stack`, `summary`, plus optional `media_type`, `media`, `videos`, `playable`, `image_lightbox`, `writeup`). Jekyll automatically sorts the feed newest-first. See `_projects/README.md` for the template.

## Subpages

- `/blog/` (`blog.html` + `_layouts/blog_index.html` + `_layouts/post.html`): Technical writing feed with ToC, lightbox zoom on images, and Cloudflare D1 comments (`portfolio-comments.mkato.workers.dev`).
- `/archive/` (`archive.html` + `_layouts/page.html`): Pre-career 3D art, HL2 mod props, solo Unity game, college work, and animation reel (2009–2013), populated from `window.artData` in `site-content.js`.
- `/programming/` (`programming.html`): Clean URL variant hiding the Writing section and tuning hero copy for software/tools roles.

## Cloudflare Workers (Preserved)

- **Recruiter AI Career Assistant:** `https://portfolio-chat.mkato.workers.dev` (widget in `_layouts/home.html`, handled in `index.js`).
- **Blog Comments:** `https://portfolio-comments.mkato.workers.dev/comments`.
- **Cookieless Analytics:** `analytics.js` → `https://portfolio-analytics.mkato.workers.dev`.

## Local Preview

```sh
bundle exec jekyll build
bundle exec jekyll serve
```
