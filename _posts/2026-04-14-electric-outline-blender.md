---
title: Electric Outline Effect in Blender
date: 2026-04-14
tags:
  - Blender
  - Geometry Nodes
  - VFX
subtitle: Transforming any 3D model into colorful dots connected by lightning, entirely with Geometry Nodes.
excerpt: Transforming any 3D model into colorful dots connected by lightning, entirely with Geometry Nodes.
---

{% include post-video.html src="../resources/electric_whale.mp4" %}

I wanted to create an effect that could take any arbitrary mesh and convert it into something that looked like an electrical schematic come to life: points of light connected by arcing, noisy lightning bolts, all wrapped in a color gradient.

The entire effect is non-destructive and works on any mesh. Swap the input model and the effect regenerates instantly.

## How It Works

The pipeline is built entirely in Blender's Geometry Nodes. Here's the breakdown:

1. **Mesh to Point Cloud** - The input mesh is converted to a point cloud, distributing points across the surface.
2. **Nearest-Neighbor Connections** - Each point connects to its closest neighbors via splines, forming the "wiring" structure.
3. **Subdivide + Noise** - The splines are subdivided and random noise is applied to each control point, creating the jagged lightning look.
4. **Cylinder Extrusion** - A small cylinder profile is extruded along each spline path to create the visible geometry.
5. **Color Ramp** - A color gradient is applied along the Z axis. Each point samples its position and stores the color as an attribute.
6. **Shader Hookup** - In the material, the stored color attribute is extracted and piped into the emissive channel for a glowing, self-lit appearance.

## The Node Graph

{% include post-image.html src="../resources/geo_nodes.PNG" alt="Geometry Nodes setup in Blender" %}

The geometry node setup above shows the full pipeline. The key insight is that by storing color as a point attribute during the geometry phase, you can access it later in the shader without any UV mapping. The color is baked into the geometry itself.

## What I Learned

Geometry Nodes reward thinking in terms of data flow rather than traditional modeling operations. The "subdivide then displace" pattern for creating organic-looking connections between points is surprisingly versatile. The same approach could generate coral, root systems, or circuit board traces with different noise parameters.

Passing data between the geometry node tree and the shader via attributes is powerful but easy to break. Renaming an attribute on one side without updating the other produces silent failures: no errors, just missing color. A naming convention helps.

## Tools

Blender 3.x, Geometry Nodes, Shader Editor
