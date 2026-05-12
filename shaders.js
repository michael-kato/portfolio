/**
 * WebGL Shader implementation for Michael Kato's portfolio
 * Based on "Protean clouds" by nimitz (@stormoid)
 * Adapted from Shadertoy: https://www.shadertoy.com/view/3l23Rh
 */

document.addEventListener('DOMContentLoaded', () => {
  // Ensure canvas is properly positioned
  const bgCanvas = document.getElementById('background-canvas');
  if (bgCanvas) {
    bgCanvas.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -100; pointer-events: none; display: block; border: none; margin: 0; padding: 0;';
  }
  initShader();
});


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
`,
  'background-canvas': `#version 300 es
    precision highp float;
    
    uniform vec2 uResolution;
    uniform float uTime;
    uniform vec2 uMouse;

    #define rot(a)         mat2(cos( a +vec4(0,11,33,0)))
    #define linstep(m,M,x) clamp((x - m)/(M - m), 0., 1.)
    #define disp(t)        vec2(sin(t*1.7 + uTime*0.35), cos(t*1.3 - uTime*0.32)) * 0.22

    float prm1;
    vec2  bsMo;

    vec2 map(vec3 p) {
        vec2 q = p.xy - disp(p.z);
        p.xy *= rot( sin(p.z * 1.8) * .45 + uTime * .08 ); // much slower tunnel rotation
        p.xy += 0.08 * vec2(sin(p.y*2.4 + uTime*0.42), cos(p.x*2.2 - uTime*0.38));
        float d, z = 1., trk = z, dspAmp = .22; // stronger displacement amplitude
        p *= .61;
        for(int i=0; i < 4; i++, z *= .57, trk *= 1.4 )
            p += dspAmp * sin( trk*(p.zxy*.75) ), // Removed uTime to stop churning
            d -= z * abs( dot(cos(p), sin(p.yzx)) ),
            p *= 1.93 * mat3(.33338, .56034, -.71817, -.87887, .32651, -.15323, .15162, .69596, .61339);
        d = abs(d) - 2.2; 
        return vec2(d +.25,0) + dot(q,q)*vec2(.2,1);
    }

    vec4 render( vec3 ro, vec3 rd, float time ) {
        vec4 rez = vec4(0.0);
        float ldst = 8., t = 1.5, T = time + ldst, fogT = 0.0;
        for(int i=0; rez.a < .99 && i < 50; i++ ) {
            vec3  pos = ro + t*rd;
            vec2  mpv = map(pos);
            float den = clamp(mpv.x - .3, 0.,1.)*1.12,
                   dn = clamp(mpv.x + 2., 0.,3.);
            vec4 C = vec4(0.0);
            if (mpv.x > .6) { 
                vec3 base = sin(vec3(4.0,1.4,2.9) + mpv.y*0.24 + sin(pos.z*0.62)*0.9 + vec3(0.0,1.9,3.6))*0.5 + 0.5;
                vec3 warm = vec3(1.0,0.72,0.38);
                vec3 cool = vec3(0.25,0.55,0.95);
                vec3 palette = mix(cool * base, warm * base, smoothstep(0.0, 1.0, mpv.y) * 0.85 + 0.15);
                C = vec4(palette, .08);
                C *= den*den*den;
                C.rgb *= linstep(4.,-2.5, mpv.x) * 3.0;
                C.rgb = mix(C.rgb, vec3(1.0,0.78,0.45), smoothstep(-0.3, 0.8, mpv.y)*0.55);
                C.rgb = mix(C.rgb, vec3(0.85,0.28,0.55), smoothstep(0.4, 1.0, mpv.x)*0.35);
                float dif = clamp((den - map(pos+.8 ).x)/9. , .001, 1. )
                           + clamp((den - map(pos+.35).x)/2.5, .001, 1. );
                C.xyz *= den*( vec3(.005,.03,.04) + 1.2*dif*vec3(.02,.03,.02));
            }
            float fogC = exp(t*.2 - 2.2);
            C += vec4(.03,.05,.05, .05) *clamp(fogC-fogT, 0., 1. );
            fogT = fogC;
            rez += C *(1. - rez.a);
            t += clamp(.5 - dn*dn*.05, .09, .3);
        }
        return rez;
    }

    #define getsat(c)  1. -  min(min(c.x, c.y), c.z) / max(max(c.x, c.y), c.z)

    vec3 iLerp(vec3 a, vec3 b, float x) {
        vec3 ic = mix(a, b, x) + vec3(1e-6,0.,0.);
        float lgt = dot(vec3(1), ic),
              sd = abs( getsat(ic) - mix(getsat(a), getsat(b), x) );
        vec3 dir = normalize( ic*3. - lgt );
        ic += 1.5*dir*sd*lgt * dot(dir, normalize(ic));
        return ic;
    }

    void mainImage( out vec4 O, vec2 u ) {	
        vec2 R = uResolution.xy, q = u/R, p = (u - 0.5*R ) / R.y;
        bsMo = clamp((0.5*R - uMouse) / R.y, vec2(-0.65), vec2(0.65));
        
        prm1 = 0.0; // Stabilize prm1 to remove procedural color/cam shifting
        float time = uTime*1.5;
        vec3 P = vec3(0.0, 0.0, time);
        
        // Aim the tunnel toward a distant exit that follows the pointer.
        vec3 exitPoint = vec3(bsMo * vec2(3.2, 2.4), 7.0);
        vec3 target = normalize(exitPoint),
             rightdir = normalize(cross(target, vec3(0,1,0))),
             updir = normalize(cross(rightdir, target)),
             rightdir2 = cross(updir, target),
             D = normalize(p.x*rightdir2 + p.y*updir + target);
        
        D.xy *= rot(bsMo.x * 0.18);

        vec3 C = render(P, D, time).rgb;
        float center = smoothstep(0.7, 0.0, length(p));
        C += vec3(0.18, 0.24, 0.36) * center;
        C *= 1.08;
        C = iLerp(C, C.bgr, min(prm1,.95));
        C = pow( C, vec3(0.75,0.8,0.85) ) * vec3(0.82,0.8,0.78);
        float dither = (fract(sin(dot(u / uResolution.xy, vec2(12.9898,78.233)) + uTime * 12.7) * 43758.5453) - 0.5) * 0.008;
        C += dither;
        C *= pow( 16.*q.x*q.y*(1.-q.x)*(1.-q.y), .12)*.7+.3;
        O = vec4(C, 1.0);
    }

    out vec4 outColor;
    void main() {
      mainImage(outColor, gl_FragCoord.xy);
    }
