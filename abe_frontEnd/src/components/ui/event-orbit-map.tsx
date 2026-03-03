import React, { useRef, useState, useEffect, useMemo } from 'react'
import { cn } from '@/components/ui/utils'
import { Calendar, MapPin, Users } from 'lucide-react'

export interface OrbitNode {
  id: string
  title: string
  date?: string
  time?: string
  location?: string
  imageUrl?: string
  dotColor: string
  glowColor?: string
  badge?: string
  badgeStyle?: string
  attendees?: number
  rsvps?: number
  capacity?: number
  tags?: string[]
}

interface EventOrbitMapProps {
  nodes: OrbitNode[]
  onNodeClick: (id: string) => void
  centerLabel?: string
  className?: string
}

// Distribute nodes across orbit rings
function distributeNodes(
  nodes: OrbitNode[],
  cx: number,
  cy: number,
  maxR: number
): { node: OrbitNode; x: number; y: number; orbitR: number }[] {
  if (nodes.length === 0) return []

  const rings = [
    { r: maxR * 0.42, cap: 5 },
    { r: maxR * 0.72, cap: 7 },
    { r: maxR * 0.98, cap: 10 },
  ]

  const result: { node: OrbitNode; x: number; y: number; orbitR: number }[] = []
  let idx = 0

  for (const ring of rings) {
    if (idx >= nodes.length) break
    const slice = nodes.slice(idx, idx + ring.cap)
    const n = slice.length
    // Slight angular offset per ring so nodes don't align
    const offset = rings.indexOf(ring) * (Math.PI / (n + 2))

    slice.forEach((node, i) => {
      const angle = (i / n) * 2 * Math.PI - Math.PI / 2 + offset
      result.push({
        node,
        x: cx + ring.r * Math.cos(angle),
        y: cy + ring.r * Math.sin(angle),
        orbitR: ring.r,
      })
    })
    idx += ring.cap
  }

  return result
}

