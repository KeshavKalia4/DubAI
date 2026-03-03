import { useEffect, useRef } from 'react';
import { cn } from '@/components/ui/utils';

interface FlowFieldBackgroundProps {
  className?: string;
  color?: string;
  particleCount?: number;
  speed?: number;
  trailOpacity?: number;
}

export function FlowFieldBackground({
  className,
  color = '#4b2e83',
  particleCount = 200,
  speed = 1.5,
  trailOpacity = 0.07,
}: FlowFieldBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;
    const mouse = { x: -9999, y: -9999 };

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const parseHex = (hex: string) => {
      const c = hex.replace('#', '');
      return {
        r: parseInt(c.slice(0, 2), 16),
        g: parseInt(c.slice(2, 4), 16),
        b: parseInt(c.slice(4, 6), 16),
      };
    };
    const rgb = parseHex(color.startsWith('#') ? color : '#4b2e83');

    type Particle = {
      x: number; y: number; vx: number; vy: number;
      life: number; maxLife: number; size: number;
    };

    const spawn = (): Particle => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: 0, vy: 0,
      life: Math.random() * 100,
      maxLife: 100 + Math.random() * 150,
      size: 0.8 + Math.random() * 1.4,
    });

    const particles: Particle[] = Array.from({ length: particleCount }, spawn);

    const fieldAngle = (x: number, y: number) => {
      const s = 0.0025;
      return (
        Math.sin(x * s + t * 0.25) * Math.PI * 2 +
        Math.cos(y * s * 1.3 + t * 0.18) * Math.PI +
        Math.sin((x - y) * s * 0.6 + t * 0.1) * Math.PI * 0.5
      );
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onMouseLeave = () => { mouse.x = -9999; mouse.y = -9999; };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);

    const REPEL_R = 90;
    const MAX_SPD = speed * 2.5;

    const tick = () => {
      ctx.fillStyle = `rgba(8,6,15,${trailOpacity})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.life++;

        if (p.life >= p.maxLife) {
          p.x = Math.random() * canvas.width;
          p.y = Math.random() * canvas.height;
          p.vx = 0; p.vy = 0;
          p.life = 0;
          p.maxLife = 100 + Math.random() * 150;
          continue;
        }

        const a = fieldAngle(p.x, p.y);
        p.vx = p.vx * 0.88 + Math.cos(a) * speed * 0.12;
        p.vy = p.vy * 0.88 + Math.sin(a) * speed * 0.12;

        // Mouse repulsion
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < REPEL_R * REPEL_R && d2 > 0) {
          const d = Math.sqrt(d2);
          const f = (1 - d / REPEL_R) * 3;
          p.vx += (dx / d) * f;
          p.vy += (dy / d) * f;
        }

        // Cap speed
        const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (spd > MAX_SPD) {
          p.vx = (p.vx / spd) * MAX_SPD;
          p.vy = (p.vy / spd) * MAX_SPD;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Wrap edges
        if (p.x < 0) p.x = canvas.width;
        else if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        else if (p.y > canvas.height) p.y = 0;

        const lr = p.life / p.maxLife;
        const alpha = Math.sin(lr * Math.PI) * 0.55;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha})`;
        ctx.fill();
      }

      t += 0.004;
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [color, particleCount, speed, trailOpacity]);

  return (
    <canvas
      ref={canvasRef}
      className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}
      aria-hidden="true"
    />
  );
}
