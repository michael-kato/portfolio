/**
 * Portfolio Data - Centralized content for Michael Kato's portfolio site
 * This file contains all project and art data to make maintenance easier
 */

console.log("Site Content Script (formerly portfolio-data) Loaded Successfully");

window.projectData = {
  "project-code-contributions": {
    title: "Performance Code Contributions",
    summary: "Contributed directly to the Horizon Worlds game code as a technical artist, submitting dozens of C# performance fixes.",
    tags: ["C#", "Unity", "Optimization"],
    description: `
<div class="project-section">
  <p>In addition to several other duties I accumulated at Meta, I also contributed directly to Horizon Worlds' game code as a technical artist, with a commit volume comparable to an average Meta software engineer.</p>

  <p>Highlights include:</p>
  <ul class="project-list">
    <li>Identified and patched a 1ms-per-frame battery polling call running every frame, surfacing the regression and shipping a fix the same day it was flagged by the team</li>
    <li>Swept nearly the entire codebase to batch or cache redundant native Unity transform calls (SetPosition, GetTransform), later standardized as a linter error</li>
    <li>Cleaned up dozens of uncached memory allocations contributing to the platform's chronic GC pressure</li>
    <li>Earned code reviewer status—a distinction not held by most technical artists on the team—and regularly reviewed engineer submissions</li>
  </ul>
</div>
  `,
    images: null,
    video: null
  },
  "project-perf-framework": {
    title: "Performance Automation Framework",
    summary: "Collaborated with lead engineers to design and instrument a comprehensive performance monitoring system for Horizon Worlds.",
    tags: ["C#", "Unity", "Analytics"],
    description: `
<div class="project-section">
  <p>I collaborated with lead engineers to design and instrument a comprehensive performance monitoring system for Horizon Worlds' weekly release cadence—starting as a solo initiative before growing into a dedicated team effort.</p>

  <p>The framework:</p>
  <ul class="project-list">
    <li>Instrumented majority of our game code with a custom C# profiling system I helped develop, running in all builds including live production</li>
    <li>Tracked systems like physics, scripting, animation, rendering, VFX, audio, and even garbage collection</li>
    <li>Ran on pre-submission, continuous integration, and on-demand for developer testing, and in live user build. It was quite versitile.</li>
    <li>Detected regressions within hours of a code change landing and generated downloadable profiler artifacts for debugging</li>
  </ul>
</div>
  `,
    images: null,
    video: null
  },

  "project-perf-dashboards": {
    title: "Performance Visualization Dashboards",
    summary: "Created configurable performance dashboards displaying Horizon Worlds live production, automation, and internal testing data.",
    tags: ["Data Visualization", "SQL", "Analytics"],
    description: `
<div class="project-section">
  <p>Horizon Worlds collected a massive amount of performance data from multiple sources: automation, developer testing, and production. When I first started at Meta most of this data was unused, so in order make this information accessible to all team members, I created lots of dashboards showing performance trends. The amount of SQL code I wrote for these dashboards was roughly equivalent to the average Data Scientist at Meta.</p>
  
  <p>These dashboards:</p>
  <ul class="project-list">
    <li>Enabled users to filter down performance queries including by world, player count, device type, time of day, etc.</li>
    <li>Automatically detected regressions and emailed alerts to relevant stakeholders</li>
    <li>Helped non-technical stakeholders understand and share performance trends</li>
    <li>Enabled data-driven prioritization of optimizations and helped teams demonstrate impact of performance work</li>
  </ul>
</div>
  `,
    images: [
      "/portfolio/resources/hitch_dashboard.PNG",
      "/portfolio/resources/fps_dashboard.PNG"
    ],
    video: null
  },
  "project-outsourcing-pipeline": {
    title: "Outsourcing Ingestion & Delivery Pipeline",
    summary: "Built an end-to-end automated pipeline handling both the delivery of tools packages to vendors and ingestion of completed assets.",
    tags: ["Python", "AWS", "Perforce"],
    description: `
<div class="project-section">
  <p>To support a high-volume outsourcing operation, I built an end-to-end automated pipeline handling both the delivery of tools packages to vendors and the ingestion of completed assets back into our perforce depot.</p>

  <p>The pipeline handled:</p>
  <ul class="project-list">
    <li>Delivery: automatically packaged all Python dependencies in-place, resolved and bundled metadata file references, zipped the environment, pushed to AWS, and sent a confirmation email to vendors, and debugged issues</li>
    <li>Ingestion: pulled completed vendor assets into the Perforce depot, ran the QA validation suite automatically, and notified artists of new assets ready for manual review</li>
    <li>Eliminated manual handoff steps on both ends of the outsourcing loop, reducing the risk of broken environments or missed QA failures reaching the training pipeline</li>
  </ul>
</div>
  `,
    images: null,
    video: null
  },
  "project-asset-qa": {
    title: "Asset Validation QA Tools",
    summary: "Collaborated with other tech artists to create comprehensive QA tooling for thousands of 3D assets.",
    tags: ["Python", "Pipeline", "Maya"],
    description: `
<div class="project-section">
  <p>At Apple, we processed thousands of 3D models from internal teams and external vendors. Quality issues frequently caused pipeline failures, wasting resources during training data generation and artist time. Together with the TA team, we developed validation tools that helped smooth things out.</p>
  
  <p>These QA tools:</p>
  <ul class="project-list">
    <li>Checked for a host of common asset importation errors such as abnormal size, missing textures, improper material settings, etc.</li>
    <li>Generated thumbnail images automatically for use the asset browser</li>
    <li>Standardized quality and saved artists time</li>
  </ul>
</div>
  `,
    images: null,
    video: null
  },

  "project-proc-scene": {
    title: "Procedural Scene Generation",
    summary: "Developed procedural scene generation systems for Apple Vision Pro training data.",
    tags: ["Python", "Maya", "Procedural"],
    description: `
<div class="project-section">
  <p>Apple Vision Pro required massive amounts of photoreal images to train it's visual recognition. Working with a lead TA, I developed a procedural generation system that created semi-randomized sets of interior layouts to help generate new data overnight without the need for additional artists.</p>
  
  <p>The system:</p>
  <ul class="project-list">
    <li>Procedurally modified the floorplan of existing interior scenes and dynamically extruded new walls, windows, and crevices</li>
    <li>Randomly repositioned furniture and props to create new arrangements</li>
    <li>Automatically submitted to perforce, Deadline for rendering, and an email announcement to key stakeholders</li>
  </ul>
</div>
  `,
    images: null,
    video: null
  },
  "project-perf-ownership": {
    title: "Broad Performance Ownership",
    summary: "Primary performance stakeholder responsible for maintaining 60fps across the the majority of Call of Duty: WWII.",
    tags: ["Analysis", "Performance", "Triage"],
    description: `
<div class="project-section">
  <p>For Call of Duty: WWII, I was the primary performance stakeholder responsible for maintaining 60fps across the entire singleplayer campaign, zombies mode, hub world, and multiple DLC multiplayer maps, covering every art discipline on a 300+ person team.</p>

  <p>This role included:</p>
  <ul class="project-list">
    <li>Weekly performance reviews with art and design leads across environment, lighting, VFX, and design disciplines</li>
    <li>Deep enough familiarity with every team's toolchain to diagnose performance issues and propose targeted fixes to stakeholders</li>
    <li>Identified a cross-studio team that had fallen behind on performance optimization for their assigned level, escalated to production, and coordinated resources to close the gap before it became a ship risk</li>
  </ul>
</div>
  `,
    images: null,
    video: null
  },
  "project-lod-pipeline": {
    title: "LOD Generation Pipeline",
    summary: "Integrated a proprietary LOD generation algorithm into the asset pipeline, replacing hand-authored LODs for every 3D asset.",
    tags: ["C++", "C#", "Optimization"],
    description: `
<div class="project-section">
  <p>For Call of Duty: WWII, I partnered with the central technology group to integrate a proprietary LOD generation algorithm into Sledgehammer's asset pipeline—replacing hand-authored LODs for every 3D asset in the game.</p>

  <p>The system:</p>
  <ul class="project-list">
    <li>Applied to every environment prop, vehicle, character, and weapon in the game with geometry-type presets tuned for hard surface, organic, and foliage meshes</li>
    <li>Was effective enough that I was able to add and tune LODs for the majority of a full Call of Duty title essentially on my own</li>
    <li>Enabled more consistent and aggressive LOD budgets than manual artist work, directly supporting the 60fps target across console generations</li>
    <li>Extended into a secondary Maya tool that atlased textures for ultra-cheap final LODs, combining the LOD algorithm, custom skinning tools, and Python automation into a single pipeline</li>
  </ul>
</div>
  `,
    images: null,
    video: null
  },

  "project-edge-cleanup": {
    title: "Edge Cleanup Tool",
    summary: "Created a Maya tool that detects non-optimal edges/vertices in regards to performance.",
    tags: ["Python", "Maya", "Optimization"],
    description: `
<div class="project-section">
  <p>During modeling, artists often create additional edges for construction that don't contribute to the final appearance but increase polygon counts, and in our engine there was an issue where tangents would be explicitly imported in a broken state due to data moving between programs, which caused vertex counts to massively inflate. I developed a Maya Python tool that analyzes mesh topology to identify redundant edges.</p>
  
  <p>This optimization tool:</p>
  <ul class="project-list">
    <li>Uses adjustable thresholds to determine which edges to remove</li>
    <li>Maintains UV mapping and vertex color boundaries during optimization</li>
    <li>Automatically smooths normals, if possible, which can result in lower vertex counts on the GPU in edge cases</li>
    <li>Became a standard part of our asset export process</li>
  </ul>
</div>
  `,
    images: [
      "https://lh5.googleusercontent.com/1Q15n_Eyxk7RXPCthwuFvqyC_ft8RIm3ck0GY4xiK1JibG90slSW-vA8LJOwcp75kZ17NjMkCX9MFC6Pqgb1VbnJxP7bsbj6djgqvwdn9H3jHrYDnQPD2KUrP55MYmSOeMB37CHH",
      "https://lh3.googleusercontent.com/pKYtVNI01Qr9OcI4gQvu0w_j_8lqGlx6iVZIW3JHJdVTIDT9OtAZbM8iaFV4sun43ve0_4CAaZ-9muuxgQkyyeSzGkhRVI78GPVcLW08G-khNAhlZrzA9qOlvcTwqiJHIj591a14"
    ],
    video: null
  }
};