export function EventOrbitMap({
  nodes,
  onNodeClick,
  centerLabel = 'm',
  className,
}: EventOrbitMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 700, h: 460 })
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect
      setSize({ w: width, h: height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const cx = size.w / 2
  const cy = size.h / 2
  const maxR = Math.min(cx - 64, cy - 48)

  const positioned = useMemo(
    () => distributeNodes(nodes, cx, cy, maxR),
    [nodes, cx, cy, maxR]
  )

  const uniqueRings = [...new Set(positioned.map(p => p.orbitR))]
  const hoveredEntry = positioned.find(p => p.node.id === hoveredId)

  return (
    <div
      ref={containerRef}
      className={cn('relative select-none overflow-hidden', className)}
    >
      {/* SVG: orbit rings + radial lines */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox={`0 0 ${size.w} ${size.h}`}
        preserveAspectRatio="none"
      >
        {/* Orbit rings */}
        {uniqueRings.map(r => (
          <circle
            key={r}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="1"
            strokeDasharray="3 7"
          />
        ))}

        {/* Radial lines */}
        {positioned.map(({ node, x, y }) => {
          const isHovered = hoveredId === node.id
          return (
            <line
              key={node.id}
              x1={cx}
              y1={cy}
              x2={x}
              y2={y}
              stroke={isHovered ? `${node.dotColor}55` : 'rgba(255,255,255,0.055)'}
              strokeWidth={isHovered ? 1.5 : 0.8}
              strokeDasharray={isHovered ? undefined : '2 6'}
            />
          )
        })}
      </svg>

      {/* Center nucleus */}
      <div
        className="absolute z-10 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#4b2e83]/50 bg-[#4b2e83]/20 text-sm font-bold text-white/80 backdrop-blur-sm"
        style={{ left: cx, top: cy }}
      >
        {centerLabel}
        <span
          className="absolute inset-0 rounded-full border border-[#4b2e83]/20 animate-ping"
          style={{ animationDuration: '3s' }}
        />
      </div>

      {/* Nodes */}
      {positioned.map(({ node, x, y }, i) => {
        const isHovered = hoveredId === node.id
        const shortTitle = node.title.length > 14 ? node.title.slice(0, 13) + '…' : node.title

        return (
          <div
            key={node.id}
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            style={{
              left: x,
              top: y,
              // Individual float with CSS custom property approach
              animation: `orbitFloat ${2.8 + (i % 4) * 0.6}s ease-in-out ${i * 0.35}s infinite alternate`,
            }}
            onMouseEnter={() => setHoveredId(node.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => onNodeClick(node.id)}
          >
            {/* Outer glow ring */}
            <div
              className="absolute rounded-full transition-all duration-300"
              style={{
                inset: -10,
                backgroundColor: isHovered ? `${node.dotColor}18` : 'transparent',
                borderWidth: 1,
                borderStyle: 'solid',
                borderColor: isHovered ? `${node.dotColor}45` : 'transparent',
              }}
            />

            {/* Dot */}
            <div
              className="relative h-2.5 w-2.5 rounded-full transition-all duration-200"
              style={{
                backgroundColor: node.dotColor,
                boxShadow: isHovered ? `0 0 14px ${node.glowColor ?? node.dotColor}90` : `0 0 6px ${node.dotColor}40`,
                transform: isHovered ? 'scale(1.7)' : 'scale(1)',
              }}
            />

            {/* Short label */}
            <span
              className="pointer-events-none absolute left-1/2 mt-2 -translate-x-1/2 whitespace-nowrap text-[9px] font-medium tracking-wide transition-opacity duration-200"
              style={{
                top: '100%',
                color: isHovered ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.25)',
              }}
            >
              {shortTitle}
            </span>
          </div>
        )
      })}

      {/* Empty state */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-xs text-white/20">No events yet</p>
        </div>
      )}

      {/* Hover preview card */}
      {hoveredId && hoveredEntry && (
        <PreviewCard
          node={hoveredEntry.node}
          x={hoveredEntry.x}
          y={hoveredEntry.y}
          cx={cx}
          containerW={size.w}
          containerH={size.h}
        />
      )}

      <style>{`
        @keyframes orbitFloat {
          from { transform: translate(-50%, -50%) translateY(0px); }
          to   { transform: translate(-50%, -50%) translateY(-6px); }
        }
      `}</style>
    </div>
  )
}

function PreviewCard({
  node,
  x,
  y,
  cx,
  containerW,
  containerH,
}: {
  node: OrbitNode
  x: number
  y: number
  cx: number
  containerW: number
  containerH: number
}) {
  const CARD_W = 210
  const CARD_H = node.imageUrl ? 210 : 150
  const GAP = 20

  let left = x > cx ? x - CARD_W - GAP : x + GAP + 10
  let top = y - CARD_H / 2

  left = Math.max(8, Math.min(containerW - CARD_W - 8, left))
  top = Math.max(8, Math.min(containerH - CARD_H - 8, top))

  const fillPct =
    node.rsvps !== undefined && node.capacity && node.capacity > 0
      ? Math.round((node.rsvps / node.capacity) * 100)
      : null

  return (
    <div
      className="pointer-events-none absolute z-20 overflow-hidden rounded-xl border border-white/10 bg-[#0d0a1a]/96 shadow-xl backdrop-blur-lg"
      style={{ left, top, width: CARD_W }}
    >
      {node.imageUrl && (
        <div className="relative h-24 overflow-hidden">
          <img src={node.imageUrl} alt={node.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0a1a] to-transparent" />
        </div>
      )}

      <div className="space-y-1.5 p-3">
        {node.badge && (
          <span
            className={cn(
              'inline-block rounded border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide',
              node.badgeStyle
            )}
          >
            {node.badge}
          </span>
        )}

        <p className="text-xs font-bold leading-snug text-white/90">{node.title}</p>

        {(node.date || node.time) && (
          <div className="flex items-center gap-1.5 text-[10px] text-white/40">
            <Calendar className="h-2.5 w-2.5 shrink-0" />
            <span>{[node.date, node.time].filter(Boolean).join(' · ')}</span>
          </div>
        )}

        {node.location && (
          <div className="flex items-center gap-1.5 text-[10px] text-white/40">
            <MapPin className="h-2.5 w-2.5 shrink-0" />
            <span className="truncate">{node.location}</span>
          </div>
        )}

        {node.attendees !== undefined && (
          <div className="flex items-center gap-1.5 text-[10px] text-white/30">
            <Users className="h-2.5 w-2.5 shrink-0" />
            <span>{node.attendees.toLocaleString()} attending</span>
          </div>
        )}

        {fillPct !== null && (
          <div className="pt-0.5">
            <div className="flex items-center justify-between text-[9px] text-white/25 mb-1">
              <span>capacity</span>
              <span>{fillPct}%</span>
            </div>
            <div className="h-0.5 w-full overflow-hidden rounded-full bg-white/8">
              <div
                className="h-full rounded-full bg-[#4b2e83]/80"
                style={{ width: `${fillPct}%` }}
              />
            </div>
          </div>
        )}

        {node.tags && node.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-0.5">
            {node.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="rounded-full border border-white/8 px-1.5 py-0.5 text-[8px] text-white/30"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
