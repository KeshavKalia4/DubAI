import { useEffect, useMemo, useState } from "react"
import { Link, useSearchParams } from "react-router"
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import { ArrowLeft, ArrowUpRight, Search } from "lucide-react"

type ComparativeMetric =
  | "Engagement"
  | "Reach Efficiency"
  | "Registration"
  | "Attendance"
  | "Commitment"
  | "Repeat Rate"

type MetricScores = Record<ComparativeMetric, number>
type Period = "week" | "quarter"
type ViewTab = "within" | "campus"
type CompareMode = "event" | "average"
type AttendanceFilter = "all" | "small" | "medium" | "large"
type AcademicPreset = "all" | "Fall Wk1" | "Fall Wk3" | "Fall Wk7" | "Winter Wk2" | "Winter Wk6"

type CampusEvent = {
  id: string
  name: string
  organization: string
  isMine: boolean
  isPast: boolean
  eventType: "Social" | "Tech/Career" | "Academic" | "Community"
  category: "Networking" | "Workshop" | "Showcase" | "Mixer" | "Panel"
  tags: string[]
  attendance: number
  academicPreset: Exclude<AcademicPreset, "all">
  scores: Record<Period, MetricScores>
}

const METRICS: ComparativeMetric[] = [
  "Engagement",
  "Reach Efficiency",
  "Registration",
  "Attendance",
  "Commitment",
  "Repeat Rate",
]

const METRIC_DEFINITIONS: Record<ComparativeMetric, string> = {
  Engagement: "Composite score from saves, shares, comments, and completion quality.",
  "Reach Efficiency": "How efficiently impressions convert into meaningful interest.",
  Registration: "Percent moving from interest to RSVP/registration.",
  Attendance: "Show-up rate among confirmed attendees.",
  Commitment: "Intent depth from reminders, saves, and pre-event actions.",
  "Repeat Rate": "Percent returning to another event from the same organizer.",
}

