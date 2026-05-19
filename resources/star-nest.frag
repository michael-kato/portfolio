#version 300 es
precision highp float;

uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uMouse;

// === FRACTAL PARAMETERS ===
#define iterations 15        // Fractal iteration depth (higher = more complex detail = more sparkles, lower = simpler/fewer sparkles)
#define formuparam 0.53       // Fractal formula parameter (controls the shape)

// === VOLUMETRIC RAYMARCHING PARAMETERS ===
#define volsteps 20           // Number of steps to march through the volume (fewer = less sparkle accumulation)
#define stepsize 0.1          // Distance between each volumetric step

// === CAMERA/VIEW PARAMETERS ===
#define zoom   0.800          // Camera zoom level (affects how close/far the stars appear)
#define tile   0.850          // Tiling scale (controls star spacing)
#define speed  0.0001          // Animation speed

// === BRIGHTNESS AND VISUAL CONTROLS ===
#define brightness 0.002     // *** MAIN SPARKLE CONTROL *** Lower = fewer/dimmer sparkles, Higher = more/brighter sparkles
#define darkmatter 0.300      // Darkens certain areas (reduces visibility through dense regions)
#define distfading 0.730      // How much distance fading occurs per step (higher = fades faster)
#define saturation 0.950      // Color saturation (1.0 = full color, 0.0 = grayscale)

#define rotationspeed 1.0  // Rotation speed (controls how fast the view rotates based on mouse movement)

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    // === SETUP: Normalize coordinates and create view ray ===
    vec2 uv = fragCoord.xy / uResolution.xy - 0.5;
    uv.y *= uResolution.y / uResolution.x;
    vec3 dir = vec3(uv*zoom, 1.);  // View direction
    
    float time = uTime*speed + .25;
    
    // === MOUSE CONTROL: Rotate view based on mouse position ===
    float a1 = .5 - uMouse.x/uResolution.x * rotationspeed;
    float a2 = .8 - uMouse.y/uResolution.y * rotationspeed;
    mat2 rot1 = mat2(cos(a1), sin(a1), -sin(a1), cos(a1));
    mat2 rot2 = mat2(cos(a2), sin(a2), -sin(a2), cos(a2));
    dir.xz *= rot1;
    dir.xy *= rot2;
    
    // === CAMERA: Moving through space over time ===
    vec3 from = vec3(1., .5, 0.5);
    from += vec3(time*2., time, -2.);  // Camera motion
    from.xz *= rot1;
    from.xy *= rot2;
    
    // === VOLUMETRIC RAYMARCHING LOOP ===
    float s = 0.1;             // Current distance along ray
    float fade = 1.;           // Fade accumulator
    vec3 v = vec3(0.);         // Final color accumulator
    
    for (int r = 0; r < volsteps; r++) {  // For each volumetric step
        vec3 p = from + s*dir*.5;
        p = abs(vec3(tile) - mod(p, vec3(tile*2.)));  // Tile the space
        
        // === FRACTAL ITERATION (generates the star structure) ===
        float pa = 0.;
        float a = 0.;
        for (int i = 0; i < iterations; i++) {  // Iterate the fractal formula
            p = abs(p)/dot(p,p) - formuparam;
            a += abs(length(p)-pa);  // Accumulate fractal detail
            pa = length(p);
        }
        
        // === SHADING: Dark matter and brightness ===
        float dm = max(0., darkmatter - a*a*.001);
        a *= a*a;  // Cube the accumulation for visual effect

        if (r > 6) fade *= 1. - dm;  // Apply dark matter darkening
        
        v += fade;  // Add base fade
        // *** THIS LINE CREATES THE SPARKLES ***
        // Reduce brightness to reduce sparkles; increase to enhance them
        v += vec3(s, s*s, s*s*s*s) * a * brightness * fade;
        
        fade *= distfading;  // Apply distance fade
        s += stepsize;  // Step forward along ray
    }
    
    // === FINAL COMPOSITING ===
    v = mix(vec3(length(v)), v, saturation);  // Apply saturation
    fragColor = vec4(v * 0.01, 1.);  // Final output (0.01 is a scaling factor)
}

out vec4 outColor;
void main() {
  mainImage(outColor, gl_FragCoord.xy);
}