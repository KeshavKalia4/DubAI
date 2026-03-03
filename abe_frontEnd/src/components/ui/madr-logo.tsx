import { useEffect, useId, useRef } from 'react';

// Stars trace the letter M within a 32×32 mark
// Path: bottom-left up → top-left → diagonal down to middle dip → diagonal up to top-right → down to bottom-right
const STARS = [
  { x: 16, y: 20, r: 2.4, tier: 'core'   }, // 0 — middle dip of M (core, animated)
  { x:  5, y:  5, r: 1.8, tier: 'bright' }, // 1 — top-left peak
  { x: 27, y:  5, r: 1.8, tier: 'bright' }, // 2 — top-right peak
  { x:  5, y: 27, r: 1.6, tier: 'bright' }, // 3 — bottom-left foot
  { x: 27, y: 27, r: 1.6, tier: 'bright' }, // 4 — bottom-right foot
  { x:  5, y: 16, r: 1.2, tier: 'mid'    }, // 5 — left vertical mid
  { x: 11, y: 13, r: 1.2, tier: 'mid'    }, // 6 — left diagonal mid
  { x: 21, y: 13, r: 1.2, tier: 'mid'    }, // 7 — right diagonal mid
  { x: 27, y: 16, r: 1.2, tier: 'mid'    }, // 8 — right vertical mid
] as const;

const EDGES: [number, number][] = [
  [3, 5], [5, 1],   // left vertical stroke (foot → peak)
  [1, 6], [6, 0],   // left diagonal (top-left ↘ middle dip)
  [0, 7], [7, 2],   // right diagonal (middle dip ↗ top-right)
  [2, 8], [8, 4],   // right vertical stroke (peak → foot)
];

const TIER_OPACITY: Record<string, number> = {
  core: 1, bright: 0.85, mid: 0.6, dim: 0.4, faint: 0.25,
};

interface MadrLogoProps {
  /** Pixel height of the mark. Width scales proportionally. */
  size?: number;
  /** Show "madr" wordmark. */
  showText?: boolean;
  /** Stack text below the mark instead of to the right. */
  vertical?: boolean;
  /** Show "Student" or "Contributor" badge. */
  badge?: 'Student' | 'Contributor';
  className?: string;
  /** Animate the core star with a gentle pulse. */
  animate?: boolean;
}

export function MadrLogo({
  size = 32,
  showText = true,
  vertical = false,
  badge,
  className = '',
  animate = true,
}: MadrLogoProps) {
  const uid = useId().replace(/:/g, '');
  const coreRef = useRef<SVGCircleElement>(null);
  const glowRef = useRef<SVGCircleElement>(null);

  // Subtle breathe animation on core star
  useEffect(() => {
    if (!animate) return;
    let frame: number;
    let t = 0;
    const tick = () => {
      t += 0.018;
      const pulse = 0.55 + 0.45 * Math.sin(t);
      if (glowRef.current) glowRef.current.style.opacity = String(pulse * 0.45);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [animate]);

  return (
    <div className={`flex select-none ${vertical ? 'flex-col items-center gap-1' : 'items-center gap-2.5'} ${className}`}>
      {/* ── Mark ── */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          {/* Glow filter for core star */}
          <filter id={`glow-${uid}`} x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          {/* Soft radial glow blob behind core */}
          <radialGradient id={`coreGlow-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#b7a57a" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#4b2e83" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Constellation edges */}
        {EDGES.map(([a, b]) => {
          const sa = STARS[a];
          const sb = STARS[b];
          return (
            <line
              key={`${a}-${b}`}
              x1={sa.x} y1={sa.y}
              x2={sb.x} y2={sb.y}
              stroke="rgba(183,165,122,0.55)"
              strokeWidth={1.2}
              strokeLinecap="round"
            />
          );
        })}

        {/* Stars */}
        {STARS.map((s, i) => {
          const opacity = TIER_OPACITY[s.tier];
          const isCore = s.tier === 'core';
          return (
            <g key={i}>
              {/* Glow blob behind core */}
              {isCore && (
                <circle
                  ref={glowRef}
                  cx={s.x} cy={s.y} r={8}
                  fill={`url(#coreGlow-${uid})`}
                  style={{ opacity: 0.35 }}
                />
              )}
              {/* Star dot */}
              <circle
                ref={isCore ? coreRef : undefined}
                cx={s.x} cy={s.y} r={s.r}
                fill={isCore ? '#e8dfc8' : 'white'}
                opacity={opacity}
                filter={isCore ? `url(#glow-${uid})` : undefined}
              />
              {/* Extra inner highlight on bright stars */}
              {(isCore || s.tier === 'bright') && (
                <circle
                  cx={s.x} cy={s.y} r={s.r * 0.45}
                  fill="white"
                  opacity={isCore ? 0.9 : 0.5}
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* ── Wordmark ── */}
      {showText && (
        <div className={`flex leading-none ${vertical ? 'flex-col items-center gap-1' : 'items-center gap-2'}`}>
          <span
            className="font-bold tracking-tight text-white/90"
            style={{ fontSize: size * (vertical ? 0.4 : 0.5) }}
          >
            madr
          </span>
          {badge && (
            <span
              className="text-[#b7a57a]/60 font-medium uppercase border border-[#b7a57a]/20 rounded px-1.5 py-0.5"
              style={{ fontSize: size * 0.28, letterSpacing: '0.18em' }}
            >
              {badge}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
