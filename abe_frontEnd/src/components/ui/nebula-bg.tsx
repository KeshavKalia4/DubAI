import { cn } from '@/components/ui/utils'

interface NebulaNode {
  /** Position from the relevant edge as a CSS value, e.g. "-20%" or "60px" */
  top?: string
  bottom?: string
  left?: string
  right?: string
  /** Diameter of the glow sphere */
  size: string
  color: string
  opacity: number
  blur: string
}

interface NebulaBgProps {
  className?: string
  /**
   * Preset arrangements. Custom nodes override the preset.
   * 'default'  — purple top-right, gold bottom-left, violet center
   * 'event'    — stronger purple top-right, warm gold bottom-right, cold violet left
   * 'minimal'  — single centered soft purple glow
   */
  preset?: 'default' | 'event' | 'minimal' | 'landing'
  nodes?: NebulaNode[]
}

const PRESETS: Record<string, NebulaNode[]> = {
  default: [
    { right: '-8%', top: '-15%',     size: '480px', color: '#4b2e83', opacity: 0.11, blur: '100px' },
    { left: '-10%', bottom: '-10%',  size: '360px', color: '#b7a57a', opacity: 0.07, blur: '80px'  },
    { left: '45%',  top: '30%',      size: '220px', color: '#2a1a5e', opacity: 0.09, blur: '60px'  },
  ],
  event: [
    { right: '-6%',  top: '-20%',    size: '520px', color: '#4b2e83', opacity: 0.14, blur: '110px' },
    { right: '5%',   bottom: '-15%', size: '300px', color: '#b7a57a', opacity: 0.08, blur: '70px'  },
    { left: '-5%',   top: '40%',     size: '280px', color: '#1a0a4b', opacity: 0.12, blur: '70px'  },
  ],
  minimal: [
    { left: '50%',  top: '50%',      size: '500px', color: '#4b2e83', opacity: 0.08, blur: '120px' },
  ],
  landing: [
    { left: '50%',  top: '50%',      size: '700px', color: '#4b2e83', opacity: 0.10, blur: '150px' },
    { right: '-5%', top: '-10%',     size: '400px', color: '#2a1a5e', opacity: 0.08, blur: '90px'  },
    { left: '-5%',  bottom: '-10%',  size: '350px', color: '#b7a57a', opacity: 0.05, blur: '80px'  },
  ],
}

export function NebulaBg({ className, preset = 'default', nodes }: NebulaBgProps) {
  const glowNodes = nodes ?? PRESETS[preset]

  return (
    <div
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
      aria-hidden="true"
    >
      {glowNodes.map((node, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            top: node.top,
            bottom: node.bottom,
            left: node.left,
            right: node.right,
            width: node.size,
            height: node.size,
            backgroundColor: node.color,
            opacity: node.opacity,
            filter: `blur(${node.blur})`,
            transform: node.left === '50%' || node.left === '45%' ? 'translateX(-50%)' : undefined,
          }}
        />
      ))}
    </div>
  )
}
