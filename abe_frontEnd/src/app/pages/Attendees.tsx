import { AnimatePresence, motion } from "framer-motion"
import { ArrowRight, Download, Filter, GraduationCap, Mail, MapPin, Search, UserCheck, Users, X } from "lucide-react"
import { useMemo, useState } from "react"
import { cn } from "../../lib/utils"
import { WaveDivider } from "@/components/ui/wave-divider"
import { GridPatternCard } from "@/components/ui/card-with-grid-ellipsis-pattern"

// ── Data ───────────────────────────────────────────────────────────────────────

const MEMBERS = [
  { id: 1, name: "Liam Chen",     email: "liam.chen@uw.edu",  classStanding: "Senior",    major: "Computer Science",       position: "President" },
  { id: 2, name: "Sarah Miller",  email: "sarah.m@uw.edu",    classStanding: "Junior",    major: "Business Administration", position: "Vice President" },
  { id: 3, name: "James Wilson",  email: "j.wilson@uw.edu",   classStanding: "Sophomore", major: "Mechanical Engineering",  position: "Treasurer" },
  { id: 4, name: "Emily Davis",   email: "emily.d@uw.edu",    classStanding: "Senior",    major: "Bioengineering",          position: "Secretary" },
  { id: 5, name: "Michael Brown", email: "m.brown@uw.edu",    classStanding: "Junior",    major: "Marketing",               position: "Events Coordinator" },
  { id: 6, name: "Olivia Taylor", email: "olivia.t@uw.edu",   classStanding: "Freshman",  major: "Psychology",              position: "Member" },
  { id: 7, name: "Noah Anderson", email: "noah.a@uw.edu",     classStanding: "Senior",    major: "Economics",               position: "Social Media Manager" },
  { id: 8, name: "Ava Martinez",  email: "ava.m@uw.edu",      classStanding: "Sophomore", major: "Political Science",        position: "Member" },
]

const EVENTS_WITH_ATTENDEES = [
  {
    id: 1,
    name: "Founder Sprint Night",
    date: "MAR 6",
    location: "Innovation Studio",
    totalAttendees: 6,
    checkedIn: 2,
    eventType: "Member Exclusive" as const,
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
    attendees: [
      { id: 1, name: "Sarah Miller",  email: "sarah.m@uw.edu",   status: "Checked In"    as const, code: "HSC-8842", checkInTime: "5:48 PM", classStanding: "Junior",    major: "Business Administration" },
      { id: 2, name: "Michael Brown", email: "m.brown@uw.edu",   status: "Checked In"    as const, code: "HSC-3341", checkInTime: "5:52 PM", classStanding: "Junior",    major: "Marketing" },
      { id: 3, name: "David Lee",     email: "d.lee@uw.edu",     status: "Attending"     as const, code: "HSC-5512", checkInTime: null,       classStanding: "Junior",    major: "Entrepreneurship" },
      { id: 4, name: "Liam Chen",     email: "liam.chen@uw.edu", status: "Attending"     as const, code: "HSC-9921", checkInTime: null,       classStanding: "Senior",    major: "Computer Science" },
      { id: 5, name: "Jessica Wang",  email: "j.wang@uw.edu",    status: "Not Attending" as const, code: "HSC-7723", checkInTime: null,       classStanding: "Senior",    major: "Information Systems" },
      { id: 6, name: "Tyler Johnson", email: "t.johnson@uw.edu", status: "Not Attending" as const, code: "HSC-2298", checkInTime: null,       classStanding: "Sophomore", major: "Business Administration" },
    ],
  },
  {
    id: 2,
    name: "Career Story Lab",
    date: "MAR 9",
    location: "North Hall 105",
    totalAttendees: 7,
    checkedIn: 4,
    eventType: "Open" as const,
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
    attendees: [
      { id: 1, name: "Emily Davis",     email: "emily.d@uw.edu",  status: "Checked In"    as const, code: null, checkInTime: "2:10 PM", classStanding: "Senior",    major: "Bioengineering" },
      { id: 2, name: "James Wilson",    email: "j.wilson@uw.edu", status: "Checked In"    as const, code: null, checkInTime: "2:15 PM", classStanding: "Sophomore", major: "Mechanical Engineering" },
      { id: 3, name: "Noah Anderson",   email: "noah.a@uw.edu",   status: "Checked In"    as const, code: null, checkInTime: "3:15 PM", classStanding: "Senior",    major: "Economics" },
      { id: 4, name: "Ethan Kim",       email: "e.kim@uw.edu",    status: "Checked In"    as const, code: null, checkInTime: "2:30 PM", classStanding: "Senior",    major: "Computer Science" },
      { id: 5, name: "Isabella Garcia", email: "i.garcia@uw.edu", status: "Attending"     as const, code: null, checkInTime: null,       classStanding: "Sophomore", major: "Communications" },
      { id: 6, name: "Ryan Patel",      email: "r.patel@uw.edu",  status: "Not Attending" as const, code: null, checkInTime: null,       classStanding: "Junior",    major: "Finance" },
      { id: 7, name: "Aisha Brown",     email: "a.brown@uw.edu",  status: "Not Attending" as const, code: null, checkInTime: null,       classStanding: "Freshman",  major: "Pre-Business" },
    ],
  },
  {
    id: 3,
    name: "Spring Community Mixer",
    date: "MAR 20",
    location: "Student Center Atrium",
    totalAttendees: 5,
    checkedIn: 3,
    eventType: "Open" as const,
    image: "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&w=1200&q=80",
    attendees: [
      { id: 1, name: "Olivia Taylor",   email: "olivia.t@uw.edu",    status: "Checked In"    as const, code: "AMX-7719", checkInTime: "7:02 PM", classStanding: "Freshman",  major: "Psychology" },
      { id: 2, name: "Ava Martinez",    email: "ava.m@uw.edu",       status: "Checked In"    as const, code: "AMX-9934", checkInTime: "7:05 PM", classStanding: "Sophomore", major: "Political Science" },
      { id: 3, name: "Luna Kim",        email: "l.kim@uw.edu",       status: "Checked In"    as const, code: "AMX-1123", checkInTime: "7:15 PM", classStanding: "Freshman",  major: "Biology" },
      { id: 4, name: "Marcus Williams", email: "m.williams@uw.edu",  status: "Attending"     as const, code: "AMX-5567", checkInTime: null,       classStanding: "Sophomore", major: "Art History" },
      { id: 5, name: "Emma Rodriguez",  email: "e.rodriguez@uw.edu", status: "Not Attending" as const, code: "AMX-8812", checkInTime: null,       classStanding: "Junior",    major: "Architecture" },
    ],
  },
]

