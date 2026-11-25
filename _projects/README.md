# Adding a New Project

Drop a new `.md` file in `_projects/` named `YYYY-MM-slug.md`. Jekyll sorts the
Projects feed automatically from newest to oldest using the `date:` field.

## Template

```yaml
---
title: Project Name
date: 2026-11-20
category: pipelines   # pipelines | realtime | ml
repo: https://github.com/michael-kato/repo-name
stack:
  - Python
  - Blender
summary: One or two crisp sentences explaining what it does and why it exists.
# Optional fields:
# featured: true
# media_type: video   # video | image | video_tabs | image_tabs
# media: /resources/demo.mp4
# media_caption: Optional lightbox caption for single image
# images:             # used when media_type is image_tabs
#   - label: Overview
#     src: /resources/projects/shot_01.jpg
#     caption: Caption shown in lightbox
# image_lightbox: /resources/node_graph.png
# image_lightbox_label: View node graph
# playable: /resources/match2/index.html
# writeup: /blog/#post-slug
---
```
