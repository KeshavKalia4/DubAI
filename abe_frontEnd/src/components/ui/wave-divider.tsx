import { cn } from '@/components/ui/utils'

/**
 * Generates a smooth cubic-bezier sine wave SVG path.
 * Two waves at different frequencies create an interference pattern.
 */
function wavePath(
  totalWidth: number,
  height: number,
  amplitude: number,
  cycles: number,
  phaseShift: number = 0
): string {
  const cy = height / 2
  const cycleW = totalWidth / cycles
  const halfCW = cycleW / 2

  let d = `M ${phaseShift},${cy}`

  for (let i = 0; i < cycles + 1; i++) {
    const x0 = phaseShift + i * cycleW
    // Up arc
    d += ` C ${x0 + halfCW * 0.5},${cy - amplitude} ${x0 + halfCW * 0.5},${cy - amplitude} ${x0 + halfCW},${cy}`
    // Down arc
    d += ` C ${x0 + halfCW * 1.5},${cy + amplitude} ${x0 + halfCW * 1.5},${cy + amplitude} ${x0 + cycleW},${cy}`
  }

  return d
}

interface WaveDividerProps {
  className?: string
  /** Height of the divider in pixels */
  height?: number
  /** Primary wave opacity (0–1) */
  opacity?: number
  /** Whether to animate the wave drift */
  animated?: boolean
  /** Animation duration in seconds */
  speed?: number
  /** Flip the wave direction */
  flip?: boolean
}

// Precomputed for a 2880-wide canvas (2× tile for seamless loop)
const CANVAS_W = 2880
const CANVAS_H = 32

export function WaveDivider({
  className,
  height = 32,
  opacity = 1,
  animated = true,
  speed = 10,
  flip = false,
}: WaveDividerProps) {
  // Primary wave: 4 cycles, amplitude 10
  const primary = wavePath(CANVAS_W, CANVAS_H, 10, 8)
  // Echo wave: 7 cycles, amplitude 5, slight phase offset — interference pattern
  const echo = wavePath(CANVAS_W, CANVAS_H, 5, 14, CANVAS_W / 28)

  const transform = flip ? 'scaleY(-1)' : undefined

  return (
    <div
      className={cn('relative w-full overflow-hidden', className)}
      style={{ height, transform }}
      aria-hidden="true"
    >
      {/* Animated container — width 200% for seamless loop */}
      <div
        className="absolute inset-y-0 left-0"
        style={{
          width: '200%',
          animation: animated ? `waveDrift ${speed}s linear infinite` : undefined,
          opacity,
        }}
      >
        <svg
          viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
          preserveAspectRatio="none"
          className="h-full w-full"
        >
          {/* Primary wave */}
          <path
            d={primary}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1.2"
          />
          {/* Echo / interference wave */}
          <path
            d={echo}
            fill="none"
            stroke="rgba(183,165,122,0.05)"
            strokeWidth="0.8"
          />
          {/* Faint fill under primary wave for atmospheric depth */}
          <path
            d={`${primary} L ${CANVAS_W},${CANVAS_H} L 0,${CANVAS_H} Z`}
            fill="rgba(75,46,131,0.025)"
            stroke="none"
          />
        </svg>
      </div>

      <style>{`
        @keyframes waveDrift {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
