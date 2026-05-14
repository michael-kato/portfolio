#version 300 es
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