window.artData = {
  "art-escape-game": {
    title: "Escape From Nuckinfutts Factory",
    description: `
      <p>Assets created for my Unity game "Escape from Nuckinfutts Factory" (2013). I created this as a solo project, so I modelled, textured, rigged, animated, scripted, did the VFX and lighting for everything in this project. It was quite the undertaking and even though it was never fully fleshed out, I'm still proud of what I was able to achieve solo while learning so many new concepts for the first time.</p>
    `,
    images: [
      {
        src: "https://i.imgur.com/UGUc4yz.jpg",
        caption: "Factory room overview, hero shot."
      },
      {
        src: "https://i.imgur.com/3lby5.jpg",
        caption: "Closeup of the crane, which was rigged and animated, part of the final boss fight"
      },
      {
        src: "https://i.imgur.com/6nSUBCj.jpg",
        caption: "Level 01, this a recycling facility where the player, a robot, is discarded into."
      },
      {
        src: "https://i.imgur.com/jMMIZtA.png",
        caption: "Nuckinfutts at his workbench, assembling dastardly robots"
      },
      {
        src: "https://i.imgur.com/UlNQaO3.jpg",
        caption: "Boss fight room, showing the fire traps in the ground"
      },
      {
        src: "https://i.imgur.com/lOccZy0.jpg",
        caption: "Boss fight room, showing the crusher traps in the ceiling"
      },
      {
        src: "https://i.imgur.com/PmVOx.jpg",
        caption: "Corridors"
      },
      {
        src: "https://i.imgur.com/hGK34.jpg",
        caption: "Corridors to the boss fight room"
      },
      {
        src: "https://i.imgur.com/woft3Rd.png",
        caption: "Nuckinfutts rigged"
      }
    ],
    video: "https://www.youtube.com/watch?v=UBwfiO89y6c"
  },

  "art-mod-props": {
    title: "Half-Life 2 Mod Props",
    description: `
      <p>A collection of props created for the Half-Life 2 mod "No More Room in Hell" (2012) modeled in Softimage XSI. Was done in the Source engine and was my first time collaborating within a team.</p>
    `,
    images: [
      {
        src: "https://i.imgur.com/DYKhtLU.jpg",
        caption: "Collage of props"
      },
      {
        src: "https://i.imgur.com/UOpEx.jpg",
        caption: "AO renders were my go to for showing off models back then"
      },
      {
        src: "https://i.imgur.com/vzDNH.png",
        caption: "Lexus IS 300"
      },
      {
        src: "https://i.imgur.com/fkiQQ.png",
        caption: "Crashed version"
      },
      {
        src: "https://i.imgur.com/9p3N6.jpg",
        caption: "Color variant in-engine"
      },
      {
        src: "https://i.imgur.com/bTzPY.png",
        caption: "Hydrant!"
      },
      {
        src: "https://i.imgur.com/4QiuN.jpg",
        caption: "Popcorn!"
      },
      {
        src: "https://i.imgur.com/f2njW.png",
        caption: "Smaller variant of the shelves"
      },
      {
        src: "https://i.imgur.com/bs6Bc.png",
        caption: "Let there be floodlight!"
      },
      {
        src: "https://i.imgur.com/pcnr7.png",
        caption: "Basic hand truck"
      },
      {
        src: "https://i.imgur.com/1gRU6.png",
        caption: "My biggest fan!"
      }
    ],
    video: null
  },

  "art-school-work": {
    title: "College Work",
    description: `
      <p>Various projects from my time at The Art Institute of Sunnyvale (2010-2013). I wish I still had the source files for these, most of my best work from this time was lost due to hard drive failures and network wipes (and the school closing). Massive bummer.</p>
    `,
    images: [
      {
        src: "https://i.imgur.com/DClkapV.jpg",
        caption: "Kitchen render in Maya using mental ray"
      },
      {
        src: "https://i.imgur.com/nhb5Um2.jpg",
        caption: "Kitchen render 2"
      },
      {
        src: "https://i.imgur.com/R6wXnNE.png",
        caption: "Zbrush tactical glove"
      },
      {
        src: "https://i.imgur.com/n6MVQ2g.jpg",
        caption: "AK-74"
      },
      {
        src: "https://i.imgur.com/0mRUG.png",
        caption: "Soviet 2s7 Pion"
      },
      {
        src: "https://i.imgur.com/lWwi2.png",
        caption: "Soviet 2s7 Pion"
      },
      {
        src: "https://i.imgur.com/ZwzAT.png",
        caption: "WIP Notre Dame cathedral"
      },
      {
        src: "https://i.imgur.com/DaRyA.jpg",
        caption: "Laser cube from Portal 2"
      },
      {
        src: "https://i.imgur.com/bMGks.jpg",
        caption: "Test chamber from Portal 2. The finished version was lost."
      },
      {
        src: "https://i.imgur.com/0OXOc92.png",
        caption: "Lizard King."
      },
      {
        src: "https://i.imgur.com/JmRB0.jpg",
        caption: "Character from Star Wars: Clone Wars. I modelled, texture, rigged, and animated this character but the files are lost."
      }
    ],
    video: "https://www.youtube.com/watch?v=2k-cztTwVzU"
  },

  "art-personal": {
    title: "Misc Personal Work",
    description: `
      <p>Creative explorations and fun projects I've worked on in my spare time. (2009-2012)</p>
    `,
    images: [
      {
        src: "https://i.imgur.com/AKTrC.png",
        caption: "Recreation of a Caldari Caracal from EVE: Online. Probably my first high-poly model. I went way too far with the details."
      },
      {
        src: "https://i.imgur.com/NINiT.jpg",
        caption: "Inspired by Silent Hill 3"
      },
      {
        src: "https://i.imgur.com/zcL8d.png",
        caption: "Inspired by Silent Hill 3"
      },
      {
        src: "https://i.imgur.com/xSTlO.jpg",
        caption: "Half-Life 2 mapping competition entry"
      },
      {
        src: "https://i.imgur.com/gS3Ak.jpg",
        caption: "Half-Life 2 mapping competition entry"
      },
      {
        src: "https://i.imgur.com/7RAEA.png",
        caption: "Vista building for an HL2 mod"
      }
    ],
    video: [
      "https://www.youtube.com/watch?v=Ks5aLLREdqA",
      "https://www.youtube.com/watch?v=9AEscHkULjU"
    ]
  },

  "art-speed-challenge": {
    title: "2-Hour Speed Challenges",
    description: `
      <p>Models created for a speed modelling competition I used to run on Interlopers.net. Usually a 2 hour time limit. (2009-2012)</p>
    `,
    images: [
      {
        src: "https://i.imgur.com/tiUt0.png",
        caption: "Faithfully low-poly Conker."
      },
      {
        src: "https://i.imgur.com/fkg1b.png",
        caption: "Texture"
      },
      {
        src: "https://i.imgur.com/xkucH.jpg",
        caption: "Garage"
      },
      {
        src: "https://i.imgur.com/dHQ1c.png",
        caption: "Still trying to get this added to Google Maps..."
      },
      {
        src: "https://i.imgur.com/YJjhJ.png",
        caption: "Just some trash"
      },
      {
        src: "https://i.imgur.com/NJVA8.png",
        caption: "Giant person headphones"
      },
      {
        src: "https://i.imgur.com/UVkBb.png",
        caption: "I was in this office a lot as a child"
      },
      {
        src: "https://i.imgur.com/bP6i3.jpg",
        caption: "3DS Max handicap"
      },
      {
        src: "https://i.imgur.com/QcLAR.png",
        caption: "Wonky fireplace"
      }
    ],
    video: null
  }
};
