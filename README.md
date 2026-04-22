# portfolio
My portfolio!
https://michael-kato.github.io/portfolio/

## Notebook workflow

The notebook/blog now uses Jekyll posts instead of hand-authored HTML pages.

Important: `notebook.html`, `_layouts/`, and `_includes/` are now Jekyll source files. If you open `notebook.html` directly in a browser or static preview, you will see raw front matter and Liquid tags. The page only renders correctly after a Jekyll build.

- Write new posts in `_posts/` using the filename format `YYYY-MM-DD-slug.md`
- Add front matter for `title`, `date`, `tags`, `subtitle`, and `excerpt`
- The notebook listing page at `notebook.html` builds itself from those posts
- Posts publish to `notebook/slug.html`
- GitHub Pages deploys through `.github/workflows/pages.yml`
- Local preview uses `bundle exec jekyll serve`

Example post:

```md
---
title: My New Post
date: 2026-04-21
tags:
  - Blender
  - Pipeline
subtitle: A short one-line summary for the post header.
excerpt: A short summary used on the notebook listing page.
---

Write in normal Markdown here.

## Headings work

- Lists work
- **Bold** and *italic* work

{% include post-video.html src="../resources/my-video.mp4" caption="Optional caption." %}
{% include post-image.html src="../resources/my-image.png" alt="Describe the image" caption="Optional caption." %}
```

## Local preview

1. Install Ruby and Bundler.
2. Run `bundle install`
3. Run `bundle exec jekyll serve`
4. Open `http://127.0.0.1:4000/portfolio/`

GitHub Pages now deploys the site through GitHub Actions, so the pushed site should render the Jekyll templates correctly once Pages is configured to use GitHub Actions.
