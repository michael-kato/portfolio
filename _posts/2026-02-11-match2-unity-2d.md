---
title: Unity 2D Game
post_id: unity-2d-game
date: 2026-02-11
---

This project started to refresh my knowledge of Unity especially in the realm of 2D which I've never really touched. I tried to make as much as possible dynamic and interactive. The main focus was adding visual flair and polish to the interactions.

<div class="video-vertical-wrap">
  {% include post-video.html src="/resources/2d_game_03.mp4" volume=0.3 %}
</div>

## Highlights

- **Dynamic tentacles** that seek out and eat loot drops using inverse kinematics
- **Custom shaders** including dissolve, fog swirl, and god rays.
- **Custom particle systems** using Shuriken for impact, pickup, and ambient FX. 
- **Sprite-based card flip sequences** with state machine control
- **Event-driven animation triggers** for gameplay feedback

## Technical Approach

The tentacle system uses a chain of IK targets that smoothly interpolate toward loot drop positions. The fog swirl shader combines scrolling noise textures with a radial distortion pass.

## Tools

Unity 2D, C#, Shader Graph, Shuriken for VFX, Inverse Kinematics