const EVENT_CATALOG: CampusEvent[] = [
  {
    id: "founder-sprint",
    name: "Founder Sprint Night",
    organization: "Your Organization",
    isMine: true,
    isPast: true,
    eventType: "Tech/Career",
    category: "Showcase",
    tags: ["startup", "pitch", "innovation"],
    attendance: 142,
    academicPreset: "Winter Wk6",
    scores: {
      week: { Engagement: 79, "Reach Efficiency": 72, Registration: 44, Attendance: 90, Commitment: 77, "Repeat Rate": 61 },
      quarter: { Engagement: 84, "Reach Efficiency": 76, Registration: 49, Attendance: 92, Commitment: 81, "Repeat Rate": 66 },
    },
  },
  {
    id: "career-story",
    name: "Career Story Lab",
    organization: "Your Organization",
    isMine: true,
    isPast: true,
    eventType: "Tech/Career",
    category: "Panel",
    tags: ["career", "mentorship", "alumni"],
    attendance: 89,
    academicPreset: "Winter Wk6",
    scores: {
      week: { Engagement: 73, "Reach Efficiency": 70, Registration: 41, Attendance: 91, Commitment: 74, "Repeat Rate": 57 },
      quarter: { Engagement: 76, "Reach Efficiency": 72, Registration: 43, Attendance: 92, Commitment: 76, "Repeat Rate": 60 },
    },
  },
  {
    id: "research-social",
    name: "Campus Research Social",
    organization: "Your Organization",
    isMine: true,
    isPast: true,
    eventType: "Academic",
    category: "Mixer",
    tags: ["research", "labs", "faculty"],
    attendance: 210,
    academicPreset: "Winter Wk6",
    scores: {
      week: { Engagement: 82, "Reach Efficiency": 74, Registration: 47, Attendance: 93, Commitment: 79, "Repeat Rate": 64 },
      quarter: { Engagement: 86, "Reach Efficiency": 77, Registration: 50, Attendance: 94, Commitment: 82, "Repeat Rate": 67 },
    },
  },
  {
    id: "community-mixer",
    name: "Spring Community Mixer",
    organization: "Your Organization",
    isMine: true,
    isPast: true,
    eventType: "Social",
    category: "Mixer",
    tags: ["community", "social", "students"],
    attendance: 164,
    academicPreset: "Winter Wk6",
    scores: {
      week: { Engagement: 71, "Reach Efficiency": 66, Registration: 39, Attendance: 86, Commitment: 72, "Repeat Rate": 59 },
      quarter: { Engagement: 74, "Reach Efficiency": 68, Registration: 41, Attendance: 88, Commitment: 75, "Repeat Rate": 61 },
    },
  },
  {
    id: "resume-clinic",
    name: "Resume Clinic",
    organization: "Career Center Guild",
    isMine: false,
    isPast: true,
    eventType: "Tech/Career",
    category: "Workshop",
    tags: ["career", "resume", "professional"],
    attendance: 118,
    academicPreset: "Fall Wk7",
    scores: {
      week: { Engagement: 68, "Reach Efficiency": 61, Registration: 36, Attendance: 84, Commitment: 67, "Repeat Rate": 52 },
      quarter: { Engagement: 72, "Reach Efficiency": 65, Registration: 39, Attendance: 86, Commitment: 70, "Repeat Rate": 55 },
    },
  },
  {
    id: "innovation-summit",
    name: "Innovation Summit",
    organization: "Entrepreneur Society",
    isMine: false,
    isPast: true,
    eventType: "Tech/Career",
    category: "Showcase",
    tags: ["startup", "innovation", "networking"],
    attendance: 267,
    academicPreset: "Fall Wk3",
    scores: {
      week: { Engagement: 77, "Reach Efficiency": 69, Registration: 40, Attendance: 84, Commitment: 71, "Repeat Rate": 58 },
      quarter: { Engagement: 81, "Reach Efficiency": 73, Registration: 44, Attendance: 87, Commitment: 74, "Repeat Rate": 61 },
    },
  },
  {
    id: "engineering-expo",
    name: "Engineering Expo",
    organization: "Engineering Council",
    isMine: false,
    isPast: true,
    eventType: "Academic",
    category: "Showcase",
    tags: ["engineering", "expo", "projects"],
    attendance: 245,
    academicPreset: "Fall Wk1",
    scores: {
      week: { Engagement: 70, "Reach Efficiency": 65, Registration: 40, Attendance: 85, Commitment: 72, "Repeat Rate": 58 },
      quarter: { Engagement: 74, "Reach Efficiency": 68, Registration: 42, Attendance: 87, Commitment: 74, "Repeat Rate": 60 },
    },
  },
  {
    id: "greek-life-mixer",
    name: "Greek Life Mixer",
    organization: "Campus Social Board",
    isMine: false,
    isPast: true,
    eventType: "Social",
    category: "Mixer",
    tags: ["social", "greek", "community"],
    attendance: 180,
    academicPreset: "Fall Wk7",
    scores: {
      week: { Engagement: 68, "Reach Efficiency": 62, Registration: 35, Attendance: 78, Commitment: 64, "Repeat Rate": 51 },
      quarter: { Engagement: 71, "Reach Efficiency": 65, Registration: 38, Attendance: 81, Commitment: 67, "Repeat Rate": 54 },
    },
  },
  {
    id: "volunteer-fair",
    name: "Volunteer Fair",
    organization: "Community Impact Coalition",
    isMine: false,
    isPast: true,
    eventType: "Community",
    category: "Showcase",
    tags: ["volunteer", "community", "service"],
    attendance: 142,
    academicPreset: "Winter Wk2",
    scores: {
      week: { Engagement: 71, "Reach Efficiency": 63, Registration: 37, Attendance: 82, Commitment: 67, "Repeat Rate": 53 },
      quarter: { Engagement: 74, "Reach Efficiency": 66, Registration: 40, Attendance: 85, Commitment: 70, "Repeat Rate": 56 },
    },
  },
  {
    id: "winter-ball",
    name: "Winter Ball",
    organization: "Campus Social Board",
    isMine: false,
    isPast: true,
    eventType: "Social",
    category: "Showcase",
    tags: ["formal", "social", "campus"],
    attendance: 428,
    academicPreset: "Winter Wk2",
    scores: {
      week: { Engagement: 74, "Reach Efficiency": 67, Registration: 42, Attendance: 79, Commitment: 70, "Repeat Rate": 56 },
      quarter: { Engagement: 77, "Reach Efficiency": 69, Registration: 45, Attendance: 82, Commitment: 73, "Repeat Rate": 59 },
    },
  },
  {
    id: "ai-build-night",
    name: "AI Build Night",
    organization: "Tech Guild",
    isMine: false,
    isPast: true,
    eventType: "Tech/Career",
    category: "Workshop",
    tags: ["ai", "coding", "project"],
    attendance: 156,
    academicPreset: "Winter Wk6",
    scores: {
      week: { Engagement: 76, "Reach Efficiency": 68, Registration: 41, Attendance: 88, Commitment: 73, "Repeat Rate": 57 },
      quarter: { Engagement: 80, "Reach Efficiency": 71, Registration: 44, Attendance: 90, Commitment: 76, "Repeat Rate": 60 },
    },
  },
  {
    id: "design-critique-lab",
    name: "Design Critique Lab",
    organization: "Your Organization",
    isMine: true,
    isPast: true,
    eventType: "Academic",
    category: "Workshop",
    tags: ["design", "portfolio", "feedback"],
    attendance: 74,
    academicPreset: "Fall Wk3",
    scores: {
      week: { Engagement: 69, "Reach Efficiency": 64, Registration: 35, Attendance: 88, Commitment: 71, "Repeat Rate": 54 },
      quarter: { Engagement: 73, "Reach Efficiency": 67, Registration: 39, Attendance: 90, Commitment: 74, "Repeat Rate": 57 },
    },
  },
  {
    id: "mentor-matchup-night",
    name: "Mentor Matchup Night",
    organization: "Your Organization",
    isMine: true,
    isPast: true,
    eventType: "Tech/Career",
    category: "Networking",
    tags: ["mentorship", "career", "networking"],
    attendance: 121,
    academicPreset: "Winter Wk2",
    scores: {
      week: { Engagement: 75, "Reach Efficiency": 69, Registration: 42, Attendance: 89, Commitment: 76, "Repeat Rate": 59 },
      quarter: { Engagement: 79, "Reach Efficiency": 72, Registration: 45, Attendance: 91, Commitment: 79, "Repeat Rate": 62 },
    },
  },
  {
    id: "campus-creators-showcase",
    name: "Campus Creators Showcase",
    organization: "Your Organization",
    isMine: true,
    isPast: true,
    eventType: "Social",
    category: "Showcase",
    tags: ["creators", "social", "community"],
    attendance: 198,
    academicPreset: "Fall Wk7",
    scores: {
      week: { Engagement: 78, "Reach Efficiency": 71, Registration: 41, Attendance: 87, Commitment: 75, "Repeat Rate": 60 },
      quarter: { Engagement: 82, "Reach Efficiency": 74, Registration: 44, Attendance: 89, Commitment: 78, "Repeat Rate": 63 },
    },
  },
  {
    id: "biomed-lab-open-house",
    name: "Biomed Lab Open House",
    organization: "Med Innovation Club",
    isMine: false,
    isPast: true,
    eventType: "Academic",
    category: "Showcase",
    tags: ["biomed", "research", "labs"],
    attendance: 133,
    academicPreset: "Fall Wk1",
    scores: {
      week: { Engagement: 66, "Reach Efficiency": 60, Registration: 34, Attendance: 83, Commitment: 65, "Repeat Rate": 48 },
      quarter: { Engagement: 70, "Reach Efficiency": 63, Registration: 37, Attendance: 85, Commitment: 68, "Repeat Rate": 51 },
    },
  },
  {
    id: "product-case-crack",
    name: "Product Case Crack",
    organization: "Product Society",
    isMine: false,
    isPast: true,
    eventType: "Tech/Career",
    category: "Workshop",
    tags: ["product", "career", "interview"],
    attendance: 92,
    academicPreset: "Fall Wk3",
    scores: {
      week: { Engagement: 72, "Reach Efficiency": 65, Registration: 39, Attendance: 86, Commitment: 69, "Repeat Rate": 52 },
      quarter: { Engagement: 76, "Reach Efficiency": 68, Registration: 42, Attendance: 88, Commitment: 72, "Repeat Rate": 55 },
    },
  },
  {
    id: "finance-bootcamp",
    name: "Finance Bootcamp",
    organization: "Investment Group",
    isMine: false,
    isPast: true,
    eventType: "Tech/Career",
    category: "Workshop",
    tags: ["finance", "career", "skills"],
    attendance: 204,
    academicPreset: "Winter Wk2",
    scores: {
      week: { Engagement: 74, "Reach Efficiency": 66, Registration: 43, Attendance: 85, Commitment: 72, "Repeat Rate": 56 },
      quarter: { Engagement: 78, "Reach Efficiency": 70, Registration: 46, Attendance: 87, Commitment: 75, "Repeat Rate": 59 },
    },
  },
  {
    id: "cultural-night-market",
    name: "Cultural Night Market",
    organization: "Global Student Union",
    isMine: false,
    isPast: true,
    eventType: "Social",
    category: "Mixer",
    tags: ["culture", "community", "food"],
    attendance: 386,
    academicPreset: "Fall Wk7",
    scores: {
      week: { Engagement: 81, "Reach Efficiency": 73, Registration: 45, Attendance: 84, Commitment: 76, "Repeat Rate": 61 },
      quarter: { Engagement: 84, "Reach Efficiency": 76, Registration: 48, Attendance: 86, Commitment: 79, "Repeat Rate": 64 },
    },
  },
  {
    id: "sustainability-hack-hour",
    name: "Sustainability Hack Hour",
    organization: "Green Futures Club",
    isMine: false,
    isPast: true,
    eventType: "Community",
    category: "Workshop",
    tags: ["sustainability", "project", "community"],
    attendance: 109,
    academicPreset: "Winter Wk6",
    scores: {
      week: { Engagement: 70, "Reach Efficiency": 63, Registration: 36, Attendance: 87, Commitment: 70, "Repeat Rate": 53 },
      quarter: { Engagement: 74, "Reach Efficiency": 66, Registration: 39, Attendance: 89, Commitment: 73, "Repeat Rate": 56 },
    },
  },
  {
    id: "policy-roundtable",
    name: "Policy Roundtable",
    organization: "Civic Leadership Forum",
    isMine: false,
    isPast: true,
    eventType: "Academic",
    category: "Panel",
    tags: ["policy", "leadership", "discussion"],
    attendance: 63,
    academicPreset: "Fall Wk1",
    scores: {
      week: { Engagement: 64, "Reach Efficiency": 58, Registration: 31, Attendance: 82, Commitment: 63, "Repeat Rate": 46 },
      quarter: { Engagement: 68, "Reach Efficiency": 61, Registration: 34, Attendance: 84, Commitment: 66, "Repeat Rate": 49 },
    },
  },
  {
    id: "cloud-career-fair",
    name: "Cloud Career Fair",
    organization: "Tech Careers Hub",
    isMine: false,
    isPast: true,
    eventType: "Tech/Career",
    category: "Networking",
    tags: ["career", "cloud", "networking"],
    attendance: 312,
    academicPreset: "Winter Wk6",
    scores: {
      week: { Engagement: 77, "Reach Efficiency": 70, Registration: 46, Attendance: 88, Commitment: 75, "Repeat Rate": 60 },
      quarter: { Engagement: 81, "Reach Efficiency": 73, Registration: 49, Attendance: 90, Commitment: 78, "Repeat Rate": 63 },
    },
  },
  {
    id: "film-club-premiere",
    name: "Film Club Premiere",
    organization: "Cinema Circle",
    isMine: false,
    isPast: true,
    eventType: "Social",
    category: "Showcase",
    tags: ["film", "arts", "community"],
    attendance: 147,
    academicPreset: "Winter Wk2",
    scores: {
      week: { Engagement: 72, "Reach Efficiency": 65, Registration: 37, Attendance: 85, Commitment: 69, "Repeat Rate": 55 },
      quarter: { Engagement: 76, "Reach Efficiency": 68, Registration: 40, Attendance: 87, Commitment: 72, "Repeat Rate": 58 },
    },
  },
  {
    id: "data-storytelling-night",
    name: "Data Storytelling Night",
    organization: "Data Science Collective",
    isMine: false,
    isPast: true,
    eventType: "Academic",
    category: "Panel",
    tags: ["data", "storytelling", "analytics"],
    attendance: 128,
    academicPreset: "Fall Wk3",
    scores: {
      week: { Engagement: 73, "Reach Efficiency": 67, Registration: 40, Attendance: 86, Commitment: 71, "Repeat Rate": 54 },
      quarter: { Engagement: 77, "Reach Efficiency": 70, Registration: 43, Attendance: 88, Commitment: 74, "Repeat Rate": 57 },
    },
  },
  {
    id: "wellness-walk-series",
    name: "Wellness Walk Series",
    organization: "Student Wellness Network",
    isMine: false,
    isPast: true,
    eventType: "Community",
    category: "Networking",
    tags: ["wellness", "health", "community"],
    attendance: 84,
    academicPreset: "Winter Wk2",
    scores: {
      week: { Engagement: 67, "Reach Efficiency": 61, Registration: 33, Attendance: 89, Commitment: 68, "Repeat Rate": 52 },
      quarter: { Engagement: 71, "Reach Efficiency": 64, Registration: 36, Attendance: 91, Commitment: 71, "Repeat Rate": 55 },
    },
  },
  {
    id: "hack-for-good",
    name: "Hack for Good",
    organization: "Civic Tech Coalition",
    isMine: false,
    isPast: true,
    eventType: "Tech/Career",
    category: "Showcase",
    tags: ["hackathon", "civic", "innovation"],
    attendance: 221,
    academicPreset: "Fall Wk7",
    scores: {
      week: { Engagement: 80, "Reach Efficiency": 72, Registration: 47, Attendance: 87, Commitment: 78, "Repeat Rate": 62 },
      quarter: { Engagement: 84, "Reach Efficiency": 75, Registration: 50, Attendance: 89, Commitment: 81, "Repeat Rate": 65 },
    },
  },
  {
    id: "startup-office-hours",
    name: "Startup Office Hours",
    organization: "Entrepreneur Society",
    isMine: false,
    isPast: true,
    eventType: "Tech/Career",
    category: "Networking",
    tags: ["startup", "mentorship", "office-hours"],
    attendance: 58,
    academicPreset: "Fall Wk1",
    scores: {
      week: { Engagement: 65, "Reach Efficiency": 60, Registration: 34, Attendance: 88, Commitment: 66, "Repeat Rate": 50 },
      quarter: { Engagement: 69, "Reach Efficiency": 63, Registration: 37, Attendance: 90, Commitment: 69, "Repeat Rate": 53 },
    },
  },
  {
    id: "robotics-demo-day",
    name: "Robotics Demo Day",
    organization: "Robotics Association",
    isMine: false,
    isPast: true,
    eventType: "Academic",
    category: "Showcase",
    tags: ["robotics", "engineering", "demo"],
    attendance: 176,
    academicPreset: "Winter Wk6",
    scores: {
      week: { Engagement: 75, "Reach Efficiency": 68, Registration: 41, Attendance: 86, Commitment: 73, "Repeat Rate": 58 },
      quarter: { Engagement: 79, "Reach Efficiency": 71, Registration: 44, Attendance: 88, Commitment: 76, "Repeat Rate": 61 },
    },
  },
  {
    id: "founders-breakfast",
    name: "Founders Breakfast",
    organization: "Your Organization",
    isMine: true,
    isPast: true,
    eventType: "Tech/Career",
    category: "Networking",
    tags: ["startup", "networking", "community"],
    attendance: 67,
    academicPreset: "Fall Wk1",
    scores: {
      week: { Engagement: 71, "Reach Efficiency": 66, Registration: 38, Attendance: 91, Commitment: 73, "Repeat Rate": 56 },
      quarter: { Engagement: 75, "Reach Efficiency": 69, Registration: 41, Attendance: 92, Commitment: 76, "Repeat Rate": 59 },
    },
  },
  {
    id: "maker-open-lab",
    name: "Maker Open Lab",
    organization: "Your Organization",
    isMine: true,
    isPast: true,
    eventType: "Academic",
    category: "Workshop",
    tags: ["maker", "prototype", "build"],
    attendance: 102,
    academicPreset: "Winter Wk2",
    scores: {
      week: { Engagement: 74, "Reach Efficiency": 68, Registration: 40, Attendance: 90, Commitment: 75, "Repeat Rate": 58 },
      quarter: { Engagement: 78, "Reach Efficiency": 71, Registration: 43, Attendance: 91, Commitment: 78, "Repeat Rate": 61 },
    },
  },
  {
    id: "creator-collab-circle",
    name: "Creator Collab Circle",
    organization: "Your Organization",
    isMine: true,
    isPast: true,
    eventType: "Social",
    category: "Networking",
    tags: ["creators", "collaboration", "social"],
    attendance: 139,
    academicPreset: "Fall Wk3",
    scores: {
      week: { Engagement: 76, "Reach Efficiency": 70, Registration: 42, Attendance: 88, Commitment: 74, "Repeat Rate": 60 },
      quarter: { Engagement: 80, "Reach Efficiency": 73, Registration: 45, Attendance: 89, Commitment: 77, "Repeat Rate": 63 },
    },
  },
]

