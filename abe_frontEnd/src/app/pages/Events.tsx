import { useState } from "react"
import { Filter, MapPin, PlusCircle, Search, Users, Wand2 } from "lucide-react"
import { Link, useNavigate } from "react-router"
import { WaveDivider } from "@/components/ui/wave-divider"
import { GridPatternCard } from "@/components/ui/card-with-grid-ellipsis-pattern"

const events = [
  {
    id: 1,
    title: "Founder Sprint Night",
    date: "MAR 6",
    time: "6:00 PM – 8:30 PM",
    location: "Innovation Studio",
    status: "Published",
    rsvps: 142,
    capacity: 200,
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    title: "Career Story Lab",
    date: "MAR 9",
    time: "4:00 PM – 5:30 PM",
    location: "North Hall 105",
    status: "Published",
    rsvps: 89,
    capacity: 120,
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    title: "Campus Research Social",
    date: "MAR 13",
    time: "2:00 PM – 5:00 PM",
    location: "Learning Commons",
    status: "Draft",
    rsvps: 0,
    capacity: 80,
    image: "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 4,
    title: "Spring Community Mixer",
    date: "MAR 20",
    time: "7:00 PM – 10:00 PM",
    location: "Student Center Atrium",
    status: "Scheduled",
    rsvps: 34,
    capacity: 300,
    image: "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&w=1200&q=80",
  },
]


const statusConfig: Record<string, { dot: string; label: string; text: string }> = {
  Published: { dot: "#10b981", label: "PUBLISHED", text: "text-emerald-400" },
  Scheduled: { dot: "#b7a57a", label: "SCHEDULED", text: "text-[#b7a57a]" },
  Draft:     { dot: "rgba(255,255,255,0.2)", label: "DRAFT", text: "text-white/25" },
}

