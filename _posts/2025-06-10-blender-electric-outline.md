---
title: Blender Geometry Nodes
post_id: blender-geo-nodes-electric-outline
date: 2025-06-10
---

I wanted to create an effect that could take any arbitrary mesh and convert it into something that looked like an art installation or sci-fi hologram.

The entire effect is non-destructive and works on any mesh.

{% include post-video.html src="/resources/electric_whale.mp4" autoplay=true muted=true loop=true playsinline=true %}

## How It Works

The pipeline is built with Blender's Geometry Nodes and a little shader magic. It works like so:

1. The input mesh is converted to a point cloud.
2. Each point connects to its closest neighbors via splines.
3. The splines are subdivided and random noise is applied to create an electric feel.
4. A cylinder is extruded along each spline path.
5. A color gradient is applied along the Z axis. 
6. The stored color attribute is piped into the emissive channel via shader nodes.

## The Node Graph

The geometry node setup.
{% include post-image.html src="/resources/geo_nodes.PNG" alt="Geometry Nodes setup in Blender" %}

The slowest part is the inner loop (in blue) where each point finds its nearest neighbors, which is currently an O(n^2) distance check operation. I might optimize it using the new raycast node, but it still ran real-time-enough for me. 

## Tools

Blender 4.5, Geometry Nodes, Shader Editor