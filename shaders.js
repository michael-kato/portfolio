/**
 * WebGL Shader implementation for Michael Kato's portfolio
 * Based on "Protean clouds" by nimitz (@stormoid)
 * Adapted from Shadertoy: https://www.shadertoy.com/view/3l23Rh
 */

document.addEventListener('DOMContentLoaded', initShader);


const shaders = {
  'tutorial-shader-canvas': `#version 300 es
    precision mediump float;
    
    uniform vec2 uResolution;
    uniform float uTime;
    
    void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord/uResolution.xy;
    vec2 q = uv - vec2(0.3, 0.7);

    // background
    vec3 col = mix(vec3(1.0, 0.4, 0.1), vec3(1.0, 0.8, 0.3), sqrt(uv.y));
    
    float petals = 0.1*cos(atan(q.x, q.y) * 9. + 30.0*q.x+sin(uTime));
    float r = 0.2 + petals;
    col.r -= .5 - smoothstep(r, r+0.01, length(q));
    // trunk
    r = 0.015;
    r += 0.002*cos(120.0*q.y);
    r += exp(-28.0*uv.y);
    col *= 1.0 - (1.0-smoothstep(r, r+0.005, abs(q.x+-0.25*sin(2.0*q.y)))) * (1.0 - smoothstep(-0.2,0.0,q.y));

    // look I'm shading!
    vec2 sun = uv - vec2(0.9,0.9);
    sun.y *= 0.7;
    r = smoothstep(0.2, 0.2, length(sun));
    col /= r;
    
    // water
    vec2 w = uv - vec2(.5, 0.5);
    float wave = sin(uTime) * cos(sin(w.x+10.0)+sin(10.0) * w.x);
    col.b /= 1.0 - (1.0-smoothstep(wave,wave, w.y)) / (1.0 - smoothstep(sin(-0.4),sin(-0.4),w.y));

    // Output to screen
    fragColor = vec4(col,1.0);
    }

    out vec4 outColor;
    void main() {
      mainImage(outColor, gl_FragCoord.xy);
    }
`
}

function initShader() {
  const canvases = document.getElementsByTagName('canvas');
  console.info(canvases);
  for (let i=0; i < canvases.length; i++) {
    canvas = canvases[i];
    console.info(canvas);
    if (!canvas) return;

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
    console.info(canvas.id);
    const fs = shaders[canvas.id];

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
    };

    // Initialize buffers
    const buffers = initBuffers(gl);

    // Mouse tracking
    let mouseX = 0;
    let mouseY = 0;

    function updateMousePosition(e) {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = rect.height - (e.clientY - rect.top) - 1;  // flip Y for WebGL
    }

    canvas.addEventListener('mousemove', updateMousePosition);
    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      updateMousePosition(touch);
    });

    // Start animation loop
    let then = 0;
    function render(now) {
      now *= 0.001;  // convert to seconds
      const deltaTime = now - then;
      then = now;

      drawScene(gl, programInfo, buffers, now, mouseX, mouseY);
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  };

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
  gl.uniform2f(programInfo.uniformLocations.mouse, mouseX, mouseY);

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
  // Get the display size of the canvas
  const displayWidth = canvas.clientWidth;
  const displayHeight = canvas.clientHeight;

  // Check if the canvas is not the same size
  if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
    // Make the canvas the same size
    canvas.width = displayWidth;
    canvas.height = displayHeight;
  }

  return canvas.width !== displayWidth || canvas.height !== displayHeight;
}