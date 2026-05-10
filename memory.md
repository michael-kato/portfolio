# Site Memory

## Project shape

This is a Jekyll/GitHub Pages portfolio site. The public base URL is configured in `_config.yml` as:

- `url: https://michael-kato.github.io`
- `baseurl: /portfolio`

That means clean generated pages publish under `/portfolio/...` on GitHub Pages. For example, the programming variant is `/portfolio/programming/`.

## Homepage structure

The homepage now uses a shared layout/content split:

- `index.html` is only front matter for the default homepage.
- `programming.html` is front matter for the programming-focused clean URL variant.
- `_layouts/home.html` contains the shared HTML shell, includes, scripts, and `data-variant` hook.
- `_includes/home-content.html` contains the shared homepage body: about, career, art, animations, notebooks preview, contact, modals, and lightbox.

This keeps alternate URLs from duplicating the full homepage markup.

## Navigation

For Jekyll-rendered pages, `_includes/site-nav.html` is the active nav include. On home-style pages it links directly to same-page anchors such as `#career`, `#art`, `#animations`, and `#contact`.

`components.js` is a legacy dynamic header/nav/footer loader used by older/static pages. It still contains older assumptions, so check whether a page uses Jekyll includes or `components.js` before changing navigation globally.

## Content/data split

Project and art modal content lives in `portfolio-data.js`:

- `projectData` powers project modal details.
- `artData` powers expanded art gallery details.

The cards and section structure live in `_includes/home-content.html`. The interactive behavior for those cards lives in `index.js`.

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
- hides `art`, `animations`, and `blog`
- updates the GitHub CTA copy
- adds `body.variant-programming` for CSS theme overrides

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
http://127.0.0.1:4000/portfolio/
```

Programming local URL:

```text
http://127.0.0.1:4000/portfolio/programming/
```
