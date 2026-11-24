---
title: Procedural Electric Mesh Outline
date: 2025-06-10
category: pipelines
tags:
  - pipelines
  - realtime
featured: true
media_type: video
media: /resources/electric_whale.mp4
image_lightbox: /resources/geo_nodes.PNG
image_lightbox_label: Inspect node graph
stack:
  - Blender 4.5
  - Geometry Nodes
  - Shader Nodes
summary: "A non-destructive Blender Geometry Nodes setup that turns any 3D mesh into colorful dots connected by lightning, kind of like an art installation or hologram. It converts the mesh to a point cloud, connects nearby points with noisy splines, extrudes cylinders along them, and passes a Z-axis color gradient into the emissive shader. The nearest-neighbor inner loop is O(n^2), which isn't ideal, but it still ran real-time enough for what I needed."
---
