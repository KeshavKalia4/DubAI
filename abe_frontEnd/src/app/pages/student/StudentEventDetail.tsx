import { useParams, useNavigate } from 'react-router';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Users,
  Sparkles,
  Play,
  Check,
  X,
  Tag,
  Bookmark,
  Share2,
  MessageCircle,
  Send,
  Link,
} from 'lucide-react';
import { useEvents } from '@/hooks/useEvents';
import { useRsvp } from '@/hooks/useRsvp';
import { useSavedEvents } from '@/hooks/useSavedEvents';
import { useComments } from '@/hooks/useComments';
import { useUserProfile } from '@/hooks/useUserProfile';
import { NebulaBg } from '@/components/ui/nebula-bg';
import { GridPatternCard } from '@/components/ui/card-with-grid-ellipsis-pattern';
import { WaveDivider } from '@/components/ui/wave-divider';
import { cn } from '@/lib/utils';

// ── helpers ────────────────────────────────────────────────────────────────

const avatarPalette = ['#4b2e83', '#7c5cbf', '#b7a57a', '#2a1a5e', '#5a3a9e'];
function nameColor(name: string) {
  let hash = 0;
  for (const c of name) hash = (hash * 31 + c.charCodeAt(0)) & 0xffff;
  return avatarPalette[hash % avatarPalette.length];
}

// Deterministic particle spread across the full card on "Going"
const CARD_PARTICLES: ReadonlyArray<[number, number, string, number, number]> = [
  // [angleDeg, distPx, color, sizePx, delayS]
  [   0, 155, '#4b2e83', 3, 0.00], [  25,  88, '#7c5cbf', 2, 0.03],
  [  50, 128, '#b7a57a', 2, 0.01], [  75, 108, '#4b2e83', 4, 0.05],
  [ 100,  78, '#7c5cbf', 2, 0.02], [ 130, 148, '#b7a57a', 2, 0.04],
  [ 155,  98, '#4b2e83', 3, 0.01], [ 180, 138, '#7c5cbf', 2, 0.06],
  [ 205,  88, '#b7a57a', 3, 0.03], [ 230, 118, '#4b2e83', 2, 0.00],
  [ 255, 158, '#7c5cbf', 4, 0.05], [ 280,  83, '#b7a57a', 2, 0.02],
  [ 305, 128, '#4b2e83', 2, 0.04], [ 330, 108, '#7c5cbf', 3, 0.01],
  [ 350,  98, '#b7a57a', 2, 0.03], [  15,  68, '#4b2e83', 2, 0.06],
  [  60, 143, '#7c5cbf', 3, 0.02], [ 200,  93, '#b7a57a', 2, 0.04],
  [ 270, 153, '#4b2e83', 3, 0.01], [ 315,  78, '#7c5cbf', 2, 0.05],
];

function CardGoingBurst({ trigger }: { trigger: number }) {
  if (trigger === 0) return null;
  return (
    <>
      {/* Radial flood that blooms then fades */}
      <motion.div
        key={`flood-${trigger}`}
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 50% 60%, rgba(75,46,131,0.55) 0%, rgba(75,46,131,0.18) 45%, transparent 72%)' }}
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: [0, 1, 0], scale: [0.4, 1.05, 1.3] }}
        transition={{ duration: 0.95, times: [0, 0.22, 1], ease: 'easeOut' }}
      />
      {/* Particles */}
      {CARD_PARTICLES.map(([angle, dist, color, size, delay], i) => (
        <motion.div
          key={`${trigger}-p${i}`}
          className="pointer-events-none absolute rounded-full"
          style={{
            width: size, height: size, backgroundColor: color,
            top: '50%', left: '50%',
            marginTop: -(size / 2), marginLeft: -(size / 2),
          }}
          initial={{ x: 0, y: 0, opacity: 0.9, scale: 1 }}
          animate={{
            x: Math.cos((angle * Math.PI) / 180) * dist,
            y: Math.sin((angle * Math.PI) / 180) * dist,
            opacity: 0, scale: 0,
          }}
          transition={{ duration: 0.7, delay, ease: [0.15, 0, 0.3, 1] }}
        />
      ))}
    </>
  );
}