function isValidPeriod(value: string | null): value is Period {
  return value === "week" || value === "quarter"
}

function isValidTab(value: string | null): value is ViewTab {
  return value === "within" || value === "campus"
}

function isValidMode(value: string | null): value is CompareMode {
  return value === "event" || value === "average"
}

function isValidAttendance(value: string | null): value is AttendanceFilter {
  return value === "all" || value === "small" || value === "medium" || value === "large"
}

function isValidPreset(value: string | null): value is AcademicPreset {
  return value === "all" || value === "Fall Wk1" || value === "Fall Wk3" || value === "Fall Wk7" || value === "Winter Wk2" || value === "Winter Wk6"
}

function formatPercentDelta(base: number, delta: number) {
  if (base === 0) return "0.0%"
  return `${((delta / base) * 100).toFixed(1)}%`
}

function averageScores(events: CampusEvent[], period: Period): MetricScores {
  const safeEvents = events.length > 0 ? events : []
  const divisor = safeEvents.length || 1
  return METRICS.reduce((acc, metric) => {
    const total = safeEvents.reduce((sum, event) => sum + event.scores[period][metric], 0)
    acc[metric] = Math.round(total / divisor)
    return acc
  }, {} as MetricScores)
}

function attendanceMatches(value: number, filter: AttendanceFilter) {
  if (filter === "all") return true
  if (filter === "small") return value < 100
  if (filter === "medium") return value >= 100 && value < 200
  return value >= 200
}

