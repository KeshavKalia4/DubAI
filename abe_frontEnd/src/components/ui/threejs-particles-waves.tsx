import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { cn } from '@/lib/utils';

export interface ParticleWavesConfig {
  density?: number;
  speed?: number;
  amplitude?: number;
  separation?: number;
  particleColor?: string;
}

interface ParticleWavesProps extends ParticleWavesConfig {
  className?: string;
}

export function ParticleWaves({
  className,
  density = 40,
  speed = 0.08,
  amplitude = 40,
  separation = 90,
  particleColor = '#b7a57a',
}: ParticleWavesProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Refs for values that the animation loop reads every frame — update without remount
  const speedRef      = useRef(speed);
  const amplitudeRef  = useRef(amplitude);
  const densityRef    = useRef(density);
  const separationRef = useRef(separation);
  const colorRef      = useRef(particleColor);

  // Keep refs in sync with props
  useEffect(() => { speedRef.current     = speed;     }, [speed]);
  useEffect(() => { amplitudeRef.current = amplitude; }, [amplitude]);

  // Recreate material when colour changes
  const materialRef  = useRef<THREE.SpriteMaterial | null>(null);
  const particlesRef = useRef<THREE.Sprite[]>([]);
  const sceneRef     = useRef<THREE.Scene | null>(null);

  useEffect(() => {
    colorRef.current = particleColor;
    const mat = buildMaterial(particleColor);
    materialRef.current = mat;
    particlesRef.current.forEach(p => { p.material = mat; });
  }, [particleColor]);

  // Recreate grid when density / separation changes
  useEffect(() => {
    densityRef.current    = density;
    separationRef.current = separation;
    if (!sceneRef.current || !materialRef.current) return;
    rebuildGrid(sceneRef.current, materialRef.current, particlesRef, density, separation);
  }, [density, separation]);

  // Mount / unmount
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const w = el.clientWidth;
    const h = el.clientHeight;

    const scene    = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(50, w / h, 1, 10000);
    camera.position.set(0, 700, 900);
    camera.lookAt(scene.position);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const mat = buildMaterial(colorRef.current);
    materialRef.current = mat;
    rebuildGrid(scene, mat, particlesRef, densityRef.current, separationRef.current);

    // Mouse
    const mouse = { x: 0, y: 0 };
    const half  = { x: w / 2, y: h / 2 };
    const onMouse = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      mouse.x = e.clientX - rect.left - half.x;
      mouse.y = e.clientY - rect.top  - half.y;
    };
    el.addEventListener('mousemove', onMouse);

    // Resize
    const ro = new ResizeObserver(() => {
      const nw = el.clientWidth;
      const nh = el.clientHeight;
      half.x = nw / 2;
      half.y = nh / 2;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    });
    ro.observe(el);

    // Animation loop
    let count = 0;
    let rafId: number;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const d = densityRef.current;
      const a = amplitudeRef.current;

      camera.position.x += (mouse.x * 0.3 - camera.position.x) * 0.04;
      camera.position.y += (-mouse.y * 0.2 + 700 - camera.position.y) * 0.04;
      camera.lookAt(scene.position);

      let i = 0;
      for (let ix = 0; ix < d; ix++) {
        for (let iy = 0; iy < d; iy++) {
          const p = particlesRef.current[i++];
          if (!p) continue;
          p.position.y =
            -300 +
            Math.sin((ix + count) * 0.3) * a +
            Math.sin((iy + count) * 0.5) * a;
          const s =
            (Math.sin((ix + count) * 0.3) + 1) * 1.5 +
            (Math.sin((iy + count) * 0.5) + 1) * 1.5;
          p.scale.setScalar(Math.max(1, s * 2));
        }
      }

      renderer.render(scene, camera);
      count += speedRef.current;
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      el.removeEventListener('mousemove', onMouse);
      particlesRef.current.forEach(p => scene.remove(p));
      particlesRef.current = [];
      el.removeChild(renderer.domElement);
      renderer.dispose();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={containerRef} className={cn('w-full h-full', className)} aria-hidden="true" />
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function buildMaterial(color: string): THREE.SpriteMaterial {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(16, 16, 12, 0, Math.PI * 2);
  ctx.fill();
  const texture = new THREE.CanvasTexture(canvas);
  return new THREE.SpriteMaterial({ map: texture, transparent: true });
}

function rebuildGrid(
  scene: THREE.Scene,
  material: THREE.SpriteMaterial,
  particlesRef: React.MutableRefObject<THREE.Sprite[]>,
  density: number,
  separation: number,
) {
  particlesRef.current.forEach(p => scene.remove(p));
  particlesRef.current = [];
  for (let ix = 0; ix < density; ix++) {
    for (let iy = 0; iy < density; iy++) {
      const p = new THREE.Sprite(material);
      p.position.set(
        ix * separation - (density * separation) / 2,
        -300,
        iy * separation - (density * separation) / 2,
      );
      p.scale.setScalar(8);
      particlesRef.current.push(p);
      scene.add(p);
    }
  }
}
