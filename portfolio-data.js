/**
 * Portfolio Data - Centralized content for Michael Kato's portfolio site
 * This file contains all project and art data to make maintenance easier
 */

const projectData = {
  "project-perf-framework": {
    title: "Performance Automation",
    description: `
<div class="project-section">
  <p>I collaborated with lead engineers to develop a comprehensive performance monitoring solution for Horizon Worlds' rapid weekly release schedule. What began as my solo effort evolved into a dedicated performance team initiative.</p>
  
  <p>The framework enabled us to:</p>
  <ul class="project-list">
    <li>Track dozens of high and low-level code subsystems like physics, script, animation, rendering, etc.</li>
    <li>Run automated benchmarks on a scheduled cadence and to test new code submissions</li>
    <li>Detect issues within hours of code changes and provide profiler artifacts as a downloadable file</li>
    <li>Proactively address performance problems before weekly releases went live</li>
  </ul>
</div>
    `,
    images: null,
    video: null
  },

  "project-perf-dashboards": {
    title: "Performance Visualization Dashboards",
    description: `
<div class="project-section">
  <p>Horizon Worlds collected a massive amount of performance data from multiple sources—automation, developer testing, and production. To make this information accessible to all team members, I created lots of dashboards showing performance trends.</p>
  
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
      "resources/hitch_dashboard.PNG",
      "resources/fps_dashboard.PNG"
    ],
    video: null
  },

  "project-asset-qa": {
    title: "Asset Validation QA Tools",
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

  "project-lod-pipeline": {
    title: "LOD Generation Pipeline",
    description: `
<div class="project-section">
  <p>For Call of Duty: WWII, creating multiple LODs for thousands of assets consumed significant amounts of time for artists and is a supremely unfun thing to do. I integrated and customized a proprietary LOD generation system developed by our central technology group that saved hundreds, possibly thousands of hours of artists' lives and enabled them to go home to their families with their sanity intact.</p>
  
  <p>This LOD system:</p>
  <ul class="project-list">
    <li>Reduced LOD creation time from hours to minutes per asset, it was so effective I was able to effectively add and tune LODs for the majority of a Call of Duty game single handedly</li>
    <li>Enabled more consistent and aggressive LODs compared to what artists typically authored manually</li>
    <li>Helped achieve 60fps across all game modes and console generations</li>
  </ul>
</div>
  `,
    images: null,
    video: null
  },

  "project-edge-cleanup": {
    title: "Edge Cleanup Tool",
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

const artData = {
  "art-escape-game": {
    title: "Escape From Nuckinfutts Factory",
    description: `
      <p>Assets created for my Unity game "Escape from Nuckinfutts Factory" (2013). I created this as a solo project, so I modelled, textured, rigged, animated, scripted, did the VFX and lighting for everything in this project. It was quite the undertaking and even though it was never fully fleshed out, I'm still proud of what I was able to achieve solo while learning so many new concepts for the first time.</p>
    `,
    images: [
      {
        src: "http://i.imgur.com/UGUc4yz.jpg",
        caption: "Factory room overview, hero shot."
      },
      {
        src: "https://i.imgur.com/3lby5.jpg",
        caption: "Closeup of the crane, which was rigged and animated, part of the final boss fight"
      },
      {
        src: "http://i.imgur.com/6nSUBCj.jpg",
        caption: "Level 01, this a recycling facility where the player, a robot, is discarded into."
      },
      {
        src: "http://i.imgur.com/jMMIZtA.png",
        caption: "Nuckinfutts at his workbench, assembling who knows what."
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
        src: "http://i.imgur.com/DYKhtLU.jpg",
        caption: "Collage of some of the props I made"
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
        caption: "Let there be floodlight"
      },
      {
        src: "https://i.imgur.com/pcnr7.png",
        caption: "Basic hand truck, minimal texture detail"
      },
      {
        src: "https://i.imgur.com/1gRU6.png",
        caption: "Ceiling fan"
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
        src: "http://i.imgur.com/DClkapV.jpg",
        caption: "Kitchen render in Maya with mental ray"
      },
      {
        src: "http://i.imgur.com/nhb5Um2.jpg",
        caption: "Kitchen render alt"
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
        caption: "Lizard thing."
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
        caption: "Half-Life 2 mapping competition entry (winner)"
      },
      {
        src: "https://i.imgur.com/7RAEA.png",
        caption: "Random vista building for someone's mod"
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
      <p>Models created during timed competitions I used to run on a HL2 forum. (2009-2012)</p>
    `,
    images: [
      {
        src: "https://i.imgur.com/tiUt0.png",
        caption: "Conker from the N64 game. This took me about 5 hours start to finish. The challenge prompt was 'Plush'"
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
        caption: "Prompt was 'Intelligence'"
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
        caption: "2 hour modelling challenge"
      },
      {
        src: "https://i.imgur.com/bP6i3.jpg",
        caption: "First time using 3DS Max"
      },
      {
        src: "https://i.imgur.com/QcLAR.png",
        caption: "Random item"
      }
    ],
    video: null
  }
};