const typeDot: Record<string, { color: string; label: string }> = {
  event:        { color: '#b7a57a', label: 'Event' },
  club:         { color: '#7c5cbf', label: 'Club' },
  announcement: { color: 'rgba(255,255,255,0.3)', label: 'Announcement' },
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function toGoogleCalendarDate(d: Date) {
  return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}

// ── component ──────────────────────────────────────────────────────────────

export function StudentEventDetail() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { profile } = useUserProfile();
  // Pass user ID to hooks for backend sync
  const { events, isLoaded } = useEvents({ userNetid: profile?.id });
  const { getRsvpStatus, setRsvp, getRsvpSummary, fetchRsvpCount, fetchUserStatus } = useRsvp({ userNetid: profile?.id });
  const { isSaved, toggleSave } = useSavedEvents();

  const { comments, addComment } = useComments(eventId ?? '');

  const [commentText, setCommentText] = useState('');
  const [copied, setCopied] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [goingBurst, setGoingBurst] = useState(0);
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const commentsSectionRef = useRef<HTMLDivElement>(null);

  // Fetch RSVP data when event is loaded
  useEffect(() => {
    if (eventId) {
      fetchRsvpCount(eventId);
      if (profile?.id) {
        fetchUserStatus(eventId);
      }
    }
  }, [eventId, profile?.id, fetchRsvpCount, fetchUserStatus]);

  // Auto-open comments when section is first shown
  useEffect(() => {
    if (showComments) {
      setTimeout(() => commentInputRef.current?.focus(), 300);
    }
  }, [showComments]);

  if (!isLoaded) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border border-[#4b2e83]/40 border-t-[#b7a57a]" />
      </div>
    );
  }

  const event = events.find(e => e.id === eventId);

  if (!event) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-white/40 mb-4">Event not found</p>
          <button
            onClick={() => navigate('/student')}
            className="cursor-pointer text-xs font-mono uppercase tracking-[0.2em] text-white/30 hover:text-white/60 transition-colors border border-white/10 rounded-lg px-4 py-2"
          >
            Back to Feed
          </button>
        </div>
      </div>
    );
  }

  const t = typeDot[event.type] ?? typeDot.announcement;
  const currentRsvp = getRsvpStatus(event.id);
  const summary = getRsvpSummary(event.id, event.attendees?.count);
  const saved = isSaved(event.id);

  const dateStr = event.date
    ? new Date(event.date).toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric',
      })
    : null;
  const timeStr = event.date
    ? new Date(event.date).toLocaleTimeString('en-US', {
        hour: 'numeric', minute: '2-digit',
      })
    : null;
  const googleCalendarUrl = (() => {
    if (!event.date) return null;
    const start = new Date(event.date);
    const end = new Date(start.getTime() + 90 * 60 * 1000);
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.title,
      dates: `${toGoogleCalendarDate(start)}/${toGoogleCalendarDate(end)}`,
      details: event.description,
      location: event.location ?? 'Campus',
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  })();

  const related = events
    .filter(e =>
      e.id !== event.id &&
      e.organizationId === event.organizationId &&
      e.tags.some(tag => event.tags.includes(tag))
    )
    .slice(0, 3);

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: event.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // dismissed
    }
  };

  const handleComment = () => {
    if (!commentText.trim()) return;
    addComment(commentText, profile?.name ?? 'Student');
    setCommentText('');
  };

  const handleCommentKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleComment();
    }
  };

  const scrollToComments = () => {
    setShowComments(true);
    setTimeout(() => {
      commentsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  return (
    <div className="relative min-h-screen">
      <NebulaBg preset="event" className="pointer-events-none fixed inset-0" />

      {/* Hero image */}
      {event.imageUrl && (
        <div className="relative h-44 sm:h-52 w-full overflow-hidden">
          <img src={event.imageUrl} alt={event.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-[#08060f]" />
          <div className="absolute bottom-4 left-4 flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: t.color }} />
            <span className="font-mono text-[10px] uppercase tracking-[0.25em]" style={{ color: t.color }}>
              {t.label}
            </span>
          </div>
        </div>
      )}

      {/* Floating back button */}
      <button
        onClick={() => navigate('/student')}
        className="cursor-pointer fixed top-16 left-4 z-20 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 backdrop-blur-sm text-white/50 hover:text-white/80 transition-colors"
      >
        <ArrowLeft size={12} />
        <span className="text-[10px] font-mono uppercase tracking-[0.15em]">Feed</span>
      </button>

      {/* Main content */}
      <div
        className="relative z-10 mx-auto max-w-6xl px-3 sm:px-4 pb-12"
        style={{ marginTop: event.imageUrl ? '-1rem' : '1.5rem' }}
      >
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <div className="space-y-3">
        {/* Title + meta */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white/90 mb-2">
            {event.title}
          </h1>
          <div className="flex flex-wrap gap-4 text-xs text-white/40">
            {dateStr && (
              <span className="flex items-center gap-1.5">
                <Calendar size={11} style={{ color: t.color + 'aa' }} />
                {dateStr}
              </span>
            )}
            {timeStr && (
              <span className="flex items-center gap-1.5">
                <Clock size={11} style={{ color: t.color + 'aa' }} />
                {timeStr}
              </span>
            )}
            {event.location && (
              <span className="flex items-center gap-1.5">
                <MapPin size={11} style={{ color: t.color + 'aa' }} />
                {event.location}
              </span>
            )}
          </div>
        </motion.div>

        <WaveDivider height={16} speed={18} opacity={0.4} />

        {/* AI summary */}
        {event.aiSummary && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}>
            <GridPatternCard gradientClassName="from-[#0d0a1a]/90 via-[#0d0a1a]/50 to-transparent" className="border-[#b7a57a]/15">
              <div className="px-4 py-3 flex items-start gap-3">
                <Sparkles size={13} className="text-[#b7a57a] mt-0.5 shrink-0" />
                <p className="text-sm text-white/60 leading-relaxed">{event.aiSummary}</p>
              </div>
            </GridPatternCard>
          </motion.div>
        )}

        {/* ── RSVP — full-card Going ── */}
        {(() => {
          const userIsGoing = currentRsvp === 'going';
          return (
            <motion.div
              className="lg:hidden"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
            >
              <motion.div
                animate={userIsGoing
                  ? { boxShadow: '0 0 28px 2px rgba(75,46,131,0.28), 0 0 0 1px rgba(75,46,131,0.35)' }
                  : { boxShadow: '0 0 0 0px transparent' }}
                transition={{ duration: 0.7 }}
                className="rounded-xl"
              >
                <GridPatternCard className={userIsGoing ? 'border-[#4b2e83]/35' : ''}>
                  {/* Full-card burst layer */}
                  <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
                    <CardGoingBurst trigger={goingBurst} />
                  </div>

                  <div className="relative px-5 py-5">
                    <AnimatePresence mode="wait">
                      {userIsGoing ? (
                        /* ── Confirmed state ── */
                        <motion.div
                          key="confirmed"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <motion.div
                              initial={{ scale: 0, rotate: -30 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ type: 'spring', stiffness: 420, damping: 18, delay: 0.12 }}
                              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#4b2e83]/60 bg-[#4b2e83]/35"
                            >
                              <Check size={15} className="text-white" strokeWidth={2.5} />
                            </motion.div>
                            <motion.div
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.18, duration: 0.3 }}
                            >
                              <p className="text-sm font-bold text-white leading-none mb-1">You're Going</p>
                              <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-white/25">tap × to undo</p>
                            </motion.div>
                          </div>
                          {/* Shimmer sweep */}
                          <motion.div
                            className="pointer-events-none absolute inset-0 rounded-xl"
                            style={{ background: 'linear-gradient(108deg, transparent 32%, rgba(183,165,122,0.08) 50%, transparent 68%)' }}
                            animate={{ x: ['-110%', '160%'] }}
                            transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 2.8, ease: 'easeInOut' }}
                          />
                          <button
                            onClick={() => setRsvp(event.id, null)}
                            className="cursor-pointer relative z-10 flex h-7 w-7 items-center justify-center rounded-full border border-white/10 text-white/25 hover:border-white/25 hover:text-white/60 transition-all"
                          >
                            <X size={12} />
                          </button>
                        </motion.div>
                      ) : (
                        /* ── CTA state ── */
                        <motion.button
                          key="cta"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setRsvp(event.id, 'going');
                            setGoingBurst(b => b + 1);
                          }}
                          className="cursor-pointer w-full flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/4 group-hover:border-[#4b2e83]/50 group-hover:bg-[#4b2e83]/18 transition-all duration-300">
                              <Check size={15} className="text-white/25 group-hover:text-white/75 transition-colors duration-300" strokeWidth={2.5} />
                            </div>
                            <div className="text-left">
                              <p className="text-sm font-bold text-white/55 group-hover:text-white/90 transition-colors duration-200 leading-none mb-1">
                                Going
                              </p>
                              <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-white/20">
                                RSVP to this event
                              </p>
                            </div>
                          </div>
                          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/15 group-hover:text-[#b7a57a] transition-colors duration-300">
                            → confirm
                          </span>
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                </GridPatternCard>
              </motion.div>
            </motion.div>
          );
        })()}

        {currentRsvp === 'going' && googleCalendarUrl && (
          <motion.a
            href={googleCalendarUrl}
            target="_blank"
            rel="noreferrer"
            className="lg:hidden inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#b7a57a]/40 bg-[#b7a57a]/10 px-3 py-2 text-xs font-semibold text-[#e9ddb9] transition-colors hover:bg-[#b7a57a]/20"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.17, duration: 0.45 }}
          >
            <Calendar size={12} />
            Add to Google Calendar
          </motion.a>
        )}

        {/* ── Who's Going card ── */}
        {(() => {
          const friends = event.attendees?.friends ?? [];
          const userIsGoing = currentRsvp === 'going';
          const displayPeople = userIsGoing ? ['You', ...friends] : friends;
          const totalGoing = summary.going;

          return (
            <motion.div className="lg:hidden" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.5 }}>
              <GridPatternCard className="border-white/6">
                <div className="px-4 py-4 space-y-3">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30 flex items-center gap-1.5">
                      <Users size={10} />
                      Who's Going
                    </span>
                    {/* Animated count */}
                    <div className="flex items-baseline gap-1">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={totalGoing}
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.22 }}
                          className="text-lg font-bold text-white/80 tabular-nums"
                        >
                          {totalGoing.toLocaleString()}
                        </motion.span>
                      </AnimatePresence>
                      <span className="text-[10px] font-mono text-white/25">going</span>
                    </div>
                  </div>

                  {/* Avatar stack */}
                  {displayPeople.length > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2.5">
                        {displayPeople.slice(0, 6).map((name, i) => (
                          <motion.div
                            key={name}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            title={name}
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#08060f] text-[10px] font-bold text-white"
                            style={{
                              backgroundColor: name === 'You' ? '#4b2e83' : nameColor(name),
                              zIndex: displayPeople.length - i,
                            }}
                          >
                            {name.charAt(0).toUpperCase()}
                          </motion.div>
                        ))}
                        {totalGoing > 6 && (
                          <div
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#08060f] bg-white/10 text-[9px] font-mono text-white/40"
                            style={{ zIndex: 0 }}
                          >
                            +{totalGoing - 6}
                          </div>
                        )}
                      </div>

                      {/* Friend names as text */}
                      {friends.length > 0 && (
                        <p className="text-[11px] text-white/40 leading-tight flex-1 min-w-0 truncate">
                          {userIsGoing && <span className="text-[#b7a57a]">You</span>}
                          {userIsGoing && friends.length > 0 && <span className="text-white/20">, </span>}
                          {friends.slice(0, 2).join(', ')}
                          {friends.length > 2 && (
                            <span className="text-white/25"> +{friends.length - 2} more</span>
                          )}
                          {!userIsGoing && <span className="text-white/25"> {friends.length === 1 ? 'is' : 'are'} going</span>}
                        </p>
                      )}
                      {friends.length === 0 && userIsGoing && (
                        <p className="text-[11px] text-[#b7a57a]/60">You're going</p>
                      )}
                    </div>
                  )}

                  {totalGoing === 0 && displayPeople.length === 0 && (
                    <p className="text-[11px] font-mono text-white/20 uppercase tracking-[0.15em]">
                      Be the first to go
                    </p>
                  )}
                </div>
              </GridPatternCard>
            </motion.div>
          );
        })()}

        {/* Social action bar: Save · Share · Comment */}
        <motion.div className="lg:hidden" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
          <GridPatternCard className="border-white/6">
            <div className="flex divide-x divide-white/8">
              {/* Save */}
              <button
                onClick={() => toggleSave(event.id)}
                className={cn(
                  'cursor-pointer flex flex-1 items-center justify-center gap-2 py-3 text-xs transition-all duration-200',
                  saved
                    ? 'text-[#b7a57a]'
                    : 'text-white/30 hover:text-white/60'
                )}
              >
                <Bookmark
                  size={13}
                  className={cn('transition-all duration-200', saved && 'fill-[#b7a57a]')}
                />
                <span className="font-mono uppercase tracking-[0.15em] text-[10px]">
                  {saved ? 'Saved' : 'Save'}
                </span>
              </button>

              {/* Share */}
              <button
                onClick={handleShare}
                className="cursor-pointer flex flex-1 items-center justify-center gap-2 py-3 text-xs text-white/30 hover:text-white/60 transition-all duration-200"
              >
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.span
                      key="copied"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      className="flex items-center gap-1.5 font-mono uppercase tracking-[0.15em] text-[10px] text-emerald-400"
                    >
                      <Link size={11} />
                      Copied!
                    </motion.span>
                  ) : (
                    <motion.span
                      key="share"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      className="flex items-center gap-2"
                    >
                      <Share2 size={13} />
                      <span className="font-mono uppercase tracking-[0.15em] text-[10px]">Share</span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* Comment */}
              <button
                onClick={scrollToComments}
                className="cursor-pointer flex flex-1 items-center justify-center gap-2 py-3 text-xs text-white/30 hover:text-white/60 transition-all duration-200"
              >
                <MessageCircle size={13} />
                <span className="font-mono uppercase tracking-[0.15em] text-[10px]">
                  {comments.length > 0 ? comments.length : 'Comment'}
                </span>
              </button>
            </div>
          </GridPatternCard>
        </motion.div>

        {/* Description */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.5 }}>
          <GridPatternCard>
            <div className="px-4 py-4 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30">About</span>
              <p className="text-sm text-white/55 leading-relaxed">{event.description}</p>
            </div>
          </GridPatternCard>
        </motion.div>

        {/* Tags */}
        {event.tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex items-center gap-2 flex-wrap"
          >
            <Tag size={10} className="text-white/20" />
            {event.tags.map(tag => (
              <span
                key={tag}
                className="font-mono text-[10px] text-white/25 border border-white/8 rounded-full px-2.5 py-1"
              >
                #{tag}
              </span>
            ))}
          </motion.div>
        )}

        <WaveDivider height={16} speed={22} opacity={0.3} />

        {/* Comments section */}
        <motion.div
          ref={commentsSectionRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
        >
          <GridPatternCard>
            <div className="px-4 py-4 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30 flex items-center gap-2">
                  <MessageCircle size={11} />
                  Discussion
                  {comments.length > 0 && (
                    <span className="text-white/20">· {comments.length}</span>
                  )}
                </span>
              </div>

              {/* Input */}
              <div className="flex gap-2 items-end">
                <div className="flex-1 rounded-xl border border-white/8 bg-white/4 focus-within:border-[#4b2e83]/40 focus-within:ring-1 focus-within:ring-[#4b2e83]/20 transition-all">
                  <textarea
                    ref={commentInputRef}
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    onKeyDown={handleCommentKeyDown}
                    placeholder="Share your thoughts…"
                    rows={1}
                    className="w-full resize-none bg-transparent px-4 py-3 text-sm text-white/70 placeholder-white/20 outline-none max-h-28"
                  />
                </div>
                <button
                  onClick={handleComment}
                  disabled={!commentText.trim()}
                  className={cn(
                    'cursor-pointer rounded-xl border px-3 py-3 transition-all',
                    commentText.trim()
                      ? 'border-[#4b2e83]/50 bg-[#4b2e83]/30 text-white/80 hover:bg-[#4b2e83]/50'
                      : 'border-white/8 bg-transparent text-white/15 cursor-not-allowed'
                  )}
                >
                  <Send size={13} />
                </button>
              </div>

              {/* Comment list */}
              <AnimatePresence initial={false}>
                {comments.length === 0 ? (
                  <p className="text-center text-[10px] font-mono text-white/20 py-4 uppercase tracking-[0.2em]">
                    Be the first to comment
                  </p>
                ) : (
                  <div className="space-y-3 pt-1">
                    {comments.map((c, i) => (
                      <motion.div
                        key={c.id}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="flex gap-3"
                      >
                        {/* Avatar dot */}
                        <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#4b2e83]/40 bg-[#4b2e83]/20">
                          <span className="text-[9px] font-bold text-[#b7a57a]">
                            {c.authorName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2 mb-1">
                            <span className="text-[10px] font-mono text-white/50">{c.authorName}</span>
                            <span className="text-[9px] font-mono text-white/20">{timeAgo(c.timestamp)}</span>
                          </div>
                          <p className="text-sm text-white/55 leading-relaxed break-words">{c.text}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>
          </GridPatternCard>
        </motion.div>

        <WaveDivider height={14} speed={20} opacity={0.25} />

        {/* View Feed CTA */}
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          onClick={() => navigate('/student')}
          className="cursor-pointer w-full flex items-center justify-center gap-2 rounded-xl border border-white/8 bg-white/3 py-3 text-xs font-mono uppercase tracking-[0.2em] text-white/30 hover:border-white/15 hover:text-white/50 transition-all"
        >
          <Play size={11} />
          View Feed
        </motion.button>

        {/* Related events */}
        {related.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="space-y-3"
          >
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/25">More like this</p>
            {related.map((rel, i) => {
              const rt = typeDot[rel.type] ?? typeDot.announcement;
              const relDate = rel.date
                ? new Date(rel.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()
                : null;
              return (
                <GridPatternCard key={rel.id} delay={0.45 + i * 0.07}>
                  <div
                    className="cursor-pointer px-4 py-3 flex items-start gap-4"
                    onClick={() => navigate(`/student/events/${rel.id}`)}
                  >
                    {rel.imageUrl && (
                      <img src={rel.imageUrl} alt="" className="h-12 w-16 shrink-0 rounded-lg object-cover opacity-70" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="h-1 w-1 rounded-full" style={{ backgroundColor: rt.color }} />
                        {relDate && (
                          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/20">{relDate}</span>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-white/65 truncate">{rel.title}</p>
                      {rel.location && (
                        <p className="text-[10px] text-white/25 mt-0.5 flex items-center gap-1">
                          <MapPin size={8} />
                          {rel.location}
                        </p>
                      )}
                    </div>
                  </div>
                </GridPatternCard>
              );
            })}
          </motion.div>
        )}
          </div>
          <aside className="hidden lg:block lg:sticky lg:top-20 space-y-3">
            <GridPatternCard className="border-white/8">
              <div className="px-4 py-4 space-y-3">
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30">RSVP</p>
                <button
                  onClick={() => {
                    if (currentRsvp === 'going') {
                      setRsvp(event.id, null);
                    } else {
                      setRsvp(event.id, 'going');
                      setGoingBurst(b => b + 1);
                    }
                  }}
                  className={cn(
                    'w-full cursor-pointer rounded-lg border px-3 py-2.5 text-xs font-semibold transition-colors',
                    currentRsvp === 'going'
                      ? 'border-[#4b2e83]/55 bg-[#4b2e83]/25 text-white'
                      : 'border-white/10 bg-white/5 text-white/75 hover:border-[#4b2e83]/40 hover:bg-[#4b2e83]/15'
                  )}
                >
                  {currentRsvp === 'going' ? 'Going · Click to Undo' : 'RSVP Going'}
                </button>
                <div className="rounded-lg border border-white/8 bg-white/[0.03] p-3 space-y-1.5 text-xs text-white/55">
                  {dateStr && <p className="flex items-center gap-2"><Calendar size={12} />{dateStr}</p>}
                  {timeStr && <p className="flex items-center gap-2"><Clock size={12} />{timeStr}</p>}
                  {event.location && <p className="flex items-center gap-2"><MapPin size={12} />{event.location}</p>}
                  <p className="flex items-center gap-2"><Users size={12} />{summary.going.toLocaleString()} going</p>
                </div>
                {currentRsvp === 'going' && googleCalendarUrl && (
                  <a
                    href={googleCalendarUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#b7a57a]/40 bg-[#b7a57a]/10 px-3 py-2 text-xs font-semibold text-[#e9ddb9] transition-colors hover:bg-[#b7a57a]/20"
                  >
                    <Calendar size={12} />
                    Add to Google Calendar
                  </a>
                )}
              </div>
            </GridPatternCard>

            <GridPatternCard className="border-white/8">
              <div className="flex divide-x divide-white/8">
                <button
                  onClick={() => toggleSave(event.id)}
                  className={cn(
                    'cursor-pointer flex flex-1 items-center justify-center gap-2 py-3 text-xs transition-all duration-200',
                    saved ? 'text-[#b7a57a]' : 'text-white/30 hover:text-white/60'
                  )}
                >
                  <Bookmark size={13} className={cn('transition-all duration-200', saved && 'fill-[#b7a57a]')} />
                  <span className="font-mono uppercase tracking-[0.15em] text-[10px]">{saved ? 'Saved' : 'Save'}</span>
                </button>
                <button
                  onClick={handleShare}
                  className="cursor-pointer flex flex-1 items-center justify-center gap-2 py-3 text-xs text-white/30 hover:text-white/60 transition-all duration-200"
                >
                  <Share2 size={13} />
                  <span className="font-mono uppercase tracking-[0.15em] text-[10px]">Share</span>
                </button>
              </div>
              <div className="border-t border-white/8 p-3">
                <button
                  onClick={scrollToComments}
                  className="cursor-pointer inline-flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/65 transition-colors hover:border-[#4b2e83]/35 hover:bg-[#4b2e83]/10"
                >
                  <span className="inline-flex items-center gap-2">
                    <MessageCircle size={12} />
                    Jump to Discussion
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/35">
                    {comments.length} comments
                  </span>
                </button>
              </div>
            </GridPatternCard>
          </aside>
        </div>
      </div>
    </div>
  );
}