export function ComparativeAnalytics() {
  const [searchParams, setSearchParams] = useSearchParams()

  const mineEvents = useMemo(() => EVENT_CATALOG.filter((event) => event.isMine && event.isPast), [])
  const initialBaselineId = searchParams.get("baseline")
  const defaultBaselineId = mineEvents.some((event) => event.id === initialBaselineId) ? initialBaselineId! : mineEvents[0].id

  const [tab, setTab] = useState<ViewTab>(isValidTab(searchParams.get("tab")) ? (searchParams.get("tab") as ViewTab) : "within")
  const [mode, setMode] = useState<CompareMode>(isValidMode(searchParams.get("mode")) ? (searchParams.get("mode") as CompareMode) : "event")
  const [period, setPeriod] = useState<Period>(isValidPeriod(searchParams.get("period")) ? (searchParams.get("period") as Period) : "quarter")
  const [baselineId, setBaselineId] = useState<string>(defaultBaselineId)
  const [compareId, setCompareId] = useState<string>(searchParams.get("compare") ?? "")
  const [query, setQuery] = useState(searchParams.get("q") ?? "")
  const [eventTypeFilter, setEventTypeFilter] = useState(searchParams.get("eventType") ?? "all")
  const [presetFilter, setPresetFilter] = useState<AcademicPreset>(isValidPreset(searchParams.get("preset")) ? (searchParams.get("preset") as AcademicPreset) : "all")
  const [attendanceFilter, setAttendanceFilter] = useState<AttendanceFilter>(isValidAttendance(searchParams.get("attendance")) ? (searchParams.get("attendance") as AttendanceFilter) : "all")
  const [tagFilter, setTagFilter] = useState(searchParams.get("tag") ?? "all")
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get("category") ?? "all")
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  const baselineEvent = mineEvents.find((event) => event.id === baselineId) ?? mineEvents[0]

  const filterablePool = useMemo(() => {
    return EVENT_CATALOG.filter((event) => {
      const inScope = tab === "within"
        ? event.isMine && event.isPast && event.id !== baselineEvent.id
        : !event.isMine
      if (!inScope) return false

      const text = `${event.name} ${event.organization}`.toLowerCase()
      const matchesQuery = query.trim().length === 0 || text.includes(query.toLowerCase())
      const matchesType = eventTypeFilter === "all" || event.eventType === eventTypeFilter
      const matchesPreset = presetFilter === "all" || event.academicPreset === presetFilter
      const matchesAttendance = attendanceMatches(event.attendance, attendanceFilter)
      const matchesTag = tagFilter === "all" || event.tags.includes(tagFilter)
      const matchesCategory = categoryFilter === "all" || event.category === categoryFilter

      return matchesQuery && matchesType && matchesPreset && matchesAttendance && matchesTag && matchesCategory
    })
  }, [attendanceFilter, baselineEvent.id, categoryFilter, eventTypeFilter, presetFilter, query, tab, tagFilter])

  const compareEvent = mode === "event"
    ? filterablePool.find((event) => event.id === compareId) ?? filterablePool[0] ?? null
    : null

  const averagePool = useMemo(() => {
    const categoryScoped = filterablePool.filter((event) => event.category === baselineEvent.category)
    return categoryScoped.length > 0 ? categoryScoped : filterablePool
  }, [baselineEvent.category, filterablePool])

  const hasComparisonData = mode === "event" ? !!compareEvent : averagePool.length > 0

  const comparisonScores: MetricScores = useMemo(() => {
    if (mode === "event" && compareEvent) return compareEvent.scores[period]
    return averageScores(averagePool, period)
  }, [averagePool, compareEvent, mode, period])

  const comparisonLabel = mode === "event"
    ? (compareEvent ? `${compareEvent.name} · ${compareEvent.organization}` : "No comparison event selected")
    : `${baselineEvent.category} category average (${averagePool.length} events)`

  const radarData = hasComparisonData ? METRICS.map((metric) => {
    const myValue = baselineEvent.scores[period][metric]
    const compareValue = comparisonScores[metric]
    return { metric, myValue, compareValue, delta: myValue - compareValue }
  }) : []

  const topSignal = useMemo(() => {
    if (radarData.length === 0) return null
    return radarData.reduce((best, point) => {
      return point.delta > best.delta ? point : best
    }, radarData[0])
  }, [radarData])

  const insight = !topSignal
    ? "No comparable events match your current filters. Adjust filters to generate a comparison."
    : topSignal.delta >= 0
    ? `${baselineEvent.name} leads on ${topSignal.metric} by ${topSignal.delta} points against ${mode === "event" ? "the selected event" : "the selected average pool"}.`
    : `${baselineEvent.name} trails on ${topSignal.metric} by ${Math.abs(topSignal.delta)} points against ${mode === "event" ? "the selected event" : "the selected average pool"}.`

  const topInsights = useMemo(() => {
    return [...radarData]
      .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
      .slice(0, 3)
  }, [radarData])

  const eventTypes = useMemo(() => Array.from(new Set(EVENT_CATALOG.map((event) => event.eventType))), [])
  const categories = useMemo(() => Array.from(new Set(EVENT_CATALOG.map((event) => event.category))), [])
  const tags = useMemo(() => Array.from(new Set(EVENT_CATALOG.flatMap((event) => event.tags))).sort(), [])

  const activeFilters = useMemo(() => {
    const chips: string[] = []
    if (query.trim()) chips.push(`Search: ${query.trim()}`)
    if (eventTypeFilter !== "all") chips.push(`Type: ${eventTypeFilter}`)
    if (presetFilter !== "all") chips.push(`Preset: ${presetFilter}`)
    if (attendanceFilter !== "all") chips.push(`Attendance: ${attendanceFilter}`)
    if (categoryFilter !== "all") chips.push(`Category: ${categoryFilter}`)
    if (tagFilter !== "all") chips.push(`Tag: ${tagFilter}`)
    return chips
  }, [attendanceFilter, categoryFilter, eventTypeFilter, presetFilter, query, tagFilter])

  useEffect(() => {
    if (mode === "event" && compareEvent && compareEvent.id !== compareId) {
      setCompareId(compareEvent.id)
    }
  }, [compareEvent, compareId, mode])

  useEffect(() => {
    const params = new URLSearchParams()
    params.set("tab", tab)
    params.set("mode", mode)
    params.set("period", period)
    params.set("baseline", baselineEvent.id)
    if (mode === "event" && compareEvent) params.set("compare", compareEvent.id)
    if (query.trim()) params.set("q", query.trim())
    if (eventTypeFilter !== "all") params.set("eventType", eventTypeFilter)
    if (presetFilter !== "all") params.set("preset", presetFilter)
    if (attendanceFilter !== "all") params.set("attendance", attendanceFilter)
    if (tagFilter !== "all") params.set("tag", tagFilter)
    if (categoryFilter !== "all") params.set("category", categoryFilter)
    setSearchParams(params, { replace: true })
  }, [
    attendanceFilter,
    baselineEvent.id,
    categoryFilter,
    compareEvent,
    eventTypeFilter,
    mode,
    period,
    presetFilter,
    query,
    setSearchParams,
    tab,
    tagFilter,
  ])

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-md md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#b7a57a]/75">Deeper Dive</p>
            <h1 className="mt-1 text-2xl font-black tracking-tight text-white/90 md:text-3xl">Comparative Intelligence</h1>
            <p className="mt-1 text-sm text-white/45">
              Compare one of your events against one selected event or a category average using the same radar parameters.
            </p>
          </div>
          <Link
            to="/contributor"
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white/75 transition-colors hover:bg-white/10"
          >
            <ArrowLeft size={14} />
            Back to Dashboard
          </Link>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-md md:p-5">
        <div className="space-y-4">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#b7a57a]/80">Step 1 · Comparison Builder</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => setTab("within")}
                className={`rounded-lg border px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-colors ${
                  tab === "within" ? "border-[#7c5cbf]/40 bg-[#7c5cbf]/12 text-[#e2d6ff]" : "border-white/12 bg-white/[0.03] text-white/60 hover:text-white/80"
                }`}
              >
                Within Organization
              </button>
              <button
                onClick={() => setTab("campus")}
                className={`rounded-lg border px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-colors ${
                  tab === "campus" ? "border-[#7c5cbf]/40 bg-[#7c5cbf]/12 text-[#e2d6ff]" : "border-white/12 bg-white/[0.03] text-white/60 hover:text-white/80"
                }`}
              >
                Across Campus
              </button>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
              <select
                value={baselineEvent.id}
                onChange={(e) => setBaselineId(e.target.value)}
                className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-medium text-white/85 outline-none transition-colors focus:border-[#7c5cbf]"
              >
                {mineEvents.map((event) => (
                  <option key={event.id} value={event.id}>My Event: {event.name}</option>
                ))}
              </select>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as CompareMode)}
                className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-medium text-white/85 outline-none transition-colors focus:border-[#7c5cbf]"
              >
                <option value="event">My Event vs Another Event</option>
                <option value="average">My Event vs Category Average</option>
              </select>
            </div>
            {mode === "event" && (
              <div className="mt-3">
                <select
                  value={compareEvent?.id ?? ""}
                  onChange={(e) => setCompareId(e.target.value)}
                  disabled={filterablePool.length === 0}
                  className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-medium text-white/85 outline-none transition-colors focus:border-[#7c5cbf]"
                >
                  {filterablePool.length === 0 && <option value="">No matching events</option>}
                  {filterablePool.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.name} · {event.organization} · {event.eventType}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="mt-3 rounded-lg border border-[#7c5cbf]/25 bg-[#7c5cbf]/10 px-3 py-2 text-xs text-[#ece5ff]">
              <span className="font-semibold text-[#d8c8ff]">Selected:</span>{" "}
              {baselineEvent.name} vs {comparisonLabel}
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#b7a57a]/80">Step 2 · Filters</p>
              <button
                type="button"
                onClick={() => setShowAdvancedFilters((value) => !value)}
                className="rounded-lg border border-white/15 bg-white/[0.02] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/65 hover:text-white/85"
              >
                {showAdvancedFilters ? "Hide Advanced" : "More Filters"}
              </button>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-3">
              <div className="relative">
                <Search size={13} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search organization or event name"
                  className="w-full rounded-lg border border-white/15 bg-white/5 py-2 pl-8 pr-3 text-xs text-white/80 outline-none transition-colors focus:border-[#7c5cbf]"
                />
              </div>
              <select
                value={eventTypeFilter}
                onChange={(e) => setEventTypeFilter(e.target.value)}
                className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-medium text-white/85 outline-none transition-colors focus:border-[#7c5cbf]"
              >
                <option value="all">All Event Types</option>
                {eventTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <select
                value={presetFilter}
                onChange={(e) => setPresetFilter(e.target.value as AcademicPreset)}
                className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-medium text-white/85 outline-none transition-colors focus:border-[#7c5cbf]"
              >
                <option value="all">All Date Presets</option>
                <option value="Fall Wk1">Fall Wk1</option>
                <option value="Fall Wk3">Fall Wk3</option>
                <option value="Fall Wk7">Fall Wk7</option>
                <option value="Winter Wk2">Winter Wk2</option>
                <option value="Winter Wk6">Winter Wk6</option>
              </select>
            </div>

            {showAdvancedFilters && (
              <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-3">
                <select
                  value={attendanceFilter}
                  onChange={(e) => setAttendanceFilter(e.target.value as AttendanceFilter)}
                  className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-medium text-white/85 outline-none transition-colors focus:border-[#7c5cbf]"
                >
                  <option value="all">All Attendance Sizes</option>
                  <option value="small">Small (&lt;100)</option>
                  <option value="medium">Medium (100-199)</option>
                  <option value="large">Large (200+)</option>
                </select>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-medium text-white/85 outline-none transition-colors focus:border-[#7c5cbf]"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <select
                  value={tagFilter}
                  onChange={(e) => setTagFilter(e.target.value)}
                  className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-medium text-white/85 outline-none transition-colors focus:border-[#7c5cbf]"
                >
                  <option value="all">All Tags</option>
                  {tags.map((tag) => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="mt-3 flex flex-wrap gap-2">
              {activeFilters.length === 0 ? (
                <span className="rounded-full border border-white/12 bg-white/[0.03] px-2.5 py-1 text-[11px] text-white/45">No active filters</span>
              ) : (
                activeFilters.map((filter) => (
                  <span key={filter} className="rounded-full border border-white/12 bg-white/[0.03] px-2.5 py-1 text-[11px] text-white/65">
                    {filter}
                  </span>
                ))
              )}
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#b7a57a]/80">Step 3 · Results</p>
            <div className="mt-3 grid grid-cols-1 gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="h-72 rounded-xl border border-white/10 bg-white/[0.03] p-2">
                {hasComparisonData ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#2a2238" />
                      <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: "#b8accd" }} />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} />
                      <Tooltip
                        formatter={(value: number, name: string) => {
                          if (name === "myValue") return [value, baselineEvent.name]
                          if (name === "compareValue") return [value, mode === "event" ? (compareEvent?.name ?? "Comparison Event") : "Category Average"]
                          return [value, name]
                        }}
                        labelFormatter={(label) => {
                          const metricRow = radarData.find((row) => row.metric === label)
                          const delta = metricRow ? metricRow.delta : 0
                          return `${label} · Delta ${delta >= 0 ? "+" : ""}${delta}`
                        }}
                      />
                      <Radar dataKey="myValue" stroke="#7c5cbf" fill="#7c5cbf" fillOpacity={0.45} />
                      <Radar dataKey="compareValue" stroke="#b7a57a" fill="#b7a57a" fillOpacity={0.22} />
                    </RadarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-center">
                    <div>
                      <p className="text-sm font-semibold text-white/80">No comparison data</p>
                      <p className="mt-1 text-xs text-white/45">Adjust filters to include at least one comparable event.</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-white/45">Comparison Pair</p>
                  <p className="mt-1 text-sm font-semibold text-white/90">{baselineEvent.name}</p>
                  <p className="text-xs text-white/60">vs {comparisonLabel}</p>
                  <p className="mt-2 text-xs text-white/50">{mode === "event" ? "Single event comparison" : "Average uses current filters and category scope"}</p>
                </div>
                <div className="rounded-xl border border-[#7c5cbf]/40 bg-[#7c5cbf]/10 p-3">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-[#d8c8ff]">Primary Insight</p>
                  <p className="mt-1 text-xs leading-relaxed text-[#ece5ff]">{insight}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-white/45">Top Signals</p>
                  <ul className="mt-2 space-y-1.5 text-xs text-white/70">
                    {topInsights.map((point) => (
                      <li key={point.metric}>
                        {point.metric}: {point.delta >= 0 ? "+" : ""}{point.delta}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
              {METRICS.map((metric) => {
                const mine = baselineEvent.scores[period][metric]
                const compare = comparisonScores[metric]
                const delta = mine - compare
                return (
                  <div key={metric} className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#d8c8ff]">{metric}</p>
                    <p className="mt-1 text-[11px] leading-relaxed text-white/55">{METRIC_DEFINITIONS[metric]}</p>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded bg-white/[0.02] p-2">
                        <p className="text-white/45">My Event</p>
                        <p className="font-semibold text-white/90">{mine}</p>
                      </div>
                      <div className="rounded bg-white/[0.02] p-2">
                        <p className="text-white/45">{mode === "event" ? "Compared Event" : "Category Avg"}</p>
                        <p className="font-semibold text-white/90">{hasComparisonData ? compare : "--"}</p>
                      </div>
                    </div>
                    <div className="mt-2 rounded bg-[#7c5cbf]/10 p-2 text-xs">
                      <p className="text-[#d8c8ff]">Delta {hasComparisonData ? `${delta >= 0 ? "+" : ""}${delta}` : "--"}</p>
                      <p className="text-[#d8c8ff]/85">% Delta {hasComparisonData ? `${delta >= 0 ? "+" : ""}${formatPercentDelta(compare, delta)}` : "--"}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <Link
          to="/contributor"
          className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#d8c8ff] hover:text-white"
        >
          Return to Contributor Command Center
          <ArrowUpRight size={12} />
        </Link>
      </section>
    </div>
  )
}
