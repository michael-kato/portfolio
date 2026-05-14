#version 300 es
precision highp float;

uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uMouse;

// === HELPER MACROS ===
#define rot(a)         mat2(cos( a +vec4(0,11,33,0)))  // Rotation matrix
#define linstep(m,M,x) clamp((x - m)/(M - m), 0., 1.)  // Linear interpolation clamped to [0,1]
#define disp(t)        vec2(sin(t*1.7 + uTime*0.35), cos(t*1.3 - uTime*0.32)) * 0.22  // Displacement offset

float prm1;
vec2  bsMo;

// === DISTANCE FIELD MAP (generates the tunnel structure) ===
// Returns: vec2(distance_to_surface, metadata)
vec2 map(vec3 p) {
    // Displace space based on depth
    vec2 q = p.xy - disp(p.z);
    
    // Rotate tunnel around its axis (slower rotation)
    p.xy *= rot( sin(p.z * 1.8) * .45 + uTime * .08 ); // Reduce 0.45 to rotate slower, increase to rotate faster
    
    // Add undulating motion to tunnel walls
    p.xy += 0.01 * vec2(sin(p.y*2.4 + uTime*0.42), cos(p.x*2.2 - uTime*0.38));
    
    // Fractal iteration to create cloud detail
    float d;
    float z = 1.;
    float trk = .1;
    float dspAmp = .2; // dspAmp controls cloud density/sharpness
    p *= .57;  // Scale down for fractal
    
    // Iterate to create layered cloud structure
    for(int i=0; i < 4; i++, z *= .57, trk *= 1.4 )
        p += dspAmp * sin( trk*(p.zxy*100.) ),
        d -= z * abs( dot(cos(p), sin(p.yzx)) ),
        p *= 1.93 * mat3(.33338, .56034, -.71817, -.87887, .32651, -.15323, .15162, .69596, .61339);
    
    // Base distance calculation
    d = abs(d) - 2.0;  // Increase to expand tunnel, decrease to shrink
    return vec2(d +.25,0) + dot(q,q)*vec2(.2,1);
}

// === RAY MARCHING RENDER (traverses through space to find cloud density) ===
// Ray origin (ro), ray direction (rd), accumulated color and opacity
vec4 render( in vec3 ro, in vec3 rd, float time )
{
  vec4 rez = vec4(0);  // Accumulator for final color
  const float ldst = 8.;
  vec3 lpos = vec3(disp(time + ldst)*0.5, time + ldst);
  float t = 1.5;  // Starting ray distance
  float fogT = 0.;
  
  // === RAY MARCH LOOP ===
  for(int i=0; i<100; i++)  // Iterate up to 130 steps along the ray
  {
    if(rez.a > 0.99)break;  // Stop if fully opaque

    vec3 pos = ro + t*rd;  // Current position along ray
    vec2 mpv = map(pos);  // Get distance field info
    float den = clamp(mpv.x-0.1,0.,1.)*.92;  // Cloud density (increase 1.12 for brighter clouds)
    float dn = clamp((mpv.x + 2.),0.,3.);
        
    vec4 col = vec4(0);
    // === CLOUD COLOR AND SHADING ===
    if (mpv.x > 1.6)  // Only shade if in cloud region
    {
        // Generate more varied cloud hues using multiple phase offsets
        vec3 baseHue = sin(vec3(50.0, 1.0, 2.8)
            + mpv.y * vec3(0.18, 0.10, 0.10)
            + sin(pos.z * vec3(0.38, 0.21, 0.66) + vec3(0.8, 0.4, 0.6)) * 0.5)
            * 0.5 + 0.5;
        col = vec4(baseHue, 0.1);
        col *= den * den * den;  // Apply density cubing for a more volumetric look
        col.rgb *= linstep(4., -2.5, mpv.x) * vec3(2.8, 0.5, 2.0);  // Per-channel brightness boost
        
        // Lighting calculation (fake diffuse)
        float dif = clamp((den - map(pos + .8).x) / 9., 0.001, 1.);
        dif += clamp((den - map(pos + .15).x) * 2.5, 0.001, 1.);
        // More colorful light tint for the clouds
        col.xyz *= den * (vec3(0.02, 0.05, 0.08) + 1.5 * vec3(0.16, 0.10, 0.15) * dif);
    }
    
    // === FOG BLENDING ===
    float fogC = exp(t * 0.2 - 2.2);
    col.rgba += vec4(0.06, 0.10, 0.14, 0.22) * clamp(fogC - fogT, 0., 1.);
    fogT = fogC;
    rez = rez + col*(1. - rez.a);  // Blend with accumulated color
    t += clamp(0.5 - dn*dn*.05, 0.09, 0.3);  // Adaptive step size
  }
  return clamp(rez, 0.0, 1.0);
}

#define getsat(c)  1. -  min(min(c.x, c.y), c.z) / max(max(c.x, c.y), c.z)

// Color interpolation helper
vec3 iLerp(vec3 a, vec3 b, float x) {
    vec3 ic = mix(a, b, x) + vec3(1e-6,0.,0.);
    float lgt = dot(vec3(1), ic),
          sd = abs( getsat(ic) - mix(getsat(a), getsat(b), x) );
    vec3 dir = normalize( ic*3. - lgt );
    ic += 1.5*dir*sd*lgt * dot(dir, normalize(ic));
    return ic;
}

// === MAIN IMAGE - CAMERA SETUP AND COMPOSITING ===
void mainImage( out vec4 O, vec2 u ) {	
    vec2 R = uResolution.xy, q = u/R, p = (u - 0.5*R ) / R.y;
    bsMo = clamp((0.5*R - uMouse) / R.y, vec2(-0.65), vec2(0.65));
    
    prm1 = 0.0; // Stabilize prm1 to remove procedural color/cam shifting
    float time = uTime*1.5;
    vec3 P = vec3(0.0, 0.0, time);  // Ray origin (camera position)
    
    // === TUNNEL EXIT POINT SETUP ===
    // Aim the tunnel toward a distant exit that follows the mouse pointer
    vec3 exitPoint = vec3(bsMo * vec2(3.2, 2.4), 7.0);  // Adjust 3.2, 2.4 to scale tunnel exit size
    vec3 target = normalize(exitPoint),
         rightdir = normalize(cross(target, vec3(0,1,0))),
         updir = normalize(cross(rightdir, target)),
         rightdir2 = cross(updir, target),
         D = normalize(p.x*rightdir2 + p.y*updir + target);  // Ray direction
    
    D.xy *= rot(bsMo.x * 0.18);

    vec3 C = render(P, D, time).rgb;
    
    // === DITHERING (reduces banding artifacts) ===
    float dither = (fract(sin(dot(u / uResolution.xy, vec2(12.9898,78.233)) + uTime * 12.7) * 43758.5453) - 0.5) * 0.008;
    C += dither;
    
    O = vec4(C, 1.0);
}

out vec4 outColor;
void main() {
  mainImage(outColor, gl_FragCoord.xy);
}