import { useParams, useNavigate } from "react-router";
import { useState } from "react";
import { CheckCircle, AlertCircle, Search, Users, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { ProjectDetailView, type ProjectDetailViewProps } from "@/components/ui/project-detail-view";
import { NebulaBg } from "@/components/ui/nebula-bg";
import { GridPatternCard } from "@/components/ui/card-with-grid-ellipsis-pattern";

// ── Data ───────────────────────────────────────────────────────────────────

interface EventAttendee {
  id: number;
  name: string;
  email: string;
  classStanding: string;
  major: string;
  status: "Attending" | "Checked In" | "Not Attending";
  confirmationCode?: string;
}

interface EventData {
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  eventType: "Member Exclusive" | "Open";
  rsvps: number;
  capacity: number;
  image: string;
  tags: string[];
  attendees: EventAttendee[];
}

const eventDetailsData: Record<string, EventData> = {
  "1": {
    title: "Founder Sprint Night",
    date: "March 6, 2026",
    time: "6:00 PM – 8:30 PM",
    location: "Innovation Studio",
    description:
      "Join us for an exciting pitch competition featuring student entrepreneurs from across campus. Five finalist teams will present their startup ideas to a panel of investors and industry experts. Network with fellow entrepreneurs, learn from successful founders, and compete for $10,000 in seed funding.",
    eventType: "Member Exclusive",
    rsvps: 142,
    capacity: 200,
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
    tags: ["entrepreneurship", "startup", "networking"],
    attendees: [
      { id: 1, name: "Sarah Johnson", email: "sarah.j@uw.edu", classStanding: "Junior", major: "Business Administration", status: "Checked In", confirmationCode: "FSN-8842" },
      { id: 2, name: "Michael Chen", email: "mchen@uw.edu", classStanding: "Senior", major: "Computer Science", status: "Checked In", confirmationCode: "FSN-7721" },
      { id: 3, name: "Emily Rodriguez", email: "erodriguez@uw.edu", classStanding: "Sophomore", major: "Marketing", status: "Attending", confirmationCode: "FSN-5534" },
      { id: 4, name: "David Kim", email: "dkim@uw.edu", classStanding: "Junior", major: "Engineering", status: "Checked In", confirmationCode: "FSN-9203" },
      { id: 5, name: "Jessica Lee", email: "jlee@uw.edu", classStanding: "Senior", major: "Economics", status: "Attending", confirmationCode: "FSN-4456" },
    ],
  },
  "2": {
    title: "Career Story Lab",
    date: "March 9, 2026",
    time: "4:00 PM – 5:30 PM",
    location: "North Hall 105",
    description:
      "Get ready for the upcoming career fair with this comprehensive workshop. Learn how to craft an elevator pitch, what to bring, how to make a lasting impression on recruiters, and effective follow-up strategies. Includes resume review and mock networking practice.",
    eventType: "Open",
    rsvps: 89,
    capacity: 120,
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
    tags: ["career", "workshop", "networking"],
    attendees: [
      { id: 1, name: "Alex Thompson", email: "athompson@uw.edu", classStanding: "Junior", major: "Communications", status: "Checked In" },
      { id: 2, name: "Olivia Williams", email: "owilliams@uw.edu", classStanding: "Senior", major: "Marketing", status: "Attending" },
      { id: 3, name: "Daniel Garcia", email: "dgarcia@uw.edu", classStanding: "Sophomore", major: "Business", status: "Checked In" },
    ],
  },
  "3": {
    title: "Campus Research Social",
    date: "March 13, 2026",
    time: "2:00 PM – 5:00 PM",
    location: "Learning Commons",
    description:
      "A full-day symposium showcasing cutting-edge research from UW departments. Features keynote presentations, poster sessions, and networking opportunities with faculty and graduate students. Open to all undergraduate and graduate students.",
    eventType: "Open",
    rsvps: 0,
    capacity: 80,
    image: "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=800&q=80",
    tags: ["research", "academia", "networking"],
    attendees: [],
  },
  "4": {
    title: "Spring Community Mixer",
    date: "March 20, 2026",
    time: "7:00 PM – 10:00 PM",
    location: "Student Center Atrium",
    description:
      "Celebrate the spring season with fellow Huskies! This casual social event features food, music, games, and great company. Perfect for meeting new people and reconnecting with friends. Free admission with your Husky Card.",
    eventType: "Open",
    rsvps: 34,
    capacity: 300,
    image: "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&w=800&q=80",
    tags: ["social", "community", "campus"],
    attendees: [
      { id: 1, name: "Madison Clark", email: "mclark@uw.edu", classStanding: "Freshman", major: "Undeclared", status: "Attending" },
      { id: 2, name: "Ethan Wright", email: "ewright@uw.edu", classStanding: "Sophomore", major: "Political Science", status: "Attending" },
    ],
  },
};

const statusMap = {
  "Checked In": "Completed" as const,
  "Attending": "In Progress" as const,
  "Not Attending": "Pending" as const,
};

// ── Component ──────────────────────────────────────────────────────────────

export function EventDetails() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [checkInCode, setCheckInCode] = useState("");
  const [checkInStatus, setCheckInStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const event = eventId ? eventDetailsData[eventId] : null;

  if (!event) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <p className="text-white/40 text-sm mb-4">Event not found</p>
          <button
            onClick={() => navigate("/contributor/events")}
            className="cursor-pointer text-xs font-mono uppercase tracking-[0.2em] text-white/30 hover:text-white/60 transition-colors border border-white/10 rounded-lg px-4 py-2"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const fillPct = Math.round((event.rsvps / event.capacity) * 100);

  const filteredAttendees = event.attendees.filter(
    (a) =>
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCheckIn = () => {
    if (!checkInCode.trim()) {
      setCheckInStatus({ type: "error", message: "Enter a confirmation code" });
      return;
    }
    const attendee = event.attendees.find(
      (a) => a.confirmationCode === checkInCode.trim()
    );
    if (attendee) {
      if (attendee.status === "Checked In") {
        setCheckInStatus({ type: "error", message: `${attendee.name} already checked in` });
      } else {
        setCheckInStatus({ type: "success", message: `${attendee.name} checked in` });
        setCheckInCode("");
      }
    } else {
      setCheckInStatus({ type: "error", message: "Invalid confirmation code" });
    }
    setTimeout(() => setCheckInStatus(null), 3000);
  };

  // Build ProjectDetailView props
  const detailProps: ProjectDetailViewProps = {
    breadcrumbs: [
      { label: "My Events", onClick: () => navigate("/contributor/events") },
      { label: event.title },
    ],
    title: event.title,
    status: event.eventType,
    statusColor: event.eventType === "Member Exclusive" ? "gold" : "green",
    assignees: [
      {
        name: "Faculty Staff",
        avatarUrl: "https://i.pravatar.cc/150?u=faculty",
      },
    ],
    dateRange: { start: event.date, end: event.time },
    tags: event.tags.map((t) => ({ label: t, variant: "outline" as const })),
    description: event.description,
    attachments: [
      {
        name: "Event Cover",
        size: `${event.rsvps} RSVPs`,
        type: "image",
        url: event.image,
      },
    ],
    subTasks: filteredAttendees.map((a) => ({
      id: a.id,
      task: a.name,
      category: a.major,
      status: statusMap[a.status],
      dueDate: a.classStanding,
    })),
    subTasksTitle: `Attendees (${event.attendees.length})`,
    onEdit: () => navigate(`/contributor/studio`),
    onClose: () => navigate("/contributor/events"),
  };

  return (
    <div className="relative space-y-4 pb-8">
      <NebulaBg preset="minimal" className="pointer-events-none" />

      {/* Back button + RSVP bar */}
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 flex items-center justify-between"
      >
        <button
          onClick={() => navigate("/contributor/events")}
          className="cursor-pointer flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-white/30 hover:text-white/60 transition-colors"
        >
          <ArrowLeft size={13} />
          Events
        </button>

        {/* RSVP progress */}
        <div className="flex items-center gap-3 text-[10px] font-mono text-white/25">
          <span>{event.rsvps} / {event.capacity}</span>
          <div className="h-px w-24 overflow-hidden rounded-full bg-white/8">
            <div
              className="h-full rounded-full bg-[#4b2e83]/70 transition-all"
              style={{ width: `${fillPct}%` }}
            />
          </div>
          <span>{fillPct}%</span>
        </div>
      </motion.div>

      {/* Main detail card */}
      <div className="relative z-10">
        <GridPatternCard className="border-white/8" gradientClassName="from-[#0d0a1a]/98 via-[#0d0a1a]/70 to-[#0d0a1a]/20">
          <ProjectDetailView {...detailProps} />
        </GridPatternCard>
      </div>

      {/* Check-in panel — member exclusive only */}
      {event.eventType === "Member Exclusive" && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="relative z-10"
        >
          <GridPatternCard>
            <div className="p-4 md:p-6 space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-white/40 flex items-center gap-2">
                <CheckCircle size={13} className="text-[#b7a57a]" />
                Quick Check-In
              </h3>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={checkInCode}
                  onChange={(e) => setCheckInCode(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === "Enter" && handleCheckIn()}
                  placeholder="e.g., FSN-8842"
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/70 placeholder-white/20 outline-none font-mono focus:border-[#4b2e83]/50 focus:ring-1 focus:ring-[#4b2e83]/30 transition-all"
                />
                <button
                  onClick={handleCheckIn}
                  className="cursor-pointer rounded-xl border border-[#4b2e83]/40 bg-[#4b2e83]/25 px-5 py-2.5 text-sm font-semibold text-white/80 transition-all hover:bg-[#4b2e83]/40 whitespace-nowrap"
                >
                  Check In
                </button>
              </div>
              {checkInStatus && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-4 py-3 text-xs border",
                    checkInStatus.type === "success"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-red-500/10 text-red-400 border-red-500/20"
                  )}
                >
                  {checkInStatus.type === "success" ? (
                    <CheckCircle size={13} className="shrink-0" />
                  ) : (
                    <AlertCircle size={13} className="shrink-0" />
                  )}
                  {checkInStatus.message}
                </motion.div>
              )}
            </div>
          </GridPatternCard>
        </motion.div>
      )}

      {/* Attendee search (when list is long) */}
      {event.attendees.length > 3 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="relative z-10"
        >
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25"
              />
              <input
                type="text"
                placeholder="Search attendees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-white/8 bg-white/4 py-2 pl-9 pr-4 text-sm text-white/60 placeholder-white/20 outline-none focus:border-[#4b2e83]/40 focus:ring-1 focus:ring-[#4b2e83]/20 transition-all"
              />
            </div>
            {searchTerm && (
              <span className="text-[10px] font-mono text-white/25 whitespace-nowrap">
                {filteredAttendees.length} results
              </span>
            )}
          </div>
          {event.attendees.length === 0 && (
            <div className="py-12 text-center">
              <Users className="mx-auto mb-3 text-white/10" size={40} />
              <p className="text-xs text-white/25 font-mono uppercase tracking-[0.2em]">
                No attendees yet
              </p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
