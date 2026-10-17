/**
 * The career as a GPU profiler capture (_includes/profiler.html): tracks of zones on a timeline you can zoom
 * and pan, a details window for whatever you click, and every image as a texture in a Resources tab.
 * Data: _data/timeline.yml and the posts (both in #profiler-data), and window.projectData / artData.
 */
'use strict';
(() => {
  const root = document.getElementById('timeline');
  if (!root) return;
  const { timeline: TIMELINE, posts: POSTS } = JSON.parse(document.getElementById('profiler-data').textContent);
  const COMMENTS_API = 'https://portfolio-comments.mkato.workers.dev/comments';

  // ===== Time =====
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const today = new Date();
  const NOW = today.getFullYear() + today.getMonth() / 12;
  const startOf = ym => { const [y, m] = ym.split('-').map(Number); return y + (m - 1) / 12; };
  const endOf = ym => ym ? startOf(ym) + 1 / 12 : END;
  const monthName = t => { const m = Math.floor(t * 12 + 1e-6); return `${MONTHS[((m % 12) + 12) % 12]} ${Math.floor(m / 12)}`; };
  const duration = (a, b) => {
    const months = Math.round((b - a) * 12), y = Math.floor(months / 12), m = months % 12;
    return [y && `${y}y`, m && `${m}mo`].filter(Boolean).join(' ') || '<1mo';
  };
  const period = z => z.to > NOW ? `${monthName(z.from)} – now` : `${monthName(z.from)} – ${monthName(z.to - 1 / 12)}`;
  const slugify = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const END = NOW + 1 / 12; // the end of this month, where ongoing zones end

  // ===== Zones, by track =====
  const tracks = [];
  const track = name => { const t = { name, zones: [] }; tracks.push(t); return t; };
  /** Where a zone and the zones nested in it sit: [row below it, from, to] */
  const footprint = z => [[0, z.shownFrom, z.to],
    ...(z.children ?? []).flatMap(c => footprint(c).map(([row, from, to]) => [row + c.depth + 1, from, to]))];
  /** Puts each zone, in order, in the highest lane where it and its nested zones fit (relative depth) */
  const stack = zones => {
    const taken = []; // [lane, from, to] of everything placed
    for (const z of zones) {
      const cells = footprint(z);
      let lane = 0;
      while (cells.some(([row, from, to]) => taken.some(([r, f, t]) => r === lane + row && f < to && from < t))) lane++;
      taken.push(...cells.map(([row, from, to]) => [lane + row, from, to]));
      z.depth = lane;
    }
    return zones;
  };

  // Experience: jobs and art sets. Jobs run one after another: a job is drawn from where the previous one
  // ends (details keep the real dates), with its zones nested below it.
  const experience = track('Experience');
  /** A zone's child zones: undated ones share the parent's time evenly, in order */
  const nest = (parent, specs) => specs.map((spec, i) => {
    spec = typeof spec === 'string' ? { id: spec } : spec;
    const data = window.projectData[spec.id] ?? spec;
    const step = (parent.to - parent.shownFrom) / specs.length;
    const from = spec.from ? startOf(spec.from) : parent.shownFrom + i * step;
    const zone = { kind: 'project', track: experience, id: spec.id, data, name: spec.name ?? data.title, from, shownFrom: from,
      to: spec.from ? endOf(spec.to) : parent.shownFrom + (i + 1) * step, approximate: !spec.from,
      hue: spec.hue ?? parent.hue, shade: i % 2, parent };
    zone.children = nest(zone, spec.zones ?? []);
    return zone;
  });
  /** Stacks a zone's children into lanes below it */
  const layout = z => {
    for (const c of z.children) layout(c);
    stack(z.children);
  };
  /** Turns children's lanes into depths under their parent */
  const place = z => { for (const c of z.children) { c.depth += z.depth + 1; place(c); } };
  const descendants = z => z.children.flatMap(c => [c, ...descendants(c)]);
  let shownUntil = -Infinity;
  const jobs = TIMELINE.career.map(s => {
    const from = startOf(s.from), to = endOf(s.to), shownFrom = Math.max(from, shownUntil);
    shownUntil = to;
    const job = { kind: 'studio', track: experience, slug: s.id, name: s.name, role: s.role, detail: s.detail,
      from, to, shownFrom, hue: s.hue, events: s.events ?? [] };
    job.children = nest(job, s.zones ?? []);
    layout(job);
    return job;
  });
  /** An art set, with any sets nested under it */
  const artSet = (a, parent) => {
    const from = startOf(a.from);
    const set = { kind: 'art', track: experience, id: a.id, data: window.artData[a.id], name: window.artData[a.id].title,
      from, to: endOf(a.to), shownFrom: from, hue: 320, shade: parent ? 1 - parent.shade : 0, parent };
    set.children = (a.zones ?? []).map(c => artSet(c, set));
    return set;
  };
  const sets = TIMELINE.art.map(a => artSet(a));
  sets.forEach(layout);
  stack([...jobs, ...sets]);
  for (const z of [...jobs, ...sets]) place(z);
  experience.zones = [...jobs, ...sets].flatMap(z => [z, ...descendants(z)]);
  const education = track('Education');
  education.zones = stack(TIMELINE.education.map(e => ({ kind: 'education', track: education, name: e.name, detail: e.detail,
    from: startOf(e.from), to: endOf(e.to), shownFrom: startOf(e.from), hue: 150 })));
  // Events: releases and promotions from the jobs, and blog posts
  const events = track('Events');
  events.zones = [
    ...jobs.flatMap(job => job.events.map(e => ({ kind: 'event', track: events, depth: 0, name: e.name, note: e.note,
      from: startOf(e.date) + 0.5 / 12, hue: job.hue, job }))),
    ...POSTS.map(p => {
      const [y, m, d] = p.date.split('-').map(Number);
      return { kind: 'post', track: events, depth: 0, name: p.title, post: p, from: y + (m - 1 + (d - 1) / 31) / 12, hue: 85 };
    }),
  ];

  const allZones = tracks.flatMap(t => t.zones);
  const isMarker = z => z.kind === 'post' || z.kind === 'event';
  for (const z of allZones) {
    z.slug ??= z.id ?? z.post?.slug ?? slugify(z.name);
    z.shownFrom ??= z.from;
  }
  const FULL = { from: 2008.5, to: END };
  const MIN_SPAN = 0.25; // years
  let view = { ...FULL };

  // ===== Textures: every image, grouped by the zone (draw call) that binds it =====
  const textureName = (caption, src) => 'T_' + ((caption || '').match(/[A-Za-z0-9]+/g)?.slice(0, 3)
    .map(w => w[0].toUpperCase() + w.slice(1)).join('') || src.split('/').pop().split('.')[0]);
  const textures = [];
  const bind = (z, images) => {
    z.textures = images.map(({ src, caption }) => {
      const texture = { src, caption, name: textureName(caption, src), zone: z, index: textures.length };
      textures.push(texture);
      return texture;
    });
  };
  for (const z of allZones) {
    if (z.kind === 'post') {
      const images = document.getElementById(`post-${z.post.slug}`).content.querySelectorAll('img');
      bind(z, [...images].map(img => ({ src: img.getAttribute('src'),
        caption: img.closest('figure')?.querySelector('figcaption')?.textContent.trim() || img.alt })));
    } else {
      bind(z, (z.data?.images ?? []).map(img => typeof img === 'string' ? { src: img, caption: '' } : img));
    }
  }

  // ===== Elements =====
  const $ = s => root.querySelector(s);
  const timeline = $('.prof-timeline'), ruler = $('.prof-ruler'), grid = $('.prof-grid'), tracksEl = $('.prof-tracks');
  const details = $('.prof-details'), detailsPath = $('.prof-details__path'), detailsBody = $('.prof-details__body');
  const tip = $('.prof-tip'), statusHover = $('.prof-status__hover'), statusView = $('.prof-status__view');
  const overview = $('.prof-overview'), overviewWindow = $('.prof-overview__window');
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[c]);

  for (const t of tracks) {
    const row = document.createElement('div');
    row.className = 'prof-track';
    const depth = Math.max(1, ...t.zones.map(z => z.depth + 1));
    row.innerHTML = `<div class="prof-track__name">${t.name}</div><div class="prof-track__lanes" style="height: calc(${depth} * var(--row) + 2px)"></div>`;
    for (const z of t.zones) {
      const el = document.createElement('button');
      el.type = 'button';
      z.el = el;
      el.zone = z;
      el.dataset.kind = z.kind;
      el.style.setProperty('--hue', z.hue);
      el.style.setProperty('--depth', z.depth);
      if (isMarker(z)) {
        el.className = 'marker';
        el.setAttribute('aria-label', `${z.name}, ${monthName(z.from)}`);
      } else {
        el.className = 'zone';
        if (z.shade) el.style.setProperty('--shade', z.shade);
        el.innerHTML = `<span>${esc(z.name)}</span><span class="zone__time">${duration(z.from, z.to)}</span>`;
        el.setAttribute('aria-label', `${z.name}, ${period(z)}, ${duration(z.from, z.to)}`);
      }
      row.lastChild.append(el);
    }
    tracksEl.append(row);
  }
  // Overview bars: the top level of each track
  const share = t => (t - FULL.from) / (FULL.to - FULL.from) * 100; // % across the overview
  tracks.forEach((t, i) => {
    for (const z of t.zones.filter(z => !z.parent && !isMarker(z))) {
      const bar = document.createElement('div');
      bar.className = 'prof-overview__bar';
      bar.style.cssText = `--hue: ${z.hue}; top: ${4 + i * 5}px; left: ${share(z.shownFrom)}%; width: ${share(z.to) - share(z.shownFrom)}%`;
      overview.prepend(bar);
    }
  });

  // ===== Drawing: zones, ruler and overview follow the view =====
  const width = () => tracksEl.querySelector('.prof-track__lanes').clientWidth;
  function draw() {
    const w = width(), span = view.to - view.from;
    const x = t => (t - view.from) / span * w;
    for (const z of allZones) {
      if (isMarker(z)) {
        z.el.style.translate = `${x(z.from)}px 0`;
        continue;
      }
      // 1px apart, so neighbours never read as overlapping
      const left = x(z.shownFrom) + 1, right = x(z.to) - 1, px = right - left;
      z.el.hidden = right < -20 || left > w + 20;
      z.el.style.translate = `${Math.max(left, -2)}px 0`;
      z.el.style.width = `${Math.max(2, Math.min(right, w + 2) - Math.max(left, -2))}px`;
      z.el.classList.toggle('is-narrow', px < 150);
      z.el.classList.toggle('is-tiny', px < 26);
    }
    // Ticks every year, or finer when zoomed in
    const step = [1 / 12, 1 / 4, 1 / 2, 1, 2, 5].find(s => s * w / span >= 72) ?? 5;
    const ticks = [];
    for (let t = Math.ceil(view.from / step - 1e-6) * step; t <= view.to; t += step) ticks.push([x(t), step >= 1 ? Math.round(t) : monthName(t)]);
    ruler.innerHTML = ticks.map(([px, label]) => `<div class="prof-tick" style="left: ${px}px">${label}</div>`).join('');
    grid.innerHTML = ticks.map(([px]) => `<div style="left: ${px}px"></div>`).join('');
    overviewWindow.style.left = `${(view.from - FULL.from) / (FULL.to - FULL.from) * 100}%`;
    overviewWindow.style.width = `${span / (FULL.to - FULL.from) * 100}%`;
    statusView.textContent = `${monthName(view.from)} – ${monthName(view.to)} · pinch or ctrl + scroll to zoom · drag to pan · click to inspect · F to frame`;
  }
  const setView = (from, to) => {
    const span = Math.min(Math.max(to - from, MIN_SPAN), FULL.to - FULL.from);
    from = Math.min(Math.max(from, FULL.from), FULL.to - span);
    view = { from, to: from + span };
    draw();
  };
  const zoomTo = z => {
    if (isMarker(z)) return setView(z.from - 1, z.from + 1);
    const from = z.shownFrom, to = z.to, pad = Math.max((to - from) * 0.08, 1 / 12);
    setView(from - pad, to + pad);
  };
  const zoomBy = (factor, at = (view.from + view.to) / 2) => {
    const share = (at - view.from) / (view.to - view.from), span = (view.to - view.from) * factor;
    setView(at - share * span, at - share * span + span);
  };

  // ===== Zoom and pan. In the page, plain scrolling scrolls the page: pinch or ctrl + scroll zooms, sideways pans =====
  timeline.addEventListener('wheel', e => {
    const lanesBox = tracksEl.querySelector('.prof-track__lanes').getBoundingClientRect();
    const px = e.clientX - lanesBox.left;
    if (px < 0) return;
    const unit = e.deltaMode === 1 ? 30 : 1, span = view.to - view.from;
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      // Toward the right edge, zoom more and more about the edge itself, so the newest zones stay in view
      const share = px / lanesBox.width, bias = Math.min(Math.max((share - 0.6) / 0.3, 0), 1);
      zoomBy(Math.exp(e.deltaY * unit * 0.0015), view.from + (share + (1 - share) * bias) * span);
    } else if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey) {
      e.preventDefault();
      const shift = (e.shiftKey ? e.deltaY : e.deltaX) * unit / lanesBox.width * span;
      setView(view.from + shift, view.to + shift);
    }
  }, { passive: false });
  root.querySelectorAll('[data-zoom]').forEach(b => b.addEventListener('click', () => {
    if (b.dataset.zoom === 'fit') setView(FULL.from, FULL.to);
    else zoomBy(b.dataset.zoom === 'in' ? 1 / 1.6 : 1.6);
  }));

  let drag = null, dragged = false;
  const startDrag = (e, perPx) => {
    if (e.button !== 0) return;
    drag = { x: e.clientX, from: view.from, to: view.to, perPx };
    dragged = false;
  };
  timeline.addEventListener('pointerdown', e => startDrag(e, -(view.to - view.from) / width()));
  overviewWindow.addEventListener('pointerdown', e => {
    e.stopPropagation();
    startDrag(e, (FULL.to - FULL.from) / overview.clientWidth);
    if (drag) drag.edge = e.target.dataset.edge; // its handles resize it (zoom); the rest moves it (pan)
  });
  overview.addEventListener('pointerdown', e => {
    const at = FULL.from + (e.clientX - overview.getBoundingClientRect().left) / overview.clientWidth * (FULL.to - FULL.from);
    const span = view.to - view.from;
    setView(at - span / 2, at + span / 2);
    startDrag(e, (FULL.to - FULL.from) / overview.clientWidth);
  });
  addEventListener('pointermove', e => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    if (Math.abs(dx) > 4) dragged = true;
    if (!dragged) return;
    const shift = dx * drag.perPx;
    if (drag.edge === 'from') setView(Math.max(Math.min(drag.from + shift, drag.to - MIN_SPAN), FULL.from), drag.to);
    else if (drag.edge === 'to') setView(drag.from, Math.min(Math.max(drag.to + shift, drag.from + MIN_SPAN), FULL.to));
    else setView(drag.from + shift, drag.to + shift);
  });
  addEventListener('pointerup', () => { drag = null; });

  // ===== Hover: tooltip and status line =====
  const when = z => isMarker(z) ? monthName(z.from) : `${period(z)} · ${duration(z.from, z.to)}`;
  timeline.addEventListener('pointerover', e => {
    const z = e.target.closest('.zone, .marker')?.zone;
    if (!z) { tip.hidden = true; return; }
    const sub = {
      studio: [z.role, z.detail].filter(Boolean).join(' · '),
      education: z.detail,
      project: `${z.parent?.name}${z.approximate ? ' · timing approximate' : ''}`,
      event: [z.job?.name, z.note].filter(Boolean).join(' · '),
    }[z.kind];
    tip.innerHTML = `<b>${esc(z.name)}</b><br>${when(z)}${sub ? `<br>${esc(sub)}` : ''}`;
    tip.hidden = false;
    statusHover.textContent = `${z.track.name} › ${z.name} · ${when(z)}`;
  });
  timeline.addEventListener('pointermove', e => {
    if (tip.hidden) return;
    // Right of the pointer, or left of it where it wouldn't fit
    const right = e.clientX + 14 + tip.offsetWidth <= innerWidth - 8;
    tip.style.left = `${Math.max(8, right ? e.clientX + 14 : e.clientX - 14 - tip.offsetWidth)}px`;
    tip.style.top = `${e.clientY + 16}px`;
  });
  timeline.addEventListener('pointerleave', () => { tip.hidden = true; });

  // ===== Comments on posts (moderated; approved ones are listed) =====
  async function attachComments(target, slug) {
    const section = document.createElement('div');
    section.className = 'comments-section';
    section.innerHTML = `
      <h3 class="comments-title">Comments</h3>
      <div class="comments-list">Loading comments...</div>
      <form class="comment-form">
        <input type="text" placeholder="Name (anonymous)" class="comment-name-input" maxlength="50">
        <textarea placeholder="Share your thoughts..." required class="comment-text-input" maxlength="2000"></textarea>
        <button type="submit" class="comment-submit-btn">Post Comment</button>
        <div class="comment-status"></div>
      </form>`;
    target.append(section);
    const list = section.querySelector('.comments-list'), form = section.querySelector('form');
    const status = form.querySelector('.comment-status'), submit = form.querySelector('.comment-submit-btn');
    form.addEventListener('submit', async e => {
      e.preventDefault();
      submit.disabled = true;
      status.textContent = 'Posting...';
      let timezone = 'unknown';
      try { timezone = Intl.DateTimeFormat().resolvedOptions().timeZone; } catch {}
      try {
        const response = await fetch(COMMENTS_API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            slug,
            author: form.querySelector('.comment-name-input').value.trim() || 'Anonymous',
            text: form.querySelector('.comment-text-input').value.trim(),
            userAgent: navigator.userAgent,
            language: navigator.language,
            timezone,
            screenRes: `${screen.width}x${screen.height}`,
            deviceMemory: navigator.deviceMemory || null,
            cores: navigator.hardwareConcurrency || null,
          }),
        });
        if (!response.ok) throw new Error();
        status.textContent = 'Comment submitted! It will appear once approved.';
        form.reset();
      } catch {
        status.textContent = 'Failed to post. Please try again later.';
      } finally {
        submit.disabled = false;
      }
    });
    try {
      const response = await fetch(`${COMMENTS_API}?slug=${encodeURIComponent(slug)}`);
      if (!response.ok) throw new Error();
      const comments = await response.json();
      list.innerHTML = comments.length ? comments.map(c => `
        <div class="comment-item">
          <div class="comment-meta"><span class="comment-author">${esc(c.author)}</span><span class="comment-date">${new Date(c.created_at).toLocaleDateString()}</span></div>
          <div class="comment-body">${esc(c.text)}</div>
        </div>`).join('') : '<p style="font-style: italic; opacity: 0.6;">No comments yet. Be the first!</p>';
    } catch {
      list.innerHTML = '<p>Error loading comments.</p>';
    }
  }

  // ===== GitHub READMEs, for zones that link to a repo =====
  const repoOf = link => link?.match(/^https:\/\/github\.com\/([^/]+)\/([^/#?]+)/)?.slice(1).join('/');
  const readmes = new Map(); // "owner/repo" -> promise of its README text, or null
  const readme = repo => {
    if (!readmes.has(repo)) readmes.set(repo, fetch(`https://raw.githubusercontent.com/${repo}/HEAD/README.md`)
      .then(r => r.ok ? r.text() : null).catch(() => null));
    return readmes.get(repo);
  };
  async function showReadme(z, repo) {
    const text = await readme(repo);
    if (!text || selected !== z || !window.marked) return;
    const content = document.createElement('div');
    content.className = 'blog-content';
    content.innerHTML = window.marked.parse(text);
    // Relative images and links point into the repo
    const relative = url => url && !/^([a-z]+:|\/\/|#)/i.test(url);
    content.querySelectorAll('img').forEach(img => {
      const src = img.getAttribute('src');
      if (relative(src)) img.src = `https://raw.githubusercontent.com/${repo}/HEAD/${src.replace(/^\.?\//, '')}`;
    });
    // A video uploaded to GitHub sits in a README as a bare link on its own line; GitHub shows it as a player
    content.querySelectorAll('p > a[href^="https://github.com/user-attachments/assets/"]:only-child').forEach(a => {
      if (a.textContent.trim() === a.getAttribute('href')) a.parentElement.outerHTML = `<video controls preload="metadata" src="${esc(a.href)}"></video>`;
    });
    content.querySelectorAll('a').forEach(a => {
      const href = a.getAttribute('href');
      if (relative(href)) a.href = `https://github.com/${repo}/blob/HEAD/${href.replace(/^\.?\//, '')}`;
      if (!href?.startsWith('#')) Object.assign(a, { target: '_blank', rel: 'noopener' });
    });
    detailsBody.insertAdjacentHTML('beforeend', `<p class="prof-section-title">README.md · <a href="https://github.com/${esc(repo)}" target="_blank" rel="noopener">${esc(repo)} ↗</a></p>`);
    detailsBody.append(content);
  }

  // ===== Selecting a zone: its details in a window that grows out of it; the address links straight to it =====
  let selected = null;
  const thumbs = list => `<div class="prof-thumbs">${list.map(t =>
    `<button type="button" data-texture="${t.index}" title="${esc(t.name)}"><img src="${esc(t.src)}" alt="${esc(t.caption)}" loading="lazy" referrerpolicy="no-referrer"></button>`).join('')}</div>`;
  const zoneList = z => z.children?.length ? `<p class="prof-section-title">Zones (${z.children.length})</p><div class="prof-list">${z.children.map(c =>
    `<button type="button" data-zone="${allZones.indexOf(c)}">${esc(c.name)}</button>`).join('')}</div>` : '';
  const youtube = url => url?.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/)?.[1];
  function select(z) {
    selected?.el.classList.remove('is-selected');
    selected = z;
    z.el.classList.add('is-selected');
    history.replaceState(null, '', `#${z.slug}`);
    const stats = [['Track', z.track.name]];
    let path = z.track.name, body = '';
    if (z.kind === 'studio') {
      if (z.role) stats.push(['Role', z.role]);
      if (z.detail) stats.push(['Titles', z.detail]);
      stats.push(['Period', period(z)], ['Duration', duration(z.from, z.to)]);
      body = zoneList(z);
    } else if (z.kind === 'project') {
      for (let a = z.parent; a; a = a.parent) path = path.replace(z.track.name, `${z.track.name} › ${a.name}`);
      if (z.approximate) stats.push(['Period', `${period(z.parent)} (timing approximate)`]);
      else stats.push(['Period', period(z)], ['Duration', duration(z.from, z.to)]);
      body = (z.data.description ?? '') + zoneList(z);
    } else if (z.kind === 'art') {
      for (let a = z.parent; a; a = a.parent) path = path.replace(z.track.name, `${z.track.name} › ${a.name}`);
      const last = Math.floor(z.to - 1 / 12);
      stats.push(['Period', `${Math.floor(z.from)}${last > Math.floor(z.from) ? `–${last}` : ''}`], ['Resources', `${z.textures.length} textures`]);
      body = z.data.description;
    } else if (z.kind === 'education') {
      stats.push(['Program', z.detail], ['Period', period(z)], ['Duration', duration(z.from, z.to)]);
    } else if (z.kind === 'event') {
      path += ` › ${z.job.name}`;
      stats.push(['Studio', z.job.name], ['Date', monthName(z.from)]);
      body = z.note ? `<p>${esc(z.note)}</p>` : '';
    } else if (z.kind === 'post') {
      stats.push(['Posted', new Date(`${z.post.date}T12:00`).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })]);
    }
    const video = youtube(z.data?.video), repo = repoOf(z.data?.link);
    if (z.data?.link && !repo) body += `<p><a href="${esc(z.data.link)}" target="_blank" rel="noopener">${esc(z.data.link)} ↗</a></p>`;
    detailsPath.textContent = path;
    detailsBody.innerHTML = `<h2>${esc(z.name)}</h2>
      <dl class="prof-stats">${stats.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl>
      ${body}
      ${video ? `<div class="prof-video"><iframe src="https://www.youtube.com/embed/${video}" title="${esc(z.name)} video" allow="encrypted-media; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>` : ''}
      ${z.kind !== 'post' && z.textures.length ? `<p class="prof-section-title">Bound resources (${z.textures.length})</p>${thumbs(z.textures)}` : ''}
      ${z.data?.media === 'pending' && !repo && !z.textures.length && !video ? '<div class="prof-media-slot">Images and video to come</div>' : ''}`;
    if (z.kind === 'post') {
      // The whole post, its images opening in the texture viewer, then its comments
      const content = document.createElement('div');
      content.className = 'blog-content';
      content.append(document.getElementById(`post-${z.post.slug}`).content.cloneNode(true));
      content.querySelectorAll('img').forEach((img, i) => { img.dataset.texture = z.textures[i].index; });
      content.querySelectorAll('video[data-default-volume]').forEach(v => v.addEventListener('loadedmetadata', () => {
        v.volume = Number(v.dataset.defaultVolume);
      }, { once: true }));
      detailsBody.append(content);
      attachComments(detailsBody, z.post.commentId);
    }
    if (repo) showReadme(z, repo);
    details.classList.toggle('is-reading', z.kind === 'post' || Boolean(repo));
    // The window has the zone's or marker's color (markers are light)
    details.style.setProperty('--hue', z.hue);
    details.classList.toggle('is-light', isMarker(z));
    if (!details.open) {
      details.showModal();
      grow(z);
    }
    details.scrollTop = 0;
  }
  /** Opens the details window by growing the zone or marker into it: a block of its color turns, moves and
      stretches from it to the window's place and size, then the contents fade in. It plays even with reduced
      motion asked for: it's short, and only on a click. */
  function grow(z) {
    const box = z.el.getBoundingClientRect(), w = z.el.offsetWidth, h = z.el.offsetHeight; // unrotated size
    const x = box.left + box.width / 2 - w / 2, y = box.top + box.height / 2 - h / 2;
    const to = details.getBoundingClientRect(), end = getComputedStyle(details);
    const ghost = document.createElement('div');
    ghost.className = 'prof-ghost';
    ghost.style.background = end.backgroundColor;
    ghost.style.borderColor = end.borderTopColor;
    details.append(ghost); // in the window, so it's above the backdrop
    details.classList.add('is-growing');
    ghost.animate([
      { left: `${x}px`, top: `${y}px`, width: `${w}px`, height: `${h}px`, rotate: getComputedStyle(z.el).rotate },
      { left: `${to.left}px`, top: `${to.top}px`, width: `${to.width}px`, height: `${to.height}px`, rotate: '0deg' },
    ], { duration: 225, easing: 'cubic-bezier(.3, .7, .2, 1)' }).finished.then(() => {
      ghost.remove();
      details.classList.remove('is-growing');
    });
  }
  timeline.addEventListener('click', e => {
    const z = e.target.closest('.zone, .marker')?.zone;
    if (!z || (dragged && e.detail)) return; // a drag's release isn't a click; keyboard clicks have no detail
    select(z);
  });
  timeline.addEventListener('dblclick', e => {
    const z = e.target.closest('.zone')?.zone;
    if (z) zoomTo(z);
  });
  detailsBody.addEventListener('click', e => {
    const zoneButton = e.target.closest('[data-zone]');
    if (zoneButton) {
      const z = allZones[zoneButton.dataset.zone];
      select(z);
      zoomTo(z.parent ?? z);
    }
    const textureEl = e.target.closest('[data-texture]');
    if (textureEl) openViewer(textures[textureEl.dataset.texture]);
  });
  // Closes with ×, Escape or a click outside it
  details.addEventListener('close', () => {
    selected?.el.classList.remove('is-selected');
    selected = null;
    history.replaceState(null, '', location.pathname + location.search);
  });
  $('.prof-details__close').addEventListener('click', () => details.close());
  details.addEventListener('click', e => { if (e.target === details) details.close(); });
  addEventListener('keydown', e => {
    // F frames the selection, or everything; not while typing
    const typing = e.target.closest?.('input, textarea, [contenteditable]');
    if (e.key.toLowerCase() === 'f' && !e.ctrlKey && !e.metaKey && !e.altKey && !typing && !timeline.hidden && !viewer.open) {
      if (selected) zoomTo(selected);
      else setView(FULL.from, FULL.to);
    }
  });

  // ===== Texture viewer: over the current view, stepping through the zone's textures =====
  const viewer = $('.prof-viewer'), viewerImg = $('.prof-viewer__canvas img'), viewerCanvas = $('.prof-viewer__canvas');
  const viewerName = $('.prof-viewer__name'), viewerCount = $('.prof-viewer__count');
  const viewerCaption = $('.prof-viewer__caption'), viewerOwner = $('.prof-viewer__owner');
  let lens = { scale: 1, x: 0, y: 0 }, shown = null;
  const applyLens = () => { viewerImg.style.transform = `translate(${lens.x}px, ${lens.y}px) scale(${lens.scale})`; };
  function openViewer(t) {
    shown = t;
    viewerImg.src = t.src;
    viewerImg.alt = t.caption;
    lens = { scale: 1, x: 0, y: 0 };
    applyLens();
    const siblings = t.zone.textures;
    viewerName.textContent = t.name;
    viewerCount.textContent = `${siblings.indexOf(t) + 1} / ${siblings.length}`;
    viewerCaption.textContent = t.caption || t.name;
    // Inside the timeline it's already in view; from Resources it's a way there
    viewerOwner.textContent = timeline.hidden ? `Show ${t.zone.name} in timeline →` : '';
    viewerOwner.hidden = !timeline.hidden;
    if (!viewer.open) viewer.showModal();
  }
  const step = by => {
    const siblings = shown.zone.textures;
    openViewer(siblings[(siblings.indexOf(shown) + by + siblings.length) % siblings.length]);
  };
  viewerImg.addEventListener('load', () => {
    if (shown) viewerName.textContent = `${shown.name} · ${viewerImg.naturalWidth}×${viewerImg.naturalHeight} · sRGB`;
  });
  $('.prof-viewer__prev').addEventListener('click', () => step(-1));
  $('.prof-viewer__next').addEventListener('click', () => step(1));
  $('.prof-viewer__close').addEventListener('click', () => viewer.close());
  viewer.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });
  viewerOwner.addEventListener('click', () => {
    const z = shown.zone;
    viewer.close();
    showView('timeline');
    zoomTo(z);
    select(z);
  });
  viewerCanvas.addEventListener('wheel', e => {
    e.preventDefault();
    lens.scale = Math.min(Math.max(lens.scale * Math.exp(-e.deltaY * 0.0015), 1), 12);
    if (lens.scale === 1) lens.x = lens.y = 0;
    applyLens();
  }, { passive: false });
  let pan = null;
  viewerCanvas.addEventListener('pointerdown', e => { pan = { x: e.clientX - lens.x, y: e.clientY - lens.y }; });
  addEventListener('pointermove', e => { if (pan) { lens.x = e.clientX - pan.x; lens.y = e.clientY - pan.y; applyLens(); } });
  addEventListener('pointerup', () => { pan = null; });
  root.querySelectorAll('[data-channel]').forEach(b => b.addEventListener('click', () => {
    root.querySelectorAll('[data-channel]').forEach(o => o.setAttribute('aria-pressed', String(o === b)));
    viewerImg.style.filter = b.dataset.channel ? `url(#${b.dataset.channel})` : '';
  }));

  // ===== Resources tab: all textures, by draw call =====
  const resources = $('.prof-resources');
  resources.innerHTML = allZones.filter(z => z.textures.length).map((z, i) => `
    <div class="prof-res-group">Draw ${String(i + 1).padStart(2, '0')} · <b>${esc(z.name)}</b> · ${z.track.name} · ${z.textures.length} textures</div>
    <div class="prof-res-grid">${z.textures.map(t => `
      <button type="button" class="prof-tex" data-texture="${t.index}">
        <img src="${esc(t.src)}" alt="" loading="lazy" referrerpolicy="no-referrer">
        <span>${esc(t.name)}</span><span class="prof-tex__dims">—</span>
      </button>`).join('')}</div>`).join('');
  resources.querySelectorAll('.prof-tex img').forEach(img => img.addEventListener('load', () => {
    img.parentElement.querySelector('.prof-tex__dims').textContent = `${img.naturalWidth}×${img.naturalHeight} · sRGB`;
  }, { once: true }));
  resources.addEventListener('click', e => {
    const b = e.target.closest('[data-texture]');
    if (b) openViewer(textures[b.dataset.texture]);
  });

  // ===== Tabs =====
  function showView(name) {
    root.querySelectorAll('[data-view]').forEach(t => t.setAttribute('aria-selected', String(t.dataset.view === name)));
    timeline.hidden = name !== 'timeline';
    resources.hidden = name !== 'resources';
    overview.style.visibility = name === 'timeline' ? '' : 'hidden';
    if (name === 'timeline') draw();
  }
  root.querySelectorAll('[data-view]').forEach(t => t.addEventListener('click', () => showView(t.dataset.view)));

  // ===== Links straight to a zone: /#slug =====
  const openFromAddress = (frame = true) => {
    const z = allZones.find(z => z.slug === decodeURIComponent(location.hash.slice(1)));
    if (!z) return;
    showView('timeline');
    root.scrollIntoView({ block: 'start', behavior: 'instant' });
    if (frame) zoomTo(z);
    select(z);
  };
  addEventListener('hashchange', () => openFromAddress());
  addEventListener('resize', draw);
  draw();
  openFromAddress(false); // a page load always starts zoomed out

  // ===== Intro, once it's in view: a quick load bar, the UI, then the zones and markers sweeping in =====
  // (the steps are styled by data-intro, with fades in place of movement for reduced motion); then the controls,
  // over the timeline until the first click
  const help = $('.prof-help');
  let clicked = false;
  root.addEventListener('pointerdown', () => { clicked = true; help.hidden = true; }, { once: true, capture: true });
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
  const across = t => Math.min(Math.max((t - view.from) / (view.to - view.from), 0), 1);
  async function intro() {
    root.dataset.intro = 'loading';
    await wait(450);
    root.dataset.intro = 'revealed';
    await wait(200);
    for (const z of allZones) z.el.style.setProperty('--delay', `${Math.round(across(z.shownFrom) * 400 + z.depth * 30)}ms`);
    root.dataset.intro = 'populating';
    await wait(950);
    delete root.dataset.intro;
    help.hidden = clicked;
  }
  new IntersectionObserver(([entry], observer) => {
    if (!entry.isIntersecting) return;
    observer.disconnect();
    intro();
  }, { threshold: 0.2 }).observe(root);
})();