// ── Config ─────────────────────────────────────────────────────────────────────

const attendeeStatusConfig: Record<string, { dot: string; label: string; text: string }> = {
  "Checked In":   { dot: "#7c5cbf", label: "Checked In",    text: "text-[#d8c8ff]" },
  "Attending":    { dot: "#10b981", label: "Attending",      text: "text-emerald-400" },
  "Not Attending":{ dot: "rgba(255,255,255,0.2)", label: "Not Attending", text: "text-white/30" },
}

// ── EventAttendeeCard ──────────────────────────────────────────────────────────

type EventData = typeof EVENTS_WITH_ATTENDEES[0]

function EventAttendeeCard({ event, onClick }: { event: EventData; onClick: () => void }) {
  const fillPct = Math.round((event.checkedIn / event.totalAttendees) * 100)

  return (
    <div
      className="group relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/8 cursor-pointer
                 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-white/15 hover:shadow-2xl hover:shadow-black/50"
      onClick={onClick}
    >
      {/* Background image with zoom */}
      <img
        src={event.image}
        alt={event.name}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/10" />

      {/* Content */}
      <div className="relative flex h-full flex-col justify-between p-5">

        {/* Top: event type badge */}
        <div className="flex items-start">
          <span className={cn(
            "rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide",
            event.eventType === "Member Exclusive"
              ? "border-[#b7a57a]/40 bg-[#b7a57a]/20 text-[#f0dca8]"
              : "border-white/20 bg-white/10 text-white/70"
          )}>
            {event.eventType}
          </span>
        </div>

        {/* Middle: name + meta — slides up on hover to make room for button */}
        <div className="space-y-2 transition-transform duration-500 ease-in-out group-hover:-translate-y-16">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">{event.date}</span>
            <span className="text-white/20">·</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">{event.location}</span>
          </div>
          <h3 className="text-xl font-bold leading-snug text-white">{event.name}</h3>
          <div className="flex items-center gap-2.5">
            <div className="h-px w-20 overflow-hidden rounded-full bg-white/15">
              <div className="h-full rounded-full bg-[#4b2e83]/90" style={{ width: `${fillPct}%` }} />
            </div>
            <span className="font-mono text-[10px] text-white/40">
              {event.checkedIn}/{event.totalAttendees} checked in
            </span>
          </div>
        </div>

        {/* Bottom: button — revealed on hover */}
        <div className="absolute -bottom-20 left-0 w-full px-5 pb-5 opacity-0 transition-all duration-500 ease-in-out group-hover:bottom-0 group-hover:opacity-100">
          <button className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20">
            View {event.totalAttendees} Attendees
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}

// ── AttendeeModal ──────────────────────────────────────────────────────────────

function AttendeeModal({ event, onClose }: { event: EventData; onClose: () => void }) {
  const fillPct = Math.round((event.checkedIn / event.totalAttendees) * 100)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.75)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#0d0a1a] shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Image header */}
        <div className="relative h-36 overflow-hidden">
          <img src={event.image} alt={event.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-[#0d0a1a]" />

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute right-3 top-3 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white/60 backdrop-blur-sm transition-colors hover:bg-black/60 hover:text-white"
          >
            <X size={14} />
          </button>

          {/* Event meta */}
          <div className="absolute bottom-4 left-5">
            <div className="mb-1 flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">{event.date}</span>
              <span className="text-white/20">·</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/40">{event.location}</span>
            </div>
            <h2 className="text-lg font-bold text-white">{event.name}</h2>
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex items-center gap-3 border-b border-white/8 px-5 py-3">
          <span className="text-xs text-white/50">
            <span className="font-semibold text-[#d8c8ff]">{event.checkedIn}</span> checked in
            <span className="mx-1.5 text-white/20">·</span>
            <span className="font-semibold text-white/70">{event.totalAttendees}</span> total
          </span>
          <div className="flex-1 h-px overflow-hidden rounded-full bg-white/8">
            <div className="h-full rounded-full bg-[#4b2e83]/80" style={{ width: `${fillPct}%` }} />
          </div>
          <span className="font-mono text-[10px] text-white/25">{fillPct}%</span>
        </div>

        {/* Attendee compact rows */}
        <div className="max-h-80 overflow-y-auto divide-y divide-white/6">
          {event.attendees.map(attendee => {
            const s = attendeeStatusConfig[attendee.status] ?? attendeeStatusConfig["Not Attending"]
            return (
              <div key={attendee.id} className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-white/[0.03]">
                {/* Status dot */}
                <div className="h-2 w-2 flex-shrink-0 rounded-full" style={{ backgroundColor: s.dot }} />

                {/* Name + major */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white/85 truncate">{attendee.name}</p>
                  <p className="text-[11px] text-white/35 truncate">{attendee.classStanding} · {attendee.major}</p>
                </div>

                {/* Status + check-in time */}
                <div className="flex-shrink-0 text-right">
                  <p className={`text-[11px] font-mono ${s.text}`}>{s.label}</p>
                  {attendee.checkInTime && (
                    <p className="text-[10px] text-white/25">{attendee.checkInTime}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="border-t border-white/8 px-5 py-3 flex items-center justify-between">
          <span className="text-[11px] text-white/25 font-mono">{event.eventType}</span>
          <button className="cursor-pointer text-[11px] text-white/35 hover:text-white/60 transition-colors flex items-center gap-1.5">
            <Download size={11} />
            Export list
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────

export function Attendees() {
  const [searchTerm, setSearchTerm]       = useState("")
  const [activeView, setActiveView]       = useState<"members" | "attendees">("members")
  const [hoveredId, setHoveredId]         = useState<string | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null)

  const filteredMembers = useMemo(
    () => MEMBERS.filter(m =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.major.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [searchTerm]
  )

  const filteredEvents = useMemo(
    () => EVENTS_WITH_ATTENDEES.filter(e =>
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.location.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [searchTerm]
  )

  const totalAttendees = EVENTS_WITH_ATTENDEES.reduce((s, e) => s + e.totalAttendees, 0)

  return (
    <div className="space-y-6">

      {/* Subheader */}
      <div className="flex items-center justify-between px-1">
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/25">My Community</p>
        <button className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/70 transition-all hover:bg-white/10 hover:text-white/90">
          <Download size={15} />
          Export CSV
        </button>
      </div>

      {/* Search + view toggle */}
      <section className="rounded-xl border border-white/8 bg-[#0d0a1a] p-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" size={15} />
            <input
              type="text"
              placeholder={activeView === "members" ? "Search members..." : "Search events..."}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-white/8 bg-white/5 py-2 pl-9 pr-4 text-sm text-white/80 placeholder-white/25 outline-none transition focus:border-[#4b2e83]/50 focus:ring-1 focus:ring-[#4b2e83]/30"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveView("members")}
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors",
                activeView === "members"
                  ? "border-[#4b2e83]/40 bg-[#4b2e83]/20 text-white/90"
                  : "border-white/8 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80"
              )}
            >
              <Users size={13} />
              Members
              <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px]">{MEMBERS.length}</span>
            </button>
            <button
              onClick={() => setActiveView("attendees")}
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors",
                activeView === "attendees"
                  ? "border-[#b7a57a]/40 bg-[#b7a57a]/10 text-[#b7a57a]"
                  : "border-white/8 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80"
              )}
            >
              <UserCheck size={13} />
              Attendees
              <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px]">{totalAttendees}</span>
            </button>
            <button className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/8 bg-white/5 px-3 py-2 text-xs text-white/50 transition hover:bg-white/10 hover:text-white/80">
              <Filter size={13} />
              Filter
            </button>
          </div>
        </div>
      </section>

      <WaveDivider height={24} speed={12} opacity={0.6} />

      {/* Members — editorial rows (unchanged) */}
      {activeView === "members" && (
        <section>
          {filteredMembers.map((member, i) => {
            const id = `m-${member.id}`
            const isHovered = hoveredId === id
            return (
              <div key={member.id}>
                <GridPatternCard delay={i * 0.06}>
                  <div
                    className="group relative cursor-pointer py-4 transition-all duration-200"
                    onMouseEnter={() => setHoveredId(id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <div
                      className="absolute left-0 top-4 bottom-4 w-px rounded-full transition-all duration-300"
                      style={{ backgroundColor: isHovered ? "#7c5cbf" : "transparent" }}
                    />
                    <div className="relative pl-5">
                      <div className="mb-1.5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/25">
                            {member.position}
                          </span>
                          <span className="text-white/10">·</span>
                          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/20">
                            {member.classStanding}
                          </span>
                        </div>
                        <div className="hidden sm:flex items-center gap-1.5">
                          <GraduationCap size={10} className="text-[#b7a57a]/40" />
                          <span className="font-mono text-[10px] text-white/20">{member.major}</span>
                        </div>
                      </div>
                      <h3
                        className="text-2xl font-bold tracking-tight transition-colors duration-200 sm:text-3xl"
                        style={{ color: isHovered ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.75)" }}
                      >
                        {member.name}
                      </h3>
                      <div
                        className="mt-2 flex flex-wrap items-center gap-4 transition-opacity duration-200"
                        style={{ opacity: isHovered ? 0.8 : 0.4 }}
                      >
                        <span className="flex items-center gap-1.5 text-xs text-white/60">
                          <Mail size={11} className="text-[#b7a57a]/60" />
                          {member.email}
                        </span>
                        <span className="sm:hidden text-xs text-white/50">{member.major}</span>
                      </div>
                      <div
                        className="mt-3 flex gap-2 transition-all duration-200"
                        style={{ opacity: isHovered ? 1 : 0, transform: isHovered ? "translateY(0)" : "translateY(4px)" }}
                      >
                        <button className="cursor-pointer rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/50 transition hover:bg-white/10 hover:text-white/80">
                          Email
                        </button>
                        <button className="cursor-pointer rounded-lg border border-[#b7a57a]/20 bg-[#b7a57a]/8 px-3 py-1 text-xs text-[#b7a57a] transition hover:bg-[#b7a57a]/15">
                          View Profile
                        </button>
                      </div>
                    </div>
                  </div>
                </GridPatternCard>
                {i < filteredMembers.length - 1 && (
                  <WaveDivider height={16} speed={18} opacity={0.35} />
                )}
              </div>
            )
          })}
        </section>
      )}

      {/* Attendees — event image cards grid */}
      {activeView === "attendees" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map(event => (
            <EventAttendeeCard
              key={event.id}
              event={event}
              onClick={() => setSelectedEvent(event)}
            />
          ))}
        </div>
      )}

      {/* Attendee modal */}
      <AnimatePresence>
        {selectedEvent && (
          <AttendeeModal
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
