/**
 * WebGL Shader implementation for Michael Kato's portfolio
 * Based on "Protean clouds" by nimitz (@stormoid)
 * Adapted from Shadertoy: https://www.shadertoy.com/view/3l23Rh
 */

let bgState = null;
let backgroundShaderKeys = [];
const shaders = {};

document.addEventListener('DOMContentLoaded', async () => {
  // Ensure canvas is properly positioned
  const bgCanvas = document.getElementById('background-canvas');
  if (bgCanvas) {
    bgCanvas.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -100; pointer-events: none; display: block; border: none; margin: 0; padding: 0;';
  }

  // Load external shader files before initializing
  await loadShaders();

  // Initialize keys for the background switcher
  backgroundShaderKeys = Object.keys(shaders).filter(key => key !== 'tutorial-shader-canvas');

  initShader();
  setupShaderControls();
});

/**
 * Ingests shader files as strings
 */
async function loadShaders() {
  const shaderFiles = {
    'tutorial-shader-canvas': 'resources/tutorial.frag',
    'protean-clouds': 'resources/protean-clouds.frag',
    'star-nest': 'resources/star-nest.frag'
  };

  // Use absolute root-relative paths for assets to ensure they load on all variants/subpages
  const script = document.querySelector('script[src*="shaders.js"]');
  const baseUrl = script ? script.src.split('shaders.js')[0] : '/';

  const promises = Object.entries(shaderFiles).map(async ([key, path]) => {
    try {
      const response = await fetch(baseUrl + path);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      shaders[key] = await response.text();
    } catch (e) {
      console.error(`Failed to load shader: ${path}`, e);
    }
  });

  await Promise.all(promises);
};

function initShader() {
  const canvases = document.getElementsByTagName('canvas');
  console.info(canvases);
  for (let i=0; i < canvases.length; i++) {
    const canvas = canvases[i];
    console.info(canvas);
    if (!canvas) continue;

    const gl = canvas.getContext('webgl2');
    if (!gl) {
      console.warn('WebGL2 not supported, shader demo will not be displayed');
      return;
    }

    // Vertex shader program
    const vs = `#version 300 es
      in vec4 aPosition;
      
      void main() {
        gl_Position = aPosition;
      }
    `;
    let fs, currentKey;
    if (canvas.id === 'background-canvas') {
      const randomIndex = Math.floor(Math.random() * backgroundShaderKeys.length);
      currentKey = backgroundShaderKeys[randomIndex];
      fs = shaders[currentKey];
    } else {
      currentKey = canvas.id;
      fs = shaders[currentKey];
    }

    if (!fs) continue; // Skip if we don't have a shader defined for this canvas ID

    // Initialize shader program
    const shaderProgram = initShaderProgram(gl, vs, fs);
    if (!shaderProgram) return;

    // Collect all shader info
    const programInfo = {
      program: shaderProgram,
      attribLocations: {
        position: gl.getAttribLocation(shaderProgram, 'aPosition'),
      },
      uniformLocations: {
        resolution: gl.getUniformLocation(shaderProgram, 'uResolution'),
        time: gl.getUniformLocation(shaderProgram, 'uTime'),
        mouse: gl.getUniformLocation(shaderProgram, 'uMouse'),
      },
      currentKey: currentKey
    };

    if (canvas.id === 'background-canvas') {
      bgState = {
        gl,
        vs,
        programInfo,
        currentIndex: backgroundShaderKeys.indexOf(currentKey)
      };
    }

    // Initialize buffers
    const buffers = initBuffers(gl);

    // Start animation loop
    // Use window coordinates for the listeners to bypass 'pointer-events: none'
    resizeCanvasToDisplaySize(canvas);

    let targetMouseX = canvas.width / 2;
    let targetMouseY = canvas.height / 2;
    let currentMouseX = targetMouseX;
    let currentMouseY = targetMouseY;

    function updateMousePosition(e) {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width || 1;
      const scaleY = canvas.height / rect.height || 1;
      targetMouseX = Math.min(Math.max((e.clientX - rect.left) * scaleX, 0), canvas.width);
      targetMouseY = Math.min(Math.max((rect.bottom - e.clientY) * scaleY, 0), canvas.height);
    }

    window.addEventListener('pointermove', updateMousePosition);
    window.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      if (touch) updateMousePosition(touch);
    }, { passive: true });

    let then = 0;
    function render(now) {
      now *= 0.001;  // convert to seconds
      const deltaTime = now - then;
      then = now;

      let smoothness;
      if(programInfo.currentKey == "star-nest") {
        smoothness = 0.5;
      } else {
        smoothness = 0.008; // Strong lag for smooth motion
      }

      currentMouseX += (targetMouseX - currentMouseX) * smoothness;
      currentMouseY += (targetMouseY - currentMouseY) * smoothness;

      drawScene(gl, programInfo, buffers, now, currentMouseX, currentMouseY);
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  };

}

