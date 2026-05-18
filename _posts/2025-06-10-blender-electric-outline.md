---
title: Blender Geometry Nodes
post_id: blender-geo-nodes-electric-outline
date: 2025-06-10
---

I wanted to create an effect that could take any arbitrary mesh and convert it into something that looked like an electrical schematic come to life: points of light connected by arcing, noisy lightning bolts, all wrapped in a color gradient.

The entire effect is non-destructive and works on any mesh.

{% include post-video.html src="/resources/electric_whale.mp4" autoplay=true muted=true loop=true playsinline=true %}

## How It Works

The pipeline is built with Blender's Geometry Nodes and a little shader magic. It works like so:

1. **Mesh to Point Cloud** - The input mesh is converted to a point cloud.
2. **Nearest-Neighbor Connections** - Each point connects to its closest neighbors via splines.
3. **Subdivide + Noise** - The splines are subdivided and random noise is applied to create an electric feel.
4. **Cylinder Extrusion** - A cylinder is extruded along each spline path.
5. **Color Ramp** - A color gradient is applied along the Z axis. 
6. **Shader Hookup** - The stored color attribute is piped into the emissive channel.

## The Node Graph

The geometry node setup above shows the full pipeline.

{% include post-image.html src="/resources/geo_nodes.PNG" alt="Geometry Nodes setup in Blender" %}

The slowest part is the inner loop where each point finds it's nearest neighbors. I'd like to optimize it one day by using the new raycast node.

## What I Learned

Geometry Nodes reward thinking in terms of data flow rather than traditional modeling operations. The "subdivide then displace" pattern is surprisingly versatile.

## Tools

Blender 4.5, Geometry Nodes, Shader Editor