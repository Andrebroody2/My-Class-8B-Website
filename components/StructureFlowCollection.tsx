'use client';

import React, { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import * as THREE from 'three';

export type EffectMode = 'dark' | 'light';

export type StructureFlowVariant =
  | 'fluid-field'
  | 'neon'
  | 'luminaWeaversCloth'
  | 'julianVanceNebula'
  | 'nexusUnifiedFlow'
  | 'emberStorm'
  | 'engravedCertificate';

export type StructureFlowCollectionProps = {
  variant?: StructureFlowVariant;
  mode?: EffectMode;
  hue?: number;
  saturation?: number;
  brightness?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

export const NEUFORM_CRAFT_DEFAULTS = {
  hue: 0,
  saturation: 1.0,
  brightness: 1.0,
} as const;

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

// Exact authored vertexShader from src/shaders/neuform-isolated/sources/aura-ui-fluid.html
export const AURA_FLUID_VERTEX_SHADER = `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

// Exact authored fragmentShader from src/shaders/neuform-isolated/sources/aura-ui-fluid.html
export const AURA_FLUID_FRAGMENT_SHADER = `
  uniform float u_time;
  uniform vec2 u_resolution;

  // Compact 2D Simplex Noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
  
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    uv.x *= u_resolution.x / u_resolution.y;

    vec3 baseColor = vec3(0.012, 0.012, 0.02);
    vec2 st = uv * 0.7;
    st += vec2(snoise(st + u_time * 0.05), snoise(st - u_time * 0.05)) * 0.3;

    float beam = smoothstep(0.1, 0.8, snoise(vec2(st.x + st.y * 1.5 - u_time * 0.15, u_time * 0.02)));
    vec3 glow = mix(vec3(0.15, 0.25, 0.85), vec3(0.4, 0.2, 0.9), snoise(uv * 1.5 + u_time * 0.1) * 0.5 + 0.5);

    gl_FragColor = vec4(baseColor + (glow * beam * 0.7), 1.0);
  }
`;

export function StructureFlowCollection({
  variant = 'fluid-field',
  mode = 'dark',
  hue = NEUFORM_CRAFT_DEFAULTS.hue,
  saturation = NEUFORM_CRAFT_DEFAULTS.saturation,
  brightness = NEUFORM_CRAFT_DEFAULTS.brightness,
  className = '',
  style,
  children,
}: StructureFlowCollectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasMountRef = useRef<HTMLDivElement>(null);

  const safeMode: EffectMode = mode === 'light' ? 'light' : 'dark';
  const safeHue = clamp(hue, -180, 180);
  const safeSaturation = clamp(saturation, 0, 2);
  const safeBrightness = clamp(brightness, 0.35, 1.65);

  const filter =
    safeHue === 0 && safeSaturation === 1 && safeBrightness === 1
      ? undefined
      : `hue-rotate(${safeHue}deg) saturate(${safeSaturation}) brightness(${safeBrightness})`;

  useEffect(() => {
    const mountEl = canvasMountRef.current;
    const hostEl = containerRef.current;
    if (!mountEl || !hostEl) return;

    const isSoftwareGl = (() => {
      try {
        const probe = document.createElement('canvas');
        const gl = probe.getContext('webgl2') || probe.getContext('webgl');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    const width = Math.max(hostEl.clientWidth, 300);
    const height = Math.max(hostEl.clientHeight, 180);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }

    const pixelRatio = isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height);
    renderer.domElement.id = 'bg-canvas';
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';

    mountEl.innerHTML = '';
    mountEl.appendChild(renderer.domElement);

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const scene = new THREE.Scene();

    const geometry = new THREE.PlaneGeometry(2, 2);
    const uniforms = {
      u_time: { value: 0.0 },
      u_resolution: {
        value: new THREE.Vector2(width * pixelRatio, height * pixelRatio),
      },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader: AURA_FLUID_VERTEX_SHADER,
      fragmentShader: AURA_FLUID_FRAGMENT_SHADER,
      uniforms,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let frameId = 0;
    let isDisposed = false;
    let isInViewport = true;
    let isLoopRunning = false;
    const startTimeMs = performance.now();

    function afterDraw(cb: () => void) {
      if (isDisposed || !isInViewport || document.hidden) {
        isLoopRunning = false;
        return;
      }
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (gl && typeof gl.fenceSync === 'function') {
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          if (isDisposed || !isInViewport || document.hidden) {
            if (sync) gl.deleteSync(sync);
            isLoopRunning = false;
            return;
          }
          const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
          if (state === gl.UNSIGNALED) {
            frameId = window.setTimeout(poll, 5);
          } else {
            if (sync) gl.deleteSync(sync);
            frameId = window.setTimeout(cb, 80);
          }
        };
        frameId = window.setTimeout(poll, 5);
      } else {
        frameId = window.setTimeout(cb, 80);
      }
    }

    function animate() {
      if (isDisposed || !isInViewport || document.hidden) {
        isLoopRunning = false;
        return;
      }
      isLoopRunning = true;
      uniforms.u_time.value = (performance.now() - startTimeMs) / 1000;
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(animate);
      } else {
        frameId = requestAnimationFrame(animate);
      }
    }

    const startLoopIfVisible = () => {
      if (!isDisposed && isInViewport && !document.hidden && !isLoopRunning) {
        animate();
      }
    };

    startLoopIfVisible();

    const handleResize = () => {
      if (!hostEl || isDisposed) return;
      const w = Math.max(hostEl.clientWidth, 300);
      const h = Math.max(hostEl.clientHeight, 180);
      renderer.setSize(w, h);
      uniforms.u_resolution.value.set(w * pixelRatio, h * pixelRatio);
    };

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => handleResize());
      resizeObserver.observe(hostEl);
    }

    let intersectionObserver: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined') {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (!entry) return;
          isInViewport = entry.isIntersecting;
          if (isInViewport) {
            startLoopIfVisible();
          }
        },
        { threshold: 0.01 }
      );
      intersectionObserver.observe(hostEl);
    }

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        startLoopIfVisible();
      }
    };

    window.addEventListener('resize', handleResize, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      isDisposed = true;
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      data-mode={safeMode}
      data-variant={variant}
      data-hue={String(safeHue)}
      data-saturation={safeSaturation.toFixed(2)}
      data-brightness={safeBrightness.toFixed(2)}
      data-testid="structure-flow-fluid-field"
      className={`threeui-mount relative w-full h-full overflow-hidden bg-[#030306] ${className}`}
      style={{
        background: '#030306',
        willChange: 'transform',
        ...style,
      }}
    >
      {/* WebGL Fluid Shader Canvas Container with Hue/Saturation/Brightness Filter */}
      <div
        ref={canvasMountRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full"
        style={{ filter }}
      />

      {/* Exact Authored Texture Layer 1: Fractal Noise Grain Overlay from aura-ui-fluid.html */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-1 opacity-[0.08]"
        style={{
          mixBlendMode: 'overlay',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Exact Authored Texture Layer 2: 45deg Blueprint Grid from aura-ui-fluid.html */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-1 opacity-20"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 12px)',
        }}
      />

      {/* Optional foreground content layered over the Fluid Field */}
      {children && <div className="relative z-10 h-full w-full">{children}</div>}
    </div>
  );
}

export const FluidFieldBackground = StructureFlowCollection;

export function Scene() {
  return (
    <div className="shader-frame relative w-full h-full min-h-[320px]">
      <StructureFlowCollection
        variant="fluid-field"
        hue={0}
        saturation={1.0}
        brightness={1.0}
      />
    </div>
  );
}