`
};

const backgroundCanvasShaders = [
  shaders['background-canvas'],
`#version 300 es
    precision highp float;

    uniform vec2 uResolution;
    uniform float uTime;
    uniform vec2 uMouse;

    #define iterations 17
    #define formuparam 0.53

    #define volsteps 20
    #define stepsize 0.1

    #define zoom   0.800
    #define tile   0.850
    #define speed  0.010 

    #define brightness 0.0015
    #define darkmatter 0.300
    #define distfading 0.730
    #define saturation 0.850

    void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
        vec2 uv = fragCoord.xy / uResolution.xy - 0.5;
        uv.y *= uResolution.y / uResolution.x;
        vec3 dir = vec3(uv*zoom,1.);
        float time = uTime*speed + .25;
        float a1 = .5 + uMouse.x/uResolution.x*2.;
        float a2 = .8 + uMouse.y/uResolution.y*2.;
        mat2 rot1 = mat2(cos(a1), sin(a1), -sin(a1), cos(a1));
        mat2 rot2 = mat2(cos(a2), sin(a2), -sin(a2), cos(a2));
        dir.xz *= rot1;
        dir.xy *= rot2;
        vec3 from = vec3(1., .5, 0.5);
        from += vec3(time*2., time, -2.);
        from.xz *= rot1;
        from.xy *= rot2;
        float s = 0.1;
        float fade = 1.;
        vec3 v = vec3(0.);
        for (int r = 0; r < volsteps; r++) {
            vec3 p = from + s*dir*.5;
            p = abs(vec3(tile) - mod(p, vec3(tile*2.)));
            float pa = 0.;
            float a = 0.;
            for (int i = 0; i < iterations; i++) {
                p = abs(p)/dot(p,p) - formuparam;
                a += abs(length(p)-pa);
                pa = length(p);
            }
            float dm = max(0., darkmatter - a*a*.001);
            a *= a*a;
            if (r > 6) fade *= 1. - dm;
            v += fade;
            v += vec3(s, s*s, s*s*s*s) * a * brightness * fade;
            fade *= distfading;
            s += stepsize;
        }
        v = mix(vec3(length(v)), v, saturation);
        fragColor = vec4(v * 0.01, 1.);
    }
    out vec4 outColor;
    void main() {
      mainImage(outColor, gl_FragCoord.xy);
    }
  `
];

function initShader() {
  const canvases = document.getElementsByTagName('canvas');
  console.info(canvases);
  for (let i=0; i < canvases.length; i++) {
    const canvas = canvases[i];
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
    let fs;
    if (canvas.id === 'background-canvas') {
      const index = Math.floor(Math.random() * backgroundCanvasShaders.length);
      console.info('Selected background shader', index);
      fs = backgroundCanvasShaders[index];
    } else {
      fs = shaders[canvas.id];
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
    };

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

      // Lazy interpolation (LERP) for smooth following
      const smoothness = 0.07; // Slightly more responsive but still "lazy"
      currentMouseX += (targetMouseX - currentMouseX) * smoothness;
      currentMouseY += (targetMouseY - currentMouseY) * smoothness;

      drawScene(gl, programInfo, buffers, now, currentMouseX, currentMouseY);
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
