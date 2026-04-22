---
title: Lessons from Building an LOD Pipeline for AAA
date: 2026-03-07
tags:
  - Pipeline
  - Optimization
subtitle: What I learned integrating an automatic LOD generation algorithm into a shipping Call of Duty title, and how to avoid the traps that nearly broke our build.
excerpt: What I learned integrating an automatic LOD generation algorithm into a shipping Call of Duty title, and how to avoid the traps that nearly broke our build.
---

When I joined Sledgehammer Games, one of the first big projects I owned was integrating a proprietary LOD (Level of Detail) generation algorithm into the asset pipeline for *Call of Duty: WWII*. The goal was ambitious: replace almost all manually authored LODs with automatically generated ones, saving artists hundreds of hours and improving mesh consistency across the game.

It worked. But not without a few hard lessons along the way.

## What LODs Actually Are (and Why They Matter)

For the uninitiated: a Level of Detail (LOD) system swaps a high-resolution mesh for progressively simpler versions as the camera moves further away. A gun with 10,000 triangles that's right in your face probably doesn't need to be 10,000 triangles when it's across a battlefield. LOD0 is full fidelity; LOD1, LOD2, LOD3 each shed more polygons.

In a AAA game with tens of thousands of assets, manually authoring every LOD chain is a massive time sink. Artists would spend hours hand-tweaking each level to make sure silhouettes held up at distance, normals baked correctly, and nothing looked like a melting potato when the camera panned away. The quality was inconsistent and the work was tedious.

An automated solution sounded like a no-brainer until we got into the details.

## The Integration Challenge

Our LOD algorithm was a command-line tool: you fed it a mesh, specified reduction ratios, and it spat out simplified geometry. Clean in isolation. But production pipelines are never isolated.

The first wall we hit was **asset variance**. The algorithm was tuned for "average" geometry: evenly distributed quads, clean topology, no degenerate faces. Production art, especially legacy assets, is messy. We had models with overlapping UVs, hidden interior geometry, non-manifold edges, and faces so tiny they'd collapse before LOD1 even kicked in. The tool would either crash silently, produce garbled output, or, worst of all, produce output that *looked* fine in a viewport but broke at runtime.

The fix was a pre-validation pass. Before any mesh touched the LOD tool, we ran it through a suite of geometry checks: degenerate triangle detection, UV boundary analysis, vertex count thresholds, and a hardcoded list of mesh categories that were flagged for manual LOD review (weapons seen in first-person, hero character heads, anything with complex rig deformation). Garbage in, garbage out, so we stopped letting garbage in.

## The Silent Failure Problem

The scarier issue was silent failures. The tool would return a success code but write a mesh that was subtly wrong: a few vertices in the wrong position, a UV seam that had drifted, a normal map that had lost its tangent basis reference. These wouldn't show up in a quick art review. They'd ship, and someone would notice a weird shimmering artifact in a stress test three weeks later.

We solved this with automated visual regression testing. After LOD generation, each mesh was rendered at multiple distances against a reference image from the previous approved version. If the pixel diff exceeded a threshold, it got flagged for human review. It sounds simple, but setting the threshold correctly took a lot of iteration: too tight, and every minor improvement tripped the alarm; too loose, and you were missing real problems.

We settled on per-category thresholds. Props had a tighter budget than background foliage. Weapons had the tightest tolerance of all.

## Working at Scale

Once the tool was stable on individual assets, we had to run it across the entire game. That meant batching thousands of meshes through a pipeline that had to be resumable (long farm jobs get interrupted), idempotent (re-running a mesh shouldn't produce different results), and auditable (artists needed to know exactly which LODs were auto-generated vs. manually authored, and when each was last regenerated).

We ended up storing LOD provenance metadata alongside each asset in our asset database. Every auto-generated LOD had a timestamp, a tool version hash, and the parameter set used to generate it. If we updated the algorithm, we could query which assets needed regeneration and re-run only those. This saved enormous amounts of farm time on later iterations.

## What I'd Do Differently

Looking back, a few things would have saved us weeks:

- **Define the failure taxonomy first.** We spent too long figuring out *which* failure modes mattered. A clear taxonomy of "this is a blocker / this is a warning / this is acceptable" before we started would have aligned the team faster.
- **Opt-in before opt-out.** We initially ran the tool on everything and built an exclusion list. It should have been the reverse: start with a pilot set of well-behaved assets, prove the system, then expand. The early noise from bad meshes destroyed trust in the tool before it had earned any.
- **Own the feedback loop to artists.** The technical part was the easy part. The harder part was giving artists clear, actionable reports when their assets failed validation. Vague error messages caused confusion and back-and-forth tickets. Investing in a clean artist-facing dashboard earlier would have been worth it.

## The Payoff

By the time the game shipped, the LOD pipeline was handling the vast majority of game assets automatically. Artists almost never had to think about LODs for standard props and environment pieces. The time savings were real and, more importantly, LOD quality became *more* consistent, because the algorithm didn't have good days and bad days the way a tired artist at the end of a crunch sprint might.

Technical art at its best is when the technology gets out of the way and lets artists do creative work. This pipeline did that. The process of building it taught me more about production-scale tooling, failure modes, and cross-discipline communication than almost any other project I've worked on.

If you're building something similar, start small, validate obsessively, and never underestimate how messy real production assets are.