/**
 * Setup click handlers for the nav buttons
 */
function setupShaderControls() {
  let prevBtn = document.getElementById('prev-shader');
  let nextBtn = document.getElementById('next-shader');

  // If buttons are missing (e.g. on Jekyll pages), inject them dynamically
  if (!prevBtn || !nextBtn) {
    const nav = document.querySelector('nav');
    if (nav) {
      const ul = nav.querySelector('ul');
      if (ul) {
        if (!prevBtn) {
          prevBtn = document.createElement('button');
          prevBtn.id = 'prev-shader';
          prevBtn.className = 'shader-toggle-btn';
          prevBtn.title = 'Previous Background';
          prevBtn.setAttribute('aria-label', 'Previous Background');
          prevBtn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>';
          nav.insertBefore(prevBtn, ul);
        }
        if (!nextBtn) {
          nextBtn = document.createElement('button');
          nextBtn.id = 'next-shader';
          nextBtn.className = 'shader-toggle-btn';
          nextBtn.title = 'Next Background';
          nextBtn.setAttribute('aria-label', 'Next Background');
          nextBtn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>';
          nav.appendChild(nextBtn);
        }
      }
    }
  }

  if (prevBtn) {
    prevBtn.onclick = (e) => { e.preventDefault(); switchBackgroundShader(-1); };
  }
  if (nextBtn) {
    nextBtn.onclick = (e) => { e.preventDefault(); switchBackgroundShader(1); };
  }
}

/**
 * Switch background shader to previous or next in the list
 */
function switchBackgroundShader(direction) {
  if (!bgState) return;
  
  const nextIndex = (bgState.currentIndex + direction + backgroundShaderKeys.length) % backgroundShaderKeys.length;
  const newKey = backgroundShaderKeys[nextIndex];
  const fs = shaders[newKey];
  
  const newProgram = initShaderProgram(bgState.gl, bgState.vs, fs);
  if (!newProgram) return;
  
  // Update programInfo in place so the render loop picks it up
  bgState.programInfo.program = newProgram;
  bgState.currentIndex = nextIndex;
  bgState.programInfo.currentKey = newKey;
  bgState.programInfo.uniformLocations = {
    resolution: bgState.gl.getUniformLocation(newProgram, 'uResolution'),
    time: bgState.gl.getUniformLocation(newProgram, 'uTime'),
    mouse: bgState.gl.getUniformLocation(newProgram, 'uMouse'),
  };
  
  console.info('Switched background shader to:', newKey);
}

/**
 * Initialize shader program with vertex and fragment shaders
 */
function initShaderProgram(gl, vs, fs) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vs);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fs);

  if (!vertexShader || !fragmentShader) return null;

  // Create the shader program
  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // Check if it linked
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

/**
 * Load and compile a shader
 */
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  // Check if compilation succeeded
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

/**
 * Initialize vertex buffers for a fullscreen quad
 */
function initBuffers(gl) {
  // Create a buffer for position
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Create full-screen quad positions
  const positions = [
    -1.0, 1.0,
    1.0, 1.0,
    -1.0, -1.0,
    1.0, -1.0,
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  return {
    position: positionBuffer,
  };
}

/**
 * Draw the scene
 */
function drawScene(gl, programInfo, buffers, time, mouseX, mouseY) {
  // Resize canvas to match display size
  resizeCanvasToDisplaySize(gl.canvas);

  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Clear canvas
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Set shader program and uniforms
  gl.useProgram(programInfo.program);

  // Set uniforms
  gl.uniform2f(programInfo.uniformLocations.resolution, gl.canvas.width, gl.canvas.height);
  gl.uniform1f(programInfo.uniformLocations.time, time);
  gl.uniform2f(programInfo.uniformLocations.mouse, mouseX, mouseY); // Pass mouse coordinates to shader

  // Set up position attribute
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
  gl.vertexAttribPointer(
    programInfo.attribLocations.position,
    2,                  // 2 components per vertex
    gl.FLOAT,           // type
    false,              // don't normalize
    0,                  // stride
    0                   // offset
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.position);

  // Draw the quad
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

/**
 * Resize canvas to match display size
 */
function resizeCanvasToDisplaySize(canvas) {
  // Set this to a value between 0 and 1 to downsample (e.g., 0.5 = half resolution)
  const multiplier = 0.5;

  // Get the display size of the canvas
  const displayWidth = Math.floor(canvas.clientWidth * multiplier);
  const displayHeight = Math.floor(canvas.clientHeight * multiplier);

  // Check if the canvas is not the same size
  if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
    // Make the canvas the same size
    canvas.width = displayWidth;
    canvas.height = displayHeight;
  }

  return canvas.width !== displayWidth || canvas.height !== displayHeight;
}