export function Events() {
  const navigate = useNavigate()
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  return (
    <div className="space-y-6">

      {/* Studio Card */}
      <Link to="/contributor/studio" className="block group cursor-pointer">
        <div className="rounded-xl border border-white/8 bg-[#0d0a1a] px-5 py-4 transition-all group-hover:border-[#4b2e83]/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#4b2e83]/20 transition-colors group-hover:bg-[#4b2e83]/35">
                <Wand2 size={15} className="text-[#b7a57a]" />
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#b7a57a]/50 group-hover:text-[#b7a57a]/80 transition-colors">Contributor Studio</p>
                <p className="text-sm font-semibold text-white/75 group-hover:text-white/95 transition-colors">Your Creative Workspace</p>
              </div>
            </div>
            <span className="hidden sm:block text-[11px] font-mono text-white/20 group-hover:text-[#b7a57a]/70 transition-colors tracking-widest">Open →</span>
          </div>
          <div className="mt-3.5 flex flex-wrap gap-2">
            {["AI Idea Generator", "Templates & Playbooks", "Collaboration Suggestions", "Content Studio"].map(f => (
              <span key={f} className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1 text-[11px] text-white/30">
                {f}
              </span>
            ))}
          </div>
        </div>
      </Link>

      {/* Events subheader */}
      <div className="flex items-center justify-between px-1">
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/25">My Events</p>
        <Link
          to="/contributor/studio"
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#4b2e83]/40 bg-[#4b2e83]/20 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[#4b2e83]/35"
        >
          <PlusCircle size={15} />
          Create Event
        </Link>
      </div>

      {/* Search + Filter */}
      <section className="rounded-xl border border-white/8 bg-[#0d0a1a] p-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" size={15} />
            <input
              type="text"
              placeholder="Search by title, location, or format"
              className="w-full rounded-lg border border-white/8 bg-white/5 py-2 pl-9 pr-4 text-sm text-white/80 placeholder-white/25 outline-none transition focus:border-[#4b2e83]/50 focus:ring-1 focus:ring-[#4b2e83]/30"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/8 bg-white/5 px-4 py-2 text-sm text-white/50 transition hover:bg-white/10 hover:text-white/80">
              <Filter size={14} />
              Filter
            </button>
            <select className="cursor-pointer rounded-lg border border-white/8 bg-[#0d0a1a] px-3 py-2 text-sm text-white/50 outline-none focus:border-[#4b2e83]/50">
              <option>All Statuses</option>
              <option>Published</option>
              <option>Draft</option>
              <option>Scheduled</option>
            </select>
          </div>
        </div>
      </section>

      {/* Wave into list */}
      <WaveDivider height={24} speed={12} opacity={0.6} />

      {/* Editorial event list */}
      <section>
        {events.map((event, i) => {
          const s = statusConfig[event.status] ?? statusConfig.Draft
          const isHovered = hoveredId === event.id
          const fillPct = Math.round((event.rsvps / event.capacity) * 100)

          return (
            <div key={event.id}>
              <GridPatternCard delay={i * 0.08}>
              <div
                className="group relative cursor-pointer py-4 transition-all duration-200"
                onMouseEnter={() => setHoveredId(event.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => navigate(`/contributor/events/${event.id}`)}
              >
                {/* Hover image bleed — very faint */}
                {isHovered && (
                  <div
                    className="pointer-events-none absolute inset-0 rounded-lg opacity-[0.06] transition-opacity duration-300"
                    style={{
                      backgroundImage: `url(${event.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      filter: "blur(2px)",
                    }}
                  />
                )}

                {/* Left accent bar */}
                <div
                  className="absolute left-0 top-4 bottom-4 w-px rounded-full transition-all duration-300"
                  style={{ backgroundColor: isHovered ? s.dot : "transparent" }}
                />

                <div className="relative pl-5">
                  {/* Date + status row */}
                  <div className="mb-1.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/25">
                        {event.date}
                      </span>
                      <span className="text-white/10">·</span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/20">
                        {event.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: s.dot }}
                      />
                      <span className={`font-mono text-[10px] uppercase tracking-[0.2em] ${s.text}`}>
                        {s.label}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3
                    className="text-2xl font-bold tracking-tight transition-colors duration-200 sm:text-3xl"
                    style={{ color: isHovered ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.75)" }}
                  >
                    {event.title}
                  </h3>

                  {/* Metadata */}
                  <div
                    className="mt-2 flex flex-wrap items-center gap-4 transition-opacity duration-200"
                    style={{ opacity: isHovered ? 0.8 : 0.4 }}
                  >
                    <span className="flex items-center gap-1.5 text-xs text-white/60">
                      <MapPin size={11} className="text-[#b7a57a]/60" />
                      {event.location}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-white/50">
                      <Users size={11} className="text-[#b7a57a]/60" />
                      {event.rsvps} / {event.capacity}
                    </span>
                    {/* Inline progress */}
                    <div className="flex items-center gap-2">
                      <div className="h-px w-20 overflow-hidden rounded-full bg-white/8">
                        <div
                          className="h-full rounded-full bg-[#4b2e83]/80 transition-all"
                          style={{ width: `${fillPct}%` }}
                        />
                      </div>
                      <span className="font-mono text-[10px] text-white/20">{fillPct}%</span>
                    </div>
                  </div>

                  {/* Actions — reveal on hover */}
                  <div
                    className="mt-3 flex gap-2 transition-all duration-200"
                    style={{ opacity: isHovered ? 1 : 0, transform: isHovered ? "translateY(0)" : "translateY(4px)" }}
                  >
                    <button
                      onClick={e => e.stopPropagation()}
                      className="cursor-pointer rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/50 transition hover:bg-white/10 hover:text-white/80"
                    >
                      Edit
                    </button>
                    <button
                      onClick={e => e.stopPropagation()}
                      className="cursor-pointer rounded-lg border border-[#b7a57a]/20 bg-[#b7a57a]/8 px-3 py-1 text-xs text-[#b7a57a] transition hover:bg-[#b7a57a]/15"
                    >
                      Promote
                    </button>
                  </div>
                </div>
              </div>
              </GridPatternCard>

              {/* Wave divider between rows */}
              {i < events.length - 1 && (
                <WaveDivider height={16} speed={18} opacity={0.35} />
              )}
            </div>
          )
        })}

        {/* Create new — typographic */}
        <div className="pt-4">
          <WaveDivider height={16} speed={20} opacity={0.25} />
          <Link
            to="/contributor/studio"
            className="group flex cursor-pointer items-center gap-3 py-5 pl-5 text-white/20 transition-all hover:text-white/50"
          >
            <PlusCircle size={16} />
            <span className="font-mono text-xs uppercase tracking-[0.25em]">New Event</span>
          </Link>
        </div>
      </section>
    </div>
  )
}
