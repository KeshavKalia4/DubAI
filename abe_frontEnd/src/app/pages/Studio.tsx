import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { eventsApi } from '@/lib/api'
import { useNavigate } from 'react-router'
import {
  Sparkles, BookOpen, Users, Wand2, ChevronRight, Copy, Check,
  Upload, Loader2, ArrowRight, Star, Clock, DollarSign,
  MessageSquare, Mail, Instagram, Linkedin, Twitter,
  AlertTriangle, CheckCircle2, ChevronDown, ChevronUp, Zap,
  PlusCircle, MapPin, Calendar as CalendarIcon, CheckCircle, ExternalLink,
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { format } from 'date-fns'
import { DayPicker } from 'react-day-picker'

// ── Types ─────────────────────────────────────────────────────────────────────

type Tab = 'ideas' | 'templates' | 'collabs' | 'content' | 'create'

interface EventIdea {
  name: string
  format: string
  whyItWorks: string
  estimatedAttendance: string
  timing: string
  logistics: string[]
  agenda: string[]
  tags: string[]
}

interface Template {
  id: string
  name: string
  category: string
  duration: string
  budget: string
  difficulty: 'Easy' | 'Medium' | 'High'
  description: string
  timeline: { phase: string; tasks: string[] }[]
  budgetBreakdown: { item: string; range: string }[]
  venueNeeds: string[]
  promoTimeline: string[]
  dayOfSheet: string[]
  sampleCopy: { type: string; text: string }
  metrics: string[]
  pitfalls: string[]
}

interface CollabSuggestion {
  org: string
  initials: string
  color: string
  overlap: number
  sharedInterests: string[]
  suggestedEvent: string
  reason: string
  attendees: number
}

// ── Mock Data ──────────────────────────────────────────────────────────────────

function generateIdeas(form: Record<string, string>): EventIdea[] {
  const org = form.orgType || 'professional'
  const goal = form.goals || 'networking'

  const ideas: EventIdea[] = [
    {
      name: 'Industry Coffee Chats: Tech Edition',
      format: 'Informal 60-min coffee sessions with 1–2 industry professionals',
      whyItWorks: `Organizations like yours see 40% higher attendance for intimate, career-focused events vs. large panels. Thursday 4–5 PM slots show the highest turnout for professional events on campus.`,
      estimatedAttendance: '25–35 students',
      timing: 'Thursday 4:00–5:00 PM',
      logistics: [
        'Book a small room (15–20 person capacity)',
        'Budget: ~$50 for coffee & snacks',
        'Invite 1–2 industry professionals (alumni network is best)',
        'Send calendar invite 2 weeks in advance',
      ],
      agenda: [
        '4:00 PM  Arrivals, coffee setup',
        '4:10 PM  Intro & speaker background (5 min)',
        '4:20 PM  Structured Q&A (25 min)',
        '4:45 PM  Open networking',
        '5:00 PM  Close & thank-yous',
      ],
      tags: ['Low budget', 'Repeatable', 'High ROI'],
    },
    {
      name: `${org.charAt(0).toUpperCase() + org.slice(1)} Skills Sprint`,
      format: 'Hands-on 90-min workshop with takeaway resources',
      whyItWorks: `Workshop-style events generate 2× more social engagement and 60% higher repeat attendance than lecture-only formats. Skill-focused events align with current student priorities around career readiness.`,
      estimatedAttendance: '40–60 students',
      timing: 'Wednesday 6:00–7:30 PM',
      logistics: [
        'Room with projector + whiteboards',
        'Pre-read materials sent 48h before',
        'Breakout groups of 4–5',
        'Digital takeaway packet',
      ],
      agenda: [
        '6:00 PM  Check-in & intros',
        '6:10 PM  Framing the skill (15 min)',
        '6:25 PM  Demo walkthrough (20 min)',
        '6:45 PM  Breakout practice',
        '7:15 PM  Group debrief',
        '7:30 PM  Close',
      ],
      tags: ['Medium budget', 'Career-aligned', 'Engaging'],
    },
    {
      name: 'Fireside Chat: Real Stories from the Field',
      format: 'Conversational panel with 2–3 recent alumni (graduated within 5 years)',
      whyItWorks: `Recent alumni speakers consistently outperform senior executives in student engagement scores. Peer-adjacent stories are 3× more relatable and drive higher RSVP conversion from social media.`,
      estimatedAttendance: '60–90 students',
      timing: 'Tuesday 5:30–7:00 PM',
      logistics: [
        'Medium auditorium or classroom (80+ capacity)',
        'Moderator prepares 8–10 questions in advance',
        'Record for async viewers',
        'LinkedIn connect card for speakers',
      ],
      agenda: [
        '5:30 PM  Doors open',
        '5:45 PM  Welcome & speaker intros',
        '6:00 PM  Moderated conversation (45 min)',
        '6:45 PM  Audience Q&A (15 min)',
        '7:00 PM  Networking close',
      ],
      tags: ['Low budget', 'High reach', 'Shareable'],
    },
    {
      name: 'Community Build Night',
      format: 'Structured social mixer with activities and icebreakers',
      whyItWorks: `Community-building events build long-term retention — members who attend social events are 73% more likely to renew membership. Fridays at 7 PM see the highest student availability for social events.`,
      estimatedAttendance: '50–80 students',
      timing: 'Friday 7:00–9:00 PM',
      logistics: [
        'Open, flexible space',
        'Activities: trivia, collaborative challenges, photo wall',
        'Light food & drinks ($150 budget)',
        'Playlist + ambient setup',
      ],
      agenda: [
        '7:00 PM  Arrivals + free social',
        '7:20 PM  Structured icebreaker round',
        '7:40 PM  Trivia or activity (40 min)',
        '8:20 PM  Open social + food',
        '9:00 PM  Close',
      ],
      tags: ['Mid budget', 'Community', 'High energy'],
    },
    {
      name: 'Showcase & Demo Day',
      format: 'Member project showcase — 3-min lightning demos + networking',
      whyItWorks: `Member showcases create internal pride and external visibility simultaneously. Events like these have 2.5× higher organic social shares and attract prospective members more effectively than info sessions.`,
      estimatedAttendance: '70–120 students',
      timing: 'End of quarter — Thursday or Friday evening',
      logistics: [
        'Open layout with demo stations or tables',
        'Judges or feedback cards for each project',
        'Photography/documentation team',
        'Optional prizes or certificates',
      ],
      agenda: [
        '6:00 PM  Setup & rehearsal',
        '6:30 PM  Doors open, browse demos',
        '7:00 PM  Lightning presentations begin',
        '7:45 PM  Judging / voting',
        '8:00 PM  Awards + closing',
        '8:15 PM  Networking close',
      ],
      tags: ['Mid budget', 'High visibility', 'Portfolio-building'],
    },
  ]

  // Filter/weight based on goal
  if (goal === 'fundraising') {
    ideas[2].name = 'Charity Auction Night'
    ideas[2].format = 'Live auction + raffle with donated items from local businesses'
  }
  if (goal === 'recruitment') {
    ideas[0].name = 'Open House & Info Night'
    ideas[0].format = 'Casual drop-in format — tables, demos, Q&A with current members'
  }

  return ideas
}

const TEMPLATES: Template[] = [
  {
    id: 'speed-networking',
    name: 'Speed Networking Night',
    category: 'Networking',
    duration: '90 min',
    budget: '$75–200',
    difficulty: 'Easy',
    description: 'Structured 5-minute 1:1 conversations rotating through all attendees. High energy, zero dead time.',
    timeline: [
      { phase: '8 Weeks Out', tasks: ['Reserve venue (50–80 cap)', 'Set up RSVP form', 'Draft promotional copy'] },
      { phase: '6 Weeks Out', tasks: ['Launch social promotion', 'Email your mailing list', 'Recruit 2–3 event helpers'] },
      { phase: '1 Week Out', tasks: ['Send reminder email + day-of logistics', 'Print name tags', 'Finalize headcount'] },
      { phase: 'Day Of', tasks: ['Arrive 45 min early', 'Set up table layout for rotations', 'Brief helpers on timing signals', 'Test any A/V (music, timer)'] },
    ],
    budgetBreakdown: [
      { item: 'Venue', range: '$0–100' },
      { item: 'Name tags + materials', range: '$15–30' },
      { item: 'Light snacks', range: '$50–80' },
      { item: 'Promotion', range: '$0 (organic)' },
    ],
    venueNeeds: ['Open floor plan', '50–80 person capacity', 'Moveable chairs', 'Music capability'],
    promoTimeline: ['6 weeks: Save the date post', '3 weeks: Registration open announcement', '1 week: Reminder + last spots', '24 hrs: "Tomorrow!" story post'],
    dayOfSheet: [
      '6:30 PM  Organizer arrives, sets up rotation layout',
      '7:00 PM  Doors open, name tags at entrance',
      '7:10 PM  Welcome & explain format (3 min)',
      '7:15 PM  Round 1 begins (5 min each, bell signal)',
      '8:15 PM  Final rotation ends',
      '8:15 PM  Open networking + drinks',
      '8:30 PM  Close + CTA (follow on social, next event)',
    ],
    sampleCopy: {
      type: 'Email Invite',
      text: `Subject: You're invited: Speed Networking Night 🤝\n\nHi [Name],\n\nReady to meet your next collaborator, mentor, or friend in just 90 minutes?\n\nJoin us for Speed Networking Night — 5-minute 1:1 conversations, back to back, with students from across campus. No awkward standing around. All signal.\n\nWhen: [Date] at 7:00 PM\nWhere: [Location]\nRSVP: [Link] (Limited spots)\n\nSee you there,\n[Your org]`,
    },
    metrics: ['# of RSVPs vs. attendees', 'LinkedIn connections made', '% who attend next event', 'Post-event survey score'],
    pitfalls: ['Don\'t over-rotate — 5 min minimum per conversation', 'Always have a helper managing the timer', 'Cap at 60 people or rotations become chaotic', 'Send a "connect on LinkedIn" CTA within 24h of event'],
  },
  {
    id: 'panel-series',
    name: 'Speaker Panel Series',
    category: 'Educational',
    duration: '75–90 min',
    budget: '$50–150',
    difficulty: 'Medium',
    description: 'Moderated conversation with 2–4 speakers on a focused topic. Best for career development and knowledge sharing.',
    timeline: [
      { phase: '8 Weeks Out', tasks: ['Identify 2–4 speakers', 'Confirm topic + format', 'Book venue (100+ cap)'] },
      { phase: '6 Weeks Out', tasks: ['Confirm speakers & bios', 'Design promotional materials', 'Announce on all channels'] },
      { phase: '1 Week Out', tasks: ['Send speakers day-of briefing', 'Prep moderator question list', 'Order food/drinks'] },
      { phase: 'Day Of', tasks: ['AV check 45 min before', 'Brief speakers on format', 'Have water on stage', 'Assign note-taker for follow-up content'] },
    ],
    budgetBreakdown: [
      { item: 'Venue', range: '$0' },
      { item: 'Speaker gifts', range: '$30–80' },
      { item: 'Food/drinks', range: '$0–50' },
      { item: 'Printed materials', range: '$20–30' },
    ],
    venueNeeds: ['Stage or elevated area', '100+ person capacity', 'Projector + screen', 'Lavalier or handheld mic', 'Recording capability (optional)'],
    promoTimeline: ['8 weeks: Teaser with topic', '5 weeks: Speaker announcement', '2 weeks: Details + RSVP', '48 hrs: Final reminder'],
    dayOfSheet: [
      '5:15 PM  AV setup + speaker briefing',
      '5:45 PM  Doors open',
      '6:00 PM  Welcome from org president (3 min)',
      '6:05 PM  Moderator intro of speakers',
      '6:15 PM  Panel conversation begins',
      '6:55 PM  Audience Q&A',
      '7:15 PM  Closing remarks + photo',
      '7:20 PM  Networking close',
    ],
    sampleCopy: {
      type: 'Instagram Caption',
      text: `🎤 Our biggest panel yet is coming.\n\nWe're bringing together [X] incredible speakers to talk about [TOPIC] — the unfiltered version.\n\n📅 [Date] · [Time]\n📍 [Location]\n🔗 RSVP in bio (free!)\n\nDon't sleep on this one. 👀\n\n#[OrgName] #UW #CampusEvents #[Topic]`,
    },
    metrics: ['RSVPs vs. attendance', 'Q&A participation rate', 'Post-event survey NPS', 'Recording views (if applicable)'],
    pitfalls: ['More than 4 panelists = chaos', 'Always brief speakers on the time limit', 'Have backup questions ready if audience is quiet', 'Don\'t let one speaker dominate — moderator must manage'],
  },
  {
    id: 'cultural-celebration',
    name: 'Cultural Celebration Night',
    category: 'Social',
    duration: '2–3 hours',
    budget: '$300–600',
    difficulty: 'High',
    description: 'Immersive cultural experience with performances, food, and interactive elements. High production, high reward.',
    timeline: [
      { phase: '10 Weeks Out', tasks: ['Form planning committee (5–8 people)', 'Set theme + vision', 'Apply for org funding', 'Book large venue'] },
      { phase: '6 Weeks Out', tasks: ['Confirm performers/acts', 'Design promotional assets', 'Launch ticket sales or RSVP'] },
      { phase: '2 Weeks Out', tasks: ['Confirm food vendors', 'Finalize run-of-show', 'Press/media outreach'] },
      { phase: 'Day Of', tasks: ['Full committee arrives 2 hrs early', 'Soundcheck + lighting', 'Brief all volunteers', 'Document everything for social'] },
    ],
    budgetBreakdown: [
      { item: 'Venue', range: '$0–200' },
      { item: 'Food catering', range: '$150–300' },
      { item: 'Decor + setup', range: '$50–100' },
      { item: 'Performers (if paid)', range: '$0–200' },
    ],
    venueNeeds: ['Large open space (200+ capacity)', 'Stage + full A/V system', 'Kitchen access or catering setup', 'Accessible entrance'],
    promoTimeline: ['8 weeks: Teaser video/reel', '5 weeks: Full announcement', '3 weeks: Performer spotlights', '1 week: Final push + day-of story'],
    dayOfSheet: [
      '4:00 PM  Committee arrives, full setup',
      '5:30 PM  Soundcheck + lighting check',
      '6:00 PM  Volunteer briefing',
      '6:30 PM  Doors open',
      '7:00 PM  Welcome & cultural intro',
      '7:15 PM  Performances begin',
      '8:30 PM  Food + open social',
      '9:15 PM  Close + thank-yous',
    ],
    sampleCopy: {
      type: 'Event Description',
      text: `Celebrate with us.\n\n[Org Name] invites the UW community to experience [Cultural Event] — an evening of performance, cuisine, and connection that brings our culture to life.\n\nExpect traditional and contemporary performances, authentic food, interactive cultural displays, and a space where everyone belongs.\n\nAll students welcome. No experience necessary. Just curiosity.\n\n[Date] · [Time] · [Location]\nFree admission | RSVP appreciated`,
    },
    metrics: ['Total attendance', 'Social reach (posts + story views)', 'Media coverage', 'Member recruitment from event'],
    pitfalls: ['Under-staffed = chaos. Recruit 2× the volunteers you think you need', 'Food runout is the #1 complaint — over-order by 20%', 'Document with photos/video — this is your best recruitment content', 'Start planning 10+ weeks out, not 6'],
  },
]

const COLLABS: CollabSuggestion[] = [
  {
    org: 'Filipino Student Association',
    initials: 'FSA',
    color: '#4b2e83',
    overlap: 45,
    sharedInterests: ['Community building', 'Social events', 'Cultural programming'],
    suggestedEvent: 'Culture & Career Mixer',
    reason: 'High attendance crossover. Complementary missions — combine career resources with cultural celebration for double the draw.',
    attendees: 1240,
  },
  {
    org: 'Society of Women Engineers',
    initials: 'SWE',
    color: '#10b981',
    overlap: 38,
    sharedInterests: ['Career development', 'Technical workshops', 'Professional networking'],
    suggestedEvent: 'Women in Tech Speaker Night',
    reason: 'Strong academic overlap in STEM fields. Co-hosting reduces resource burden and doubles reach to a highly engaged demographic.',
    attendees: 890,
  },
  {
    org: 'UW Consulting Club',
    initials: 'UCC',
    color: '#b7a57a',
    overlap: 31,
    sharedInterests: ['Networking events', 'Career fairs', 'Professional development'],
    suggestedEvent: 'Industry Insider: Case Study Night',
    reason: 'Complementary skill sets. Your community brings the engagement, they bring the technical content — natural fit for a case competition or workshop.',
    attendees: 730,
  },
  {
    org: 'Black Student Union',
    initials: 'BSU',
    color: '#ef4444',
    overlap: 27,
    sharedInterests: ['Community events', 'Speaker series', 'Social justice programming'],
    suggestedEvent: 'Voices from the Field: Intersectionality Panel',
    reason: 'Aligned values around inclusive community-building. Co-hosted panels between orgs like these historically see 3× the attendance of single-org events.',
    attendees: 1560,
  },
]

const CONTENT_EXAMPLES = {
  instagram: (title: string) =>
    `✨ It's happening.\n\n${title} is coming to campus and you don't want to miss it 👀\n\nThink: great people, real conversations, and memories worth posting about.\n\n📅 [Date] · [Time]\n📍 [Location]\n🔗 RSVP link in bio — spots are filling fast!\n\n#UW #CampusLife #HuskyNation #[OrgName]`,
  twitter: (title: string) =>
    `We're hosting ${title} and it's going to be 🔥\n\n📅 [Date] @ [Time] | [Location]\nFree for all UW students → RSVP: [link]\n\n#UW #HuskyLife`,
  linkedin: (title: string) =>
    `We're excited to announce ${title} — an event designed for students who want to [goal].\n\nThis is an opportunity to [value prop: connect with peers, gain skills, hear from industry leaders, etc.].\n\n📅 Date: [Date]\n⏰ Time: [Time]\n📍 Location: [Location]\n🎟️ Free for UW students\n\nRSVP here: [link]\n\nWe hope to see you there.`,
  email: (title: string) =>
    `Subject: You're invited — ${title}\n\nHi [Name],\n\nWe'd love to have you join us for ${title}.\n\n[Short description of what it is and why it's worth attending.]\n\nHere's what to expect:\n• [Key highlight 1]\n• [Key highlight 2]\n• [Key highlight 3]\n\n📅 [Date] · [Time]\n📍 [Location]\n🎟️ Free for UW students\n\nRSVP here: [Link] — limited spots available.\n\nQuestions? Reply to this email or DM us on Instagram.\n\nHope to see you there,\n[Your name]\n[Org Name]`,
  reminder: (title: string) =>
    `Hi [Name]! Quick reminder — ${title} is TOMORROW at [Time] in [Location]. We're looking forward to seeing you! Any questions? DM us. See you soon 👋`,
  description: (title: string) =>
    `${title} is a [format] event hosted by [Org Name], open to all UW students.\n\nJoin us for [brief description of experience: what attendees will do, see, learn, or feel]. Whether you're [audience type 1] or [audience type 2], there's something here for you.\n\nExpect [highlight 1], [highlight 2], and [highlight 3].\n\n📅 [Date] · [Time – Time]\n📍 [Location]\n🎟️ Free admission · RSVP encouraged`,
}

// ── Create Event helpers ───────────────────────────────────────────────────────

const CREATE_CONFLICTS = [
  { time: "18:00", name: "Huskies Football Game", impact: "High" },
  { time: "19:00", name: "CSE Lecture Series", impact: "Medium" },
]

const ceInputClass =
  "w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white/80 placeholder-white/25 outline-none focus:border-[#4b2e83]/60 focus:ring-1 focus:ring-[#4b2e83]/40 transition-colors"

const ceLabelClass = "block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider"

function CESectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#0d0a1a] border border-white/8 rounded-xl p-6">
      {children}
    </div>
  )
}

