---
title: Match 2 Game - Unity 2D
date: 2026-04-14
tags:
  - Unity
  - VFX
  - Shaders
subtitle: A demonstration of 2D VFX, shaders, animation, and procedural systems built in Unity.
excerpt: A demonstration of 2D VFX, shaders, animation, and procedural systems built in Unity.
---

This project started to refresh my knowledge of Unity especially in the realm of 2D which I've never really touched. I tried to make as much as possible dynamic and interactive. Adding as much visual flair as I possibly could.

{% include post-video.html src="/portfolio/resources/2d_game_03.mp4" volume=0.3 %}

## Highlights

- **Dynamic tentacles** that seek out and eat loot drops using inverse kinematics
- **Custom shaders** including dissolve, fog swirl, and god rays. All node based, built in Shader Graph
- **Custom particle systems** using Shuriken for impact, pickup, and ambient FX. 
- **Sprite-based card flip sequences** with state machine control for clean transitions
- **Event-driven animation triggers** for gameplay feedback (idle, click, flip, reset)

## Technical Approach

The tentacle system uses a chain of IK targets that (relatively) smoothly interpolate toward loot drop positions. Once a drop is within reach, the tentacle "grabs" it and plays an eating animation accompanied by screen shake (Cthulhu's stomach rumbling presumably)

The fog swirl shader combines scrolling noise textures with a radial distortion pass. God rays are screen-space, sampling a bright-pass buffer and blurring along a direction vector pointed at the light source. Both are lightweight enough to run without issue on mobile hardware.

## Tools

Unity 2D, C#, Shader Graph, Shuriken for VFX, Inverse Kinematics
