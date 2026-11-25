---
title: mesh_optimizer
date: 2024-11-01
category: pipelines
tags:
  - pipelines
repo: https://github.com/michael-kato/mesh_optimizer
media_type: image_tabs
images:
  - label: "Edges: Before"
    src: /resources/projects/mesh_optimizer_delete_before.png
    caption: "Before unnecessary edge deletion: leftover construction and boolean edge loops"
  - label: "Edges: After"
    src: /resources/projects/mesh_optimizer_delete_after.png
    caption: "After edge deletion: redundant loops removed while preserving silhouette and UV borders"
  - label: "Normals: Before"
    src: /resources/projects/mesh_optimizer_normals_before.png
    caption: "Before hard-edge smoothing: 1,596 vertices with 5,706 split normals and tangents"
  - label: "Normals: After"
    src: /resources/projects/mesh_optimizer_normals_after.png
    caption: "After hard-edge smoothing: 1,596 vertices with 1,608 normals (~3.5x reduction)"
  - label: "Triangulation & UI"
    src: /resources/projects/mesh_optimizer_triangulation.png
    caption: "MeshOptimizer Maya UI alongside Maya default fan triangulation (left) vs. greedy triangulation (right)"
stack:
  - Wolfram Language
  - 3D Geometry
  - Optimization
summary: "A personal project exploring 3D model optimization ideas and mesh topology analysis in Wolfram Language."
---