function CESectionHeader({ number, title }: { number: number; title: string }) {
  return (
    <h2 className="text-sm font-semibold text-white/80 flex items-center gap-2.5 mb-6">
      <span className="w-5 h-5 rounded-full bg-[#4b2e83]/60 border border-[#4b2e83]/40 text-white flex items-center justify-center text-[10px] font-bold">
        {number}
      </span>
      {title}
    </h2>
  )
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function TabButton({ id, active, icon, label, onClick }: {
  id: Tab; active: boolean; icon: React.ReactNode; label: string; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all cursor-pointer ${
        active
          ? 'bg-[#4b2e83]/50 border border-[#4b2e83]/60 text-white/90'
          : 'text-white/40 hover:text-white/70 hover:bg-white/5 border border-transparent'
      }`}
    >
      {icon}
      {label}
    </button>
  )
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={copy}
      className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/40 hover:text-white/70 transition-colors cursor-pointer"
    >
      {copied ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}

// ── Idea Generator Tab ─────────────────────────────────────────────────────────

function IdeaGenerator() {
  const [form, setForm] = useState<Record<string, string>>({
    orgType: '', audience: '', goals: '', budget: '', resources: '', timeOfYear: '',
  })
  const [loading, setLoading] = useState(false)
  const [ideas, setIdeas] = useState<EventIdea[] | null>(null)
  const [expandedIdx, setExpandedIdx] = useState<number | null>(0)

  const set = (k: string) => (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const generate = () => {
    setLoading(true)
    setIdeas(null)
    setTimeout(() => {
      setIdeas(generateIdeas(form))
      setExpandedIdx(0)
      setLoading(false)
    }, 2200)
  }

  const ready = form.orgType && form.goals

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.4fr]">
      {/* Input panel */}
      <div className="space-y-4">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-5">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#b7a57a]/70 mb-4">Tell us about your org</h3>

          <div className="space-y-3.5">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-white/40 mb-1.5">Organization type</label>
              <select value={form.orgType} onChange={set('orgType')} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 outline-none focus:border-[#4b2e83]/60 cursor-pointer">
                <option value="" className="bg-[#0d0a1a]">Select category…</option>
                <option value="cultural" className="bg-[#0d0a1a]">Cultural / Heritage</option>
                <option value="professional" className="bg-[#0d0a1a]">Professional / Career</option>
                <option value="social" className="bg-[#0d0a1a]">Social / Community</option>
                <option value="academic" className="bg-[#0d0a1a]">Academic / Research</option>
                <option value="service" className="bg-[#0d0a1a]">Service / Advocacy</option>
                <option value="sports" className="bg-[#0d0a1a]">Sports / Recreation</option>
                <option value="greek" className="bg-[#0d0a1a]">Greek Life</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-white/40 mb-1.5">Target audience</label>
              <select value={form.audience} onChange={set('audience')} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 outline-none focus:border-[#4b2e83]/60 cursor-pointer">
                <option value="" className="bg-[#0d0a1a]">All students</option>
                <option value="freshmen" className="bg-[#0d0a1a]">Freshmen / New students</option>
                <option value="cs" className="bg-[#0d0a1a]">CS / Engineering majors</option>
                <option value="business" className="bg-[#0d0a1a]">Business majors</option>
                <option value="grad" className="bg-[#0d0a1a]">Graduate students</option>
                <option value="transfer" className="bg-[#0d0a1a]">Transfer students</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-white/40 mb-1.5">Primary goal <span className="text-red-400">*</span></label>
              <select value={form.goals} onChange={set('goals')} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 outline-none focus:border-[#4b2e83]/60 cursor-pointer">
                <option value="" className="bg-[#0d0a1a]">Select goal…</option>
                <option value="networking" className="bg-[#0d0a1a]">Networking</option>
                <option value="education" className="bg-[#0d0a1a]">Education / Skill building</option>
                <option value="community" className="bg-[#0d0a1a]">Community building</option>
                <option value="fundraising" className="bg-[#0d0a1a]">Fundraising</option>
                <option value="recruitment" className="bg-[#0d0a1a]">Recruitment</option>
                <option value="celebration" className="bg-[#0d0a1a]">Cultural celebration</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-white/40 mb-1.5">Budget range</label>
              <select value={form.budget} onChange={set('budget')} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 outline-none focus:border-[#4b2e83]/60 cursor-pointer">
                <option value="" className="bg-[#0d0a1a]">Any budget</option>
                <option value="zero" className="bg-[#0d0a1a]">$0 — Free only</option>
                <option value="low" className="bg-[#0d0a1a]">Under $100</option>
                <option value="mid" className="bg-[#0d0a1a]">$100–$300</option>
                <option value="high" className="bg-[#0d0a1a]">$300–$600</option>
                <option value="premium" className="bg-[#0d0a1a]">$600+</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-white/40 mb-1.5">Time of year</label>
              <select value={form.timeOfYear} onChange={set('timeOfYear')} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 outline-none focus:border-[#4b2e83]/60 cursor-pointer">
                <option value="" className="bg-[#0d0a1a]">Any time</option>
                <option value="fall-start" className="bg-[#0d0a1a]">Start of Fall Quarter</option>
                <option value="fall-mid" className="bg-[#0d0a1a]">Mid Fall Quarter</option>
                <option value="winter" className="bg-[#0d0a1a]">Winter Quarter</option>
                <option value="spring" className="bg-[#0d0a1a]">Spring Quarter</option>
                <option value="end-quarter" className="bg-[#0d0a1a]">End of Quarter</option>
              </select>
            </div>
          </div>

          <button
            onClick={generate}
            disabled={!ready || loading}
            className={`mt-5 w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all cursor-pointer ${
              ready && !loading
                ? 'bg-[#4b2e83]/60 border border-[#4b2e83]/50 text-white hover:bg-[#4b2e83]/80'
                : 'bg-white/5 border border-white/10 text-white/25 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <><Loader2 size={14} className="animate-spin" /> Generating ideas…</>
            ) : (
              <><Sparkles size={14} /> Generate Event Ideas</>
            )}
          </button>
        </div>
      </div>

      {/* Output panel */}
      <div className="space-y-3">
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-16"
            >
              <div className="relative">
                <div className="h-12 w-12 rounded-full border-2 border-[#4b2e83]/30 border-t-[#b7a57a] animate-spin" />
                <Sparkles size={16} className="absolute inset-0 m-auto text-[#b7a57a]" />
              </div>
              <p className="text-sm text-white/40">Analyzing your org profile…</p>
              <p className="text-xs text-white/20">Matching against campus event patterns</p>
            </motion.div>
          )}

          {!loading && !ideas && (
            <motion.div
              key="empty"
              className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/10 p-16 text-center"
            >
              <Sparkles size={28} className="text-white/15" />
              <p className="text-sm text-white/30">Fill in the form and generate ideas</p>
              <p className="text-xs text-white/15">AI will suggest 5 event concepts tailored to your org</p>
            </motion.div>
          )}

          {!loading && ideas && (
            <motion.div key="results" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              <p className="text-xs text-white/30 font-medium uppercase tracking-wider">5 ideas generated</p>
              {ideas.map((idea, i) => (
                <div
                  key={i}
                  className={`rounded-2xl border bg-white/[0.04] backdrop-blur-sm overflow-hidden transition-colors ${
                    expandedIdx === i ? 'border-[#4b2e83]/40' : 'border-white/8 hover:border-white/15'
                  }`}
                >
                  <button
                    className="w-full flex items-center justify-between gap-3 p-4 text-left cursor-pointer"
                    onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#4b2e83]/30 text-[10px] font-bold text-[#b7a57a]">{i + 1}</span>
                      <div>
                        <p className="text-sm font-bold text-white/90">{idea.name}</p>
                        <p className="text-xs text-white/40">{idea.format}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {idea.tags.map(t => (
                        <span key={t} className="hidden sm:block text-[10px] border border-white/10 rounded-full px-2 py-0.5 text-white/30">{t}</span>
                      ))}
                      {expandedIdx === i ? <ChevronUp size={14} className="text-white/30" /> : <ChevronDown size={14} className="text-white/30" />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {expandedIdx === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-white/8 px-4 pb-4 pt-3 space-y-4">
                          <div className="grid grid-cols-3 gap-3">
                            <div className="rounded-lg bg-white/5 p-2.5 text-center">
                              <Users size={12} className="mx-auto mb-1 text-[#b7a57a]/60" />
                              <p className="text-[10px] text-white/30">Attendance</p>
                              <p className="text-xs font-bold text-white/70">{idea.estimatedAttendance}</p>
                            </div>
                            <div className="rounded-lg bg-white/5 p-2.5 text-center">
                              <Clock size={12} className="mx-auto mb-1 text-[#b7a57a]/60" />
                              <p className="text-[10px] text-white/30">Best timing</p>
                              <p className="text-xs font-bold text-white/70">{idea.timing}</p>
                            </div>
                            <div className="rounded-lg bg-white/5 p-2.5 text-center">
                              <Star size={12} className="mx-auto mb-1 text-[#b7a57a]/60" />
                              <p className="text-[10px] text-white/30">Format</p>
                              <p className="text-xs font-bold text-white/70">Event</p>
                            </div>
                          </div>

                          <div>
                            <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1.5">Why it works</p>
                            <p className="text-xs text-white/60 leading-relaxed">{idea.whyItWorks}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1.5">Key logistics</p>
                              <ul className="space-y-1">
                                {idea.logistics.map((l, j) => (
                                  <li key={j} className="flex items-start gap-1.5 text-xs text-white/50">
                                    <span className="mt-0.5 text-[#b7a57a]/40">–</span>{l}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1.5">Sample agenda</p>
                              <ul className="space-y-1">
                                {idea.agenda.map((a, j) => (
                                  <li key={j} className="text-[11px] font-mono text-white/40">{a}</li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <button
                            onClick={() => window.location.href = '/contributor/studio'}
                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#4b2e83]/40 bg-[#4b2e83]/20 py-2 text-xs font-semibold text-white/80 hover:bg-[#4b2e83]/35 transition-colors cursor-pointer"
                          >
                            Use this idea <ArrowRight size={12} />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ── Templates Tab ──────────────────────────────────────────────────────────────

function Templates() {
  const [selected, setSelected] = useState<Template | null>(null)
  const [section, setSection] = useState<'timeline' | 'budget' | 'copy' | 'pitfalls'>('timeline')

  const difficultyColor = (d: Template['difficulty']) =>
    d === 'Easy' ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10' :
    d === 'Medium' ? 'text-[#b7a57a] border-[#b7a57a]/20 bg-[#b7a57a]/10' :
    'text-red-400 border-red-500/20 bg-red-500/10'

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
      {/* Template list */}
      <div className="space-y-2">
        <p className="text-[10px] uppercase tracking-wider text-white/30 mb-3">3 templates</p>
        {TEMPLATES.map(t => (
          <button
            key={t.id}
            onClick={() => { setSelected(t); setSection('timeline') }}
            className={`w-full rounded-xl border p-3.5 text-left transition-all cursor-pointer ${
              selected?.id === t.id
                ? 'border-[#4b2e83]/50 bg-[#4b2e83]/15'
                : 'border-white/8 bg-white/[0.03] hover:border-white/15 hover:bg-white/5'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-bold text-white/85">{t.name}</p>
                <p className="text-xs text-white/35 mt-0.5">{t.category}</p>
              </div>
              <span className={`text-[10px] font-medium border rounded-full px-2 py-0.5 shrink-0 ${difficultyColor(t.difficulty)}`}>
                {t.difficulty}
              </span>
            </div>
            <div className="mt-2 flex gap-3">
              <span className="flex items-center gap-1 text-[11px] text-white/30">
                <Clock size={10} />{t.duration}
              </span>
              <span className="flex items-center gap-1 text-[11px] text-white/30">
                <DollarSign size={10} />{t.budget}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Template detail */}
      {selected ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-5 space-y-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[#b7a57a]/60">{selected.category}</p>
              <h3 className="text-xl font-black text-white/90 mt-0.5">{selected.name}</h3>
              <p className="text-sm text-white/45 mt-1">{selected.description}</p>
            </div>
            <button
              onClick={() => window.location.href = '/contributor/studio'}
              className="shrink-0 flex items-center gap-1.5 rounded-xl border border-[#4b2e83]/40 bg-[#4b2e83]/20 px-3 py-1.5 text-xs font-semibold text-white/80 hover:bg-[#4b2e83]/35 transition-colors cursor-pointer"
            >
              Use <ArrowRight size={11} />
            </button>
          </div>

          {/* Section tabs */}
          <div className="flex gap-1 rounded-xl border border-white/8 bg-white/[0.02] p-1">
            {(['timeline', 'budget', 'copy', 'pitfalls'] as const).map(s => (
              <button
                key={s}
                onClick={() => setSection(s)}
                className={`flex-1 rounded-lg py-1.5 text-[11px] font-semibold uppercase tracking-wide transition-colors cursor-pointer ${
                  section === s ? 'bg-white/10 text-white/80' : 'text-white/30 hover:text-white/60'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={section} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
              {section === 'timeline' && (
                <div className="space-y-4">
                  {selected.timeline.map(phase => (
                    <div key={phase.phase}>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#b7a57a]/70 mb-2">{phase.phase}</p>
                      <ul className="space-y-1.5">
                        {phase.tasks.map((task, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-white/65">
                            <CheckCircle2 size={13} className="mt-0.5 shrink-0 text-[#4b2e83]/60" />
                            {task}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  <div className="pt-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#b7a57a]/70 mb-2">Day-of Run Sheet</p>
                    <ul className="space-y-1">
                      {selected.dayOfSheet.map((item, i) => (
                        <li key={i} className="font-mono text-xs text-white/50">{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {section === 'budget' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    {selected.budgetBreakdown.map(b => (
                      <div key={b.item} className="flex items-center justify-between rounded-lg border border-white/8 bg-white/[0.03] px-3 py-2">
                        <span className="text-sm text-white/70">{b.item}</span>
                        <span className="text-sm font-mono font-bold text-[#b7a57a]/80">{b.range}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-white/30 mb-2">Venue Requirements</p>
                    <ul className="space-y-1">
                      {selected.venueNeeds.map((v, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-white/55">
                          <span className="h-1 w-1 rounded-full bg-[#b7a57a]/50" />{v}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-white/30 mb-2">Promo Timeline</p>
                    <ul className="space-y-1">
                      {selected.promoTimeline.map((p, i) => (
                        <li key={i} className="text-xs text-white/55">{p}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {section === 'copy' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-white/60">{selected.sampleCopy.type}</p>
                    <CopyButton text={selected.sampleCopy.text} />
                  </div>
                  <pre className="whitespace-pre-wrap rounded-xl border border-white/8 bg-white/[0.03] p-4 text-xs text-white/60 leading-relaxed font-mono">
                    {selected.sampleCopy.text}
                  </pre>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-white/30 mb-2">Success Metrics to Track</p>
                    <div className="flex flex-wrap gap-2">
                      {selected.metrics.map(m => (
                        <span key={m} className="text-xs border border-white/10 rounded-full px-2.5 py-1 text-white/45">{m}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {section === 'pitfalls' && (
                <div className="space-y-2.5">
                  <p className="text-xs text-white/35 mb-3">Common mistakes and how to avoid them</p>
                  {selected.pitfalls.map((p, i) => (
                    <div key={i} className="flex items-start gap-2.5 rounded-xl border border-yellow-500/15 bg-yellow-500/[0.06] px-3.5 py-2.5">
                      <AlertTriangle size={13} className="mt-0.5 shrink-0 text-yellow-400/60" />
                      <p className="text-xs text-white/65 leading-relaxed">{p}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex items-center justify-center rounded-2xl border border-dashed border-white/10 p-16">
          <div className="text-center">
            <BookOpen size={28} className="mx-auto mb-3 text-white/15" />
            <p className="text-sm text-white/30">Select a template to view the full playbook</p>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Collaborations Tab ─────────────────────────────────────────────────────────

function Collaborations() {
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-4">
        <p className="text-xs text-white/40 leading-relaxed">
          Based on cross-attendance patterns and shared student interests, these organizations have the highest collaboration potential with your community.
        </p>
      </div>

      {COLLABS.map(c => (
        <div
          key={c.org}
          className={`rounded-2xl border bg-white/[0.04] backdrop-blur-sm overflow-hidden transition-colors ${
            expanded === c.org ? 'border-white/15' : 'border-white/8 hover:border-white/12'
          }`}
        >
          <div className="flex items-center gap-4 p-4">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-black text-white"
              style={{ background: c.color + '40', border: `1px solid ${c.color}50` }}
            >
              {c.initials}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <p className="font-bold text-white/85 text-sm">{c.org}</p>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2 py-0.5">
                  {c.overlap}% overlap
                </span>
              </div>
              <p className="text-xs text-white/35 mt-0.5">{c.attendees.toLocaleString()} active members</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-white/50 hover:text-white/80 transition-colors cursor-pointer">
                <MessageSquare size={11} /> Message
              </button>
              <button
                onClick={() => setExpanded(expanded === c.org ? null : c.org)}
                className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-white/50 hover:text-white/80 transition-colors cursor-pointer"
              >
                {expanded === c.org ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {expanded === c.org && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="border-t border-white/8 p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1.5">Shared interests</p>
                      <div className="flex flex-wrap gap-1.5">
                        {c.sharedInterests.map(s => (
                          <span key={s} className="text-[11px] border border-white/10 rounded-full px-2 py-0.5 text-white/45">{s}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1.5">Suggested co-event</p>
                      <p className="text-sm font-bold text-[#b7a57a]/80">{c.suggestedEvent}</p>
                    </div>
                  </div>
                  <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
                    <p className="text-xs text-white/55 leading-relaxed">{c.reason}</p>
                  </div>
                  <button className="flex items-center gap-2 rounded-xl border border-[#4b2e83]/40 bg-[#4b2e83]/15 px-4 py-2 text-xs font-semibold text-white/80 hover:bg-[#4b2e83]/25 transition-colors cursor-pointer">
                    Propose collaboration <ArrowRight size={11} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}

// ── Content Studio Tab ─────────────────────────────────────────────────────────

function ContentStudio() {
  const [eventTitle, setEventTitle] = useState('')
  const [tone, setTone] = useState(50)
  const [loading, setLoading] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const generate = () => {
    if (!eventTitle.trim()) return
    setLoading(true)
    setGenerated(false)
    setTimeout(() => { setLoading(false); setGenerated(true) }, 2400)
  }

  const toneLabel = tone < 30 ? 'Professional' : tone < 70 ? 'Balanced' : 'Casual'

  const platforms = [
    { key: 'instagram', icon: <Instagram size={13} />, label: 'Instagram', color: '#E1306C' },
    { key: 'twitter', icon: <Twitter size={13} />, label: 'Twitter / X', color: '#1DA1F2' },
    { key: 'linkedin', icon: <Linkedin size={13} />, label: 'LinkedIn', color: '#0A66C2' },
    { key: 'email', icon: <Mail size={13} />, label: 'Email invite', color: '#b7a57a' },
    { key: 'reminder', icon: <MessageSquare size={13} />, label: 'Reminder', color: '#10b981' },
    { key: 'description', icon: <BookOpen size={13} />, label: 'Platform description', color: '#7c5cbf' },
  ]

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.5fr]">
      {/* Input */}
      <div className="space-y-4">
        {/* Upload zone */}
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => {
            e.preventDefault(); setDragging(false)
            const file = e.dataTransfer.files[0]
            if (file) setFileName(file.name)
          }}
          onClick={() => fileRef.current?.click()}
          className={`relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-8 transition-all ${
            dragging ? 'border-[#4b2e83]/60 bg-[#4b2e83]/10' : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
          }`}
        >
          <input ref={fileRef} type="file" accept="image/*,.pdf" className="hidden" onChange={e => {
            const file = e.target.files?.[0]
            if (file) setFileName(file.name)
          }} />
          {fileName ? (
            <>
              <CheckCircle2 size={24} className="text-emerald-400" />
              <p className="text-sm font-medium text-white/70">{fileName}</p>
              <p className="text-xs text-white/30">Click to replace</p>
            </>
          ) : (
            <>
              <Upload size={22} className="text-white/25" />
              <p className="text-sm text-white/40">Upload flyer or PDF</p>
              <p className="text-xs text-white/20">PNG, JPG, PDF · AI will extract event details</p>
            </>
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-4 space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-white/40 mb-1.5">Event name <span className="text-red-400">*</span></label>
            <input
              value={eventTitle}
              onChange={e => setEventTitle(e.target.value)}
              placeholder="e.g. Diwali Festival of Lights"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 placeholder-white/25 outline-none focus:border-[#4b2e83]/60 transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] uppercase tracking-wider text-white/40">Tone</label>
              <span className="text-[11px] text-[#b7a57a]/70 font-medium">{toneLabel}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-white/25">Formal</span>
              <input type="range" min={0} max={100} value={tone} onChange={e => setTone(+e.target.value)} className="flex-1 accent-[#b7a57a] cursor-pointer" />
              <span className="text-[10px] text-white/25">Casual</span>
            </div>
          </div>

          <button
            onClick={generate}
            disabled={!eventTitle.trim() || loading}
            className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all cursor-pointer ${
              eventTitle.trim() && !loading
                ? 'bg-[#4b2e83]/60 border border-[#4b2e83]/50 text-white hover:bg-[#4b2e83]/80'
                : 'bg-white/5 border border-white/10 text-white/25 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <><Loader2 size={14} className="animate-spin" /> Generating content…</>
            ) : (
              <><Wand2 size={14} /> Generate All Content</>
            )}
          </button>
        </div>
      </div>

      {/* Output */}
      <div className="space-y-3">
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-16"
            >
              <div className="relative">
                <div className="h-12 w-12 rounded-full border-2 border-[#4b2e83]/30 border-t-[#b7a57a] animate-spin" />
                <Wand2 size={16} className="absolute inset-0 m-auto text-[#b7a57a]" />
              </div>
              <p className="text-sm text-white/40">Writing your content…</p>
            </motion.div>
          )}

          {!loading && !generated && (
            <motion.div key="empty" className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/10 p-16 text-center">
              <Wand2 size={28} className="text-white/15" />
              <p className="text-sm text-white/30">Enter an event name and generate content</p>
              <p className="text-xs text-white/15">Instagram, Twitter, LinkedIn, email, and more</p>
            </motion.div>
          )}

          {!loading && generated && (
            <motion.div key="results" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2.5">
              {platforms.map(p => {
                const content = CONTENT_EXAMPLES[p.key as keyof typeof CONTENT_EXAMPLES]?.(eventTitle) ?? ''
                return (
                  <div key={p.key} className="rounded-xl border border-white/8 bg-white/[0.04] backdrop-blur-sm overflow-hidden">
                    <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-white/6">
                      <div className="flex items-center gap-2" style={{ color: p.color + 'cc' }}>
                        {p.icon}
                        <span className="text-xs font-semibold">{p.label}</span>
                      </div>
                      <CopyButton text={content} />
                    </div>
                    <pre className="whitespace-pre-wrap px-3.5 py-3 text-xs text-white/55 leading-relaxed font-mono max-h-36 overflow-y-auto">
                      {content}
                    </pre>
                  </div>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ── Main Studio Page ───────────────────────────────────────────────────────────

export function Studio() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tab>('ideas')

  // Create Event state
  const [ceDate, setCeDate] = useState<Date>()
  const [ceShowCalendar, setCeShowCalendar] = useState(false)
  const [ceIsImporting, setCeIsImporting] = useState(false)
  const [ceIsSubmitting, setCeIsSubmitting] = useState(false)
  const [ceSubmitError, setCeSubmitError] = useState<string | null>(null)
  const [ceSelectedRoom, setCeSelectedRoom] = useState<string | null>(null)
  const [ceMazevoRequestId, setCeMazevoRequestId] = useState("")
  const [ceIsVerifyingMazevo, setCeIsVerifyingMazevo] = useState(false)
  const [ceMazevoSuccess, setCeMazevoSuccess] = useState(false)

  const { register: ceRegister, handleSubmit: ceHandleSubmit, setValue: ceSetValue, watch: ceWatch, formState: { errors: ceErrors } } = useForm()

  const ceStartTime = ceWatch("startTime")
  const ceHasConflict = CREATE_CONFLICTS.some(c => c.time === ceStartTime)

  const handleCeInstagramImport = () => {
    setCeIsImporting(true)
    setTimeout(() => {
      ceSetValue("title", "Husky Coding Club Hackathon")
      ceSetValue("description", "Join us for a 24-hour coding marathon! Food and prizes provided. #huskies #coding #uw")
      ceSetValue("location", "HUB 250")
      setCeIsImporting(false)
    }, 1500)
  }

  const handleCeVerifyMazevo = () => {
    if (!ceMazevoRequestId) return
    setCeIsVerifyingMazevo(true)
    setTimeout(() => {
      setCeIsVerifyingMazevo(false)
      setCeMazevoSuccess(true)
      ceSetValue("location", "HUB 250 (Confirmed via Mazevo)")
    }, 1500)
  }

  const onCeSubmit = async (data: any) => {
    if (!ceDate) {
      setCeSubmitError('Please select a date for the event.')
      return
    }
    setCeIsSubmitting(true)
    setCeSubmitError(null)

    // Combine date + startTime into ISO datetime
    const [hours, minutes] = (data.startTime || '12:00').split(':').map(Number)
    const dateTime = new Date(ceDate)
    dateTime.setHours(hours, minutes, 0, 0)

    try {
      await eventsApi.createEvent({
        title: data.title,
        description: data.description || '',
        date_time: dateTime.toISOString(),
        location: data.location || '',
        tags: [],
      })
      navigate('/contributor/events')
    } catch (err: any) {
      setCeSubmitError(err?.message || 'Failed to create event. Please try again.')
    } finally {
      setCeIsSubmitting(false)
    }
  }

  const tabs: { id: Tab; icon: React.ReactNode; label: string }[] = [
    { id: 'ideas',     icon: <Sparkles size={13} />,     label: 'Idea Generator'   },
    { id: 'templates', icon: <BookOpen size={13} />,     label: 'Templates'        },
    { id: 'collabs',   icon: <Users size={13} />,        label: 'Collaborations'   },
    { id: 'content',   icon: <Wand2 size={13} />,        label: 'Content Studio'   },
    { id: 'create',    icon: <PlusCircle size={15} />,   label: 'Create Event'     },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-5 sm:p-7">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#4b2e83]/10 via-transparent to-[#b7a57a]/5" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={14} className="text-[#b7a57a]/70" />
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#b7a57a]/60">Contributor's Studio</p>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white/90 md:text-3xl">AI-Powered Event Workspace</h1>
          <p className="mt-1.5 max-w-2xl text-sm text-white/40">
            Generate event concepts, access proven playbooks, find collaboration partners, and create marketing content — all in one place.
          </p>
        </div>
      </section>

      {/* Tabs */}
      <div className="flex gap-1.5 flex-wrap">
        {tabs.map(t => (
          <TabButton key={t.id} id={t.id} active={activeTab === t.id} icon={t.icon} label={t.label} onClick={() => setActiveTab(t.id)} />
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18 }}
        >
          {activeTab === 'ideas'     && <IdeaGenerator />}
          {activeTab === 'templates' && <Templates />}
          {activeTab === 'collabs'   && <Collaborations />}
          {activeTab === 'content'   && <ContentStudio />}
          {activeTab === 'create' && (
            <div className="max-w-4xl mx-auto pb-12">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-white/90 tracking-tight">Create New Event</h1>
                <p className="text-sm text-white/35 mt-1">Fill in the details to publish your event to madr.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Form */}
                <div className="lg:col-span-2 space-y-6">

                  {/* Section 1: Event Details */}
                  <CESectionCard>
                    <div className="flex items-center justify-between mb-6">
                      <CESectionHeader number={1} title="Event Details" />
                      <button
                        onClick={handleCeInstagramImport}
                        disabled={ceIsImporting}
                        className="text-xs flex items-center gap-1.5 text-[#E1306C]/80 hover:text-[#E1306C] border border-[#E1306C]/20 hover:border-[#E1306C]/40 px-3 py-1.5 rounded-lg transition-colors font-medium cursor-pointer disabled:opacity-50"
                      >
                        {ceIsImporting ? (
                          <><Loader2 size={12} className="animate-spin" /> Importing...</>
                        ) : (
                          <><Instagram size={13} /> Auto-fill from Instagram</>
                        )}
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className={ceLabelClass}>Event Title</label>
                        <input
                          {...ceRegister("title", { required: true })}
                          className={ceInputClass}
                          placeholder="e.g. Annual Spring Gala"
                        />
                        {ceErrors.title && <span className="text-red-400/80 text-xs mt-1 block">Title is required</span>}
                      </div>

                      <div>
                        <label className={ceLabelClass}>Description</label>
                        <textarea
                          {...ceRegister("description")}
                          rows={4}
                          className={ceInputClass + " resize-none"}
                          placeholder="Describe your event..."
                        />
                      </div>

                      <div>
                        <label className={ceLabelClass}>Event Access</label>
                        <select
                          {...ceRegister("access")}
                          className={ceInputClass + " cursor-pointer"}
                        >
                          <option value="open" className="bg-[#0d0a1a]">Open to All</option>
                          <option value="members" className="bg-[#0d0a1a]">Member-Exclusive</option>
                        </select>
                        <p className="text-xs text-white/25 mt-1.5">Choose whether this event is open to everyone or limited to members only.</p>
                      </div>

                      <div>
                        <label className={ceLabelClass}>Cover Image</label>
                        <div className="border border-dashed border-white/10 hover:border-[#4b2e83]/50 bg-white/[0.02] hover:bg-[#4b2e83]/5 rounded-lg p-8 text-center transition-colors cursor-pointer">
                          <Upload className="mx-auto h-8 w-8 text-white/20 mb-2" />
                          <p className="text-sm text-white/35">Click to upload or drag and drop</p>
                          <p className="text-xs text-white/20 mt-1">PNG, JPG up to 10MB</p>
                        </div>
                      </div>
                    </div>
                  </CESectionCard>

                  {/* Section 2: Date & Time */}
                  <CESectionCard>
                    <CESectionHeader number={2} title="Date & Time" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={ceLabelClass}>Date</label>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setCeShowCalendar(!ceShowCalendar)}
                            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg flex items-center justify-between text-sm text-left hover:border-white/20 transition-colors cursor-pointer"
                          >
                            <span className={!ceDate ? "text-white/25" : "text-white/80"}>
                              {ceDate ? format(ceDate, "PPP") : "Pick a date"}
                            </span>
                            <CalendarIcon size={14} className="text-white/30" />
                          </button>
                          {ceShowCalendar && (
                            <div className="absolute top-full left-0 mt-2 p-3 bg-[#0d0a1a] border border-white/10 rounded-xl shadow-2xl z-20">
                              <style>{".rdp { --rdp-accent-color: #4b2e83; --rdp-background-color: #4b2e83; color: rgba(255,255,255,0.7); } .rdp-day_selected { background: #4b2e83; color: white; } .rdp-button:hover { background: rgba(75,46,131,0.3); } .rdp-caption_label, .rdp-head_cell { color: rgba(255,255,255,0.4); }"}</style>
                              <DayPicker
                                mode="single"
                                selected={ceDate}
                                onSelect={(d) => { setCeDate(d); setCeShowCalendar(false) }}
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className={ceLabelClass}>Start Time</label>
                        <select
                          {...ceRegister("startTime")}
                          className={ceInputClass + " cursor-pointer"}
                        >
                          <option value="" className="bg-[#0d0a1a]">Select time</option>
                          <option value="09:00" className="bg-[#0d0a1a]">9:00 AM</option>
                          <option value="12:00" className="bg-[#0d0a1a]">12:00 PM</option>
                          <option value="15:00" className="bg-[#0d0a1a]">3:00 PM</option>
                          <option value="18:00" className="bg-[#0d0a1a]">6:00 PM</option>
                          <option value="19:00" className="bg-[#0d0a1a]">7:00 PM</option>
                        </select>
                      </div>
                    </div>

                    {ceHasConflict && (
                      <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start gap-3">
                        <AlertTriangle className="text-yellow-400/80 shrink-0 mt-0.5" size={16} />
                        <div>
                          <h4 className="font-semibold text-yellow-300/80 text-xs uppercase tracking-wide">Potential Conflict Detected</h4>
                          <p className="text-yellow-200/50 text-xs mt-1 leading-relaxed">
                            There is a major event "Huskies Football Game" happening at this time.
                            Consider rescheduling to maximize attendance.
                          </p>
                        </div>
                      </div>
                    )}
                  </CESectionCard>

                  {/* Section 3: Location */}
                  <CESectionCard>
                    <CESectionHeader number={3} title="Location & Room Booking" />

                    <div className="space-y-4">
                      {/* Toggle */}
                      <div className="flex gap-2 p-1 bg-white/5 rounded-lg border border-white/8">
                        <button
                          type="button"
                          onClick={() => setCeSelectedRoom(null)}
                          className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all cursor-pointer ${
                            !ceSelectedRoom
                              ? "bg-[#4b2e83]/50 border border-[#4b2e83]/40 text-white/90"
                              : "text-white/35 hover:text-white/60"
                          }`}
                        >
                          Custom Location
                        </button>
                        <button
                          type="button"
                          onClick={() => setCeSelectedRoom("mazevo")}
                          className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all cursor-pointer ${
                            ceSelectedRoom
                              ? "bg-[#4b2e83]/50 border border-[#4b2e83]/40 text-white/90"
                              : "text-white/35 hover:text-white/60"
                          }`}
                        >
                          Book Campus Room (Mazevo)
                        </button>
                      </div>

                      {!ceSelectedRoom ? (
                        <div>
                          <label className={ceLabelClass}>Address / Location Name</label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" size={15} />
                            <input
                              {...ceRegister("location")}
                              className={ceInputClass + " pl-10"}
                              placeholder="e.g. Red Square"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="bg-white/[0.03] border border-white/8 rounded-lg p-5">
                          <div className="flex items-start gap-4">
                            <div className="bg-[#4b2e83]/20 border border-[#4b2e83]/30 p-2.5 rounded-lg shrink-0">
                              <ExternalLink className="text-[#b7a57a]/70" size={18} />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-white/80 text-sm">Book via Mazevo</h4>
                              <p className="text-xs text-white/35 mt-1 mb-4 leading-relaxed">
                                UW uses Mazevo for room scheduling. Open the portal, complete your booking, then return here to sync.
                              </p>

                              <a
                                href="https://mazevo.uw.edu"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-[#4b2e83]/50 hover:bg-[#4b2e83]/70 border border-[#4b2e83]/40 text-white/90 rounded-lg text-xs font-medium transition-colors mb-5"
                              >
                                Launch Mazevo <ExternalLink size={12} />
                              </a>

                              <div className="border-t border-white/8 pt-4">
                                <label className={ceLabelClass}>Already booked? Enter Confirmation ID</label>
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    value={ceMazevoRequestId}
                                    onChange={(e) => setCeMazevoRequestId(e.target.value)}
                                    placeholder="e.g. #12345"
                                    disabled={ceMazevoSuccess}
                                    className={ceInputClass + " disabled:opacity-40"}
                                  />
                                  <button
                                    type="button"
                                    onClick={handleCeVerifyMazevo}
                                    disabled={!ceMazevoRequestId || ceIsVerifyingMazevo || ceMazevoSuccess}
                                    className="px-4 py-2.5 bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 text-white/70 rounded-lg text-xs font-medium transition-colors disabled:opacity-40 cursor-pointer whitespace-nowrap"
                                  >
                                    {ceIsVerifyingMazevo
                                      ? <Loader2 className="animate-spin" size={14} />
                                      : ceMazevoSuccess
                                      ? <CheckCircle className="text-emerald-400" size={14} />
                                      : "Verify & Sync"}
                                  </button>
                                </div>
                                {ceMazevoSuccess && (
                                  <div className="mt-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center gap-2 text-emerald-300/80 text-xs">
                                    <CheckCircle size={13} />
                                    <span><span className="font-semibold">Booking Confirmed:</span> HUB 250 (Capacity: 200)</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CESectionCard>
                </div>

                {/* Sidebar Preview */}
                <div className="lg:col-span-1">
                  <div className="bg-[#0d0a1a] border border-white/8 rounded-xl p-5 sticky top-6">
                    <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-4">Event Preview</h3>

                    <div className="border border-white/8 rounded-lg overflow-hidden">
                      <div className="h-36 bg-white/[0.03] flex items-center justify-center">
                        <Upload size={24} className="text-white/15" />
                      </div>
                      <div className="p-4">
                        <h4 className="font-bold text-white/85 text-base leading-tight mb-1">
                          {ceWatch("title") || <span className="text-white/20">Event Title</span>}
                        </h4>
                        <p className="text-xs text-white/35 mb-4 line-clamp-2">
                          {ceWatch("description") || "Event description will appear here..."}
                        </p>

                        <div className="flex items-center gap-2 text-xs text-white/30 mb-1.5">
                          <CalendarIcon size={12} />
                          <span>{ceDate ? format(ceDate, "PPP") : "Date TBD"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-white/30">
                          <Clock size={12} />
                          <span>{ceWatch("startTime") ? `${ceWatch("startTime")} PST` : "Time TBD"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 space-y-2.5">
                      {ceSubmitError && (
                        <p className="text-xs text-red-400/80">{ceSubmitError}</p>
                      )}
                      <button
                        onClick={ceHandleSubmit(onCeSubmit)}
                        disabled={ceIsSubmitting}
                        className="w-full py-2.5 bg-[#4b2e83]/60 hover:bg-[#4b2e83]/80 border border-[#4b2e83]/40 text-white/90 rounded-lg text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {ceIsSubmitting ? (
                          <>
                            <Loader2 size={14} className="animate-spin" />
                            Publishing…
                          </>
                        ) : 'Publish Event'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
