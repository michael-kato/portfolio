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

{% include post-video.html src="../resources/2d_game_03.mp4" volume=0.3 %}

This project started as an excuse to dive deep into Unity 2D's VFX and shader tooling. I wanted to build something small enough to finish but rich enough to explore procedural animation, particle systems, and custom shaders in a real gameplay context.

The result is a match-2 card game where the visual polish does most of the heavy lifting. Every interaction has feedback, every transition has personality.

## Highlights

- **Dynamic tentacles** that seek out and eat loot drops using inverse kinematics
- **Custom shaders** including dissolve, fog swirl, and god rays, all built in Shader Graph
- **Custom particle systems** using Shuriken for impact, pickup, and ambient FX
- **Sprite-based card flip sequences** with state machine control for clean transitions
- **Event-driven animation triggers** for gameplay feedback (idle, click, flip, reset)

## Technical Approach

The tentacle system uses a chain of IK targets that smoothly interpolate toward loot drop positions. Once a drop is within reach, the tentacle "grabs" it and plays an absorption animation driven by a dissolve shader. The dissolve threshold is animated over time, giving a satisfying disintegration effect.

The fog swirl shader combines scrolling noise textures with a radial distortion pass. God rays are screen-space, sampling a bright-pass buffer and blurring along a direction vector pointed at the light source. Both are lightweight enough to run without issue on mobile-tier hardware.

Card flip animations use a sprite-swap approach rather than 3D rotation. Each frame of the flip is a hand-authored sprite, triggered by a state machine that locks input during transitions to prevent double-flips and race conditions.

## Tools

Unity 2D, C#, Shader Graph, Shuriken Particle System, Inverse Kinematics
