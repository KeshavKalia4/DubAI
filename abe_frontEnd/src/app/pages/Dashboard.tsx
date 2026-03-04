import React, { useEffect, useMemo, useRef, useState } from "react"
import { analyticsApi, type AnalyticsSummary } from "@/lib/api"
import { Link, useNavigate } from "react-router"
import { motion } from "framer-motion"
import GridLayout, { type Layout } from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Funnel,
  FunnelChart,
  LabelList,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  Treemap,
  XAxis,
  YAxis,
} from "recharts"
import {
  registrationFunnelData,
  registrationVelocityData,
  waitlistData,
  registrationSourceData,
  rsvpConversionByEvent,
  peakArrivalData,
  capacityData,
  firstTimeRepeatData,
  attendanceByMajorData,
  majorTreemapData,
  collegeAffiliationData,
  newVsReturningData,
  engagementTierData,
  preferredTimesData,
  cohortRetentionData,
  memberGrowthData,
  churnReasonData,
  activeMemberRatioData,
  memberAcquisitionData,
  eventRatingsData,
  satisfactionTrendData,
  eventROIData,
  channelData,
  emailMetricsData,
  contentPerformanceData,
  yoyGrowthData,
  forecastData,
  acquisitionFunnelData,
  onboardingStepsData,
  bestDaysData,
  bestHoursData,
  venueUtilizationData,
  checkInTimeData,
} from "@/data/dashboardMockData"
import {
  ArrowUpRight,
  Calendar,
  Clock3,
  GripHorizontal,
  LayoutGrid,
  MapPin,
  PlusCircle,
  Sparkles,
  Trash2,
  TrendingUp,
  Users,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DashboardLayoutConfigurator, type DashboardWidget } from "@/components/ui/dashboard-configuration"
import { ParticleWaves, type ParticleWavesConfig } from "@/components/ui/threejs-particles-waves"
import { AnimatePresence } from "framer-motion"

function LiveClock() {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="text-right select-none">
      <p className="text-3xl font-black tracking-tight text-white/80 tabular-nums font-mono">
        {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
      </p>
      <p className="text-[10px] text-white/30 uppercase tracking-[0.18em] mt-0.5">
        {time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
      </p>
    </div>
  )
}

const kpiSparkData: Record<string, number[]> = {
  'kpi-rsvps':      [35, 48, 52, 41, 68, 74, 89, 72, 83, 91, 78, 95, 88, 100, 94],
  'kpi-showrate':   [72, 68, 75, 71, 82, 79, 88, 85, 87, 89, 88, 90, 91, 89,  92],
  'kpi-events':     [40, 45, 50, 45, 55, 60, 60, 65, 65, 70, 70, 70, 80, 90,  95],
  'kpi-engagement': [55, 60, 58, 65, 69, 72, 71, 74, 76, 75, 78, 78, 80, 82,  85],
}

function useContainerWidth(ref: React.RefObject<HTMLDivElement | null>) {
  const [width, setWidth] = useState(1200)
  useEffect(() => {
    if (!ref.current) return
    const ro = new ResizeObserver(entries => setWidth(entries[0].contentRect.width))
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])
  return width
}

function AnimatedNumber({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const match = value.replace(/,/g, '').match(/[\d.]+/)
    if (!match || !ref.current) return
    const target = parseFloat(match[0])
    const isFloat = value.includes('.')
    const hasComma = value.includes(',')
    const suffix = value.includes('%') ? '%' : ''
    const startTime = performance.now()
    const duration = 1400
    const tick = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      const cur = target * eased
      if (ref.current) {
        const formatted = hasComma
          ? Math.round(cur).toLocaleString()
          : isFloat
          ? cur.toFixed(1) + suffix
          : Math.round(cur).toString() + suffix
        ref.current.textContent = formatted
      }
      if (t < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [value])
  return <span ref={ref}>{value}</span>
}

const LAYOUT_STORAGE_KEY = 'contributorDashboardLayout_v4'

const DEFAULT_LAYOUT: Layout[] = [
  // ── Default visible ─────────────────────────────────────────────────────
  { i: 'kpi-rsvps',         x: 0,  y: 0,  w: 3,  h: 3,  minW: 2, minH: 2 },
  { i: 'kpi-showrate',      x: 3,  y: 0,  w: 3,  h: 3,  minW: 2, minH: 2 },
  { i: 'kpi-events',        x: 6,  y: 0,  w: 3,  h: 3,  minW: 2, minH: 2 },
  { i: 'kpi-engagement',    x: 9,  y: 0,  w: 3,  h: 3,  minW: 2, minH: 2 },
  { i: 'attendance',        x: 0,  y: 3,  w: 6,  h: 5,  minW: 4, minH: 4 },
  { i: 'engagement',        x: 6,  y: 3,  w: 6,  h: 5,  minW: 4, minH: 4 },
  { i: 'comparative',       x: 0,  y: 8,  w: 7,  h: 7,  minW: 4, minH: 5 },
  { i: 'temporal',          x: 7,  y: 8,  w: 5,  h: 7,  minW: 4, minH: 5 },
  { i: 'upcoming',          x: 0,  y: 15, w: 8,  h: 5,  minW: 4, minH: 3 },
  // ── Available but hidden by default ─────────────────────────────────────
  { i: 'demographics',      x: 0,  y: 20, w: 5,  h: 6,  minW: 3, minH: 4 },
  { i: 'reg-velocity',      x: 5,  y: 20, w: 7,  h: 6,  minW: 4, minH: 4 },
  { i: 'reg-sources',       x: 0,  y: 26, w: 6,  h: 6,  minW: 4, minH: 4 },
  { i: 'live-capacity',     x: 6,  y: 26, w: 6,  h: 5,  minW: 4, minH: 4 },
  { i: 'post-firsttime',    x: 0,  y: 31, w: 6,  h: 6,  minW: 4, minH: 4 },
  { i: 'post-by-major',     x: 6,  y: 31, w: 6,  h: 6,  minW: 4, minH: 4 },
  { i: 'seg-new-returning', x: 0,  y: 37, w: 6,  h: 6,  minW: 4, minH: 4 },
  { i: 'seg-tiers',         x: 6,  y: 37, w: 6,  h: 6,  minW: 4, minH: 4 },
  { i: 'seg-treemap',       x: 0,  y: 43, w: 12, h: 6,  minW: 6, minH: 4 },
  { i: 'behav-times',       x: 0,  y: 49, w: 12, h: 6,  minW: 6, minH: 4 },
  { i: 'ret-growth',        x: 0,  y: 55, w: 12, h: 6,  minW: 6, minH: 4 },
  { i: 'success-ratings',   x: 0,  y: 61, w: 6,  h: 6,  minW: 4, minH: 4 },
  { i: 'success-roi',       x: 6,  y: 61, w: 6,  h: 5,  minW: 4, minH: 4 },
  { i: 'mkt-channels',      x: 0,  y: 66, w: 12, h: 5,  minW: 6, minH: 4 },
  { i: 'growth-forecast',   x: 0,  y: 71, w: 12, h: 5,  minW: 6, minH: 4 },
  { i: 'timing-days',       x: 0,  y: 76, w: 6,  h: 6,  minW: 4, minH: 4 },
  { i: 'timing-hours',      x: 6,  y: 76, w: 6,  h: 6,  minW: 4, minH: 4 },
  { i: 'ops-venue',         x: 0,  y: 82, w: 6,  h: 6,  minW: 4, minH: 4 },
  { i: 'ops-checkin',       x: 6,  y: 82, w: 6,  h: 6,  minW: 4, minH: 4 },
]

const RELAXED_MIN_SIZE_BY_WIDGET = Object.fromEntries(
  DEFAULT_LAYOUT.map((item) => [
    item.i,
    {
      minW: Math.max(2, (item.minW ?? 2) - 1),
      minH: Math.max(2, (item.minH ?? 2) - 1),
    },
  ])
) as Record<string, { minW: number; minH: number }>

function withRelaxedConstraints(layout: Layout[]): Layout[] {
  return layout.map((item) => {
    const min = RELAXED_MIN_SIZE_BY_WIDGET[item.i] ?? { minW: 2, minH: 2 }
    return { ...item, minW: min.minW, minH: min.minH }
  })
}

const widgetCatalog: DashboardWidget[] = [
  { id: "kpi-rsvps",          title: "Total RSVPs",                description: "Total RSVPs in last 30 days." },
  { id: "kpi-showrate",       title: "Avg. Show Rate",             description: "Average show rate across all events." },
  { id: "kpi-events",         title: "Active Events",              description: "Published + scheduled event count." },
  { id: "kpi-engagement",     title: "Engagement Index",           description: "Quality-weighted engagement score." },
  { id: "attendance",         title: "Attendance Overview",        description: "Registered vs attended by event." },
  { id: "engagement",         title: "Engagement Trend",           description: "Saves, shares, and comments over time." },
  { id: "demographics",       title: "Audience Distribution",      description: "Class-year breakdown of attendees." },
  { id: "upcoming",           title: "Upcoming Events",            description: "Published and scheduled events." },
  { id: "comparative",        title: "Comparative Analytics",      description: "Compare event performance side by side." },
  { id: "temporal",           title: "Temporal Intelligence",      description: "Best weeks and timing windows." },
  { id: "reg-velocity",       title: "Registration Velocity",      description: "Cumulative registrations day-by-day." },
  { id: "reg-sources",        title: "Registration Sources",       description: "Where registrations originate from." },
  { id: "live-capacity",      title: "Capacity Utilization",       description: "Attended vs. venue capacity per event." },
  { id: "post-firsttime",     title: "First-Time vs. Returning",   description: "Repeat attendee ratio per event." },
  { id: "post-by-major",      title: "Attendance by Major",        description: "Discipline breakdown across quarters." },
  { id: "seg-new-returning",  title: "New vs. Returning Members",  description: "Monthly member acquisition trends." },
  { id: "seg-tiers",          title: "Engagement Tiers",           description: "Member count by engagement frequency." },
  { id: "seg-treemap",        title: "Major Breakdown Treemap",    description: "Attendance sized by department." },
  { id: "behav-times",        title: "Preferred Event Times",      description: "Activity by day × time slot." },
  { id: "ret-growth",         title: "Member Growth",              description: "Total members, acquisitions, and churn." },
  { id: "success-ratings",    title: "Event Ratings",              description: "Response count by star rating." },
  { id: "success-roi",        title: "Event ROI Analysis",         description: "Value created vs. cost per event." },
  { id: "mkt-channels",       title: "Channel Performance",        description: "Registrations by acquisition source." },
  { id: "growth-forecast",    title: "Attendance Forecast",        description: "Predicted attendance through May." },
  { id: "timing-days",        title: "Best Days of Week",          description: "Average attendance by day." },
  { id: "timing-hours",       title: "Best Hours of Day",          description: "Attendance by start time." },
  { id: "ops-venue",          title: "Venue Utilization",          description: "Fill rates across venues." },
  { id: "ops-checkin",        title: "Check-In Distribution",      description: "How long attendees take to check in." },
]

const defaultVisibleWidgetIds = ["kpi-rsvps", "kpi-showrate", "kpi-events", "kpi-engagement", "attendance", "engagement", "comparative", "temporal", "upcoming"]
const STORAGE_KEY = "contributorDashboardVisibleWidgets_v3"

const attendanceData = [
  { event: "Founder Sprint", registered: 142, attended: 128 },
  { event: "Career Story", registered: 89, attended: 82 },
  { event: "Research Social", registered: 210, attended: 195 },
  { event: "Community Mixer", registered: 164, attended: 151 },
]

const engagementData = [
  { month: "Oct", saves: 145, shares: 89, comments: 234 },
  { month: "Nov", saves: 198, shares: 134, comments: 312 },
  { month: "Dec", saves: 267, shares: 178, comments: 445 },
  { month: "Jan", saves: 312, shares: 201, comments: 498 },
  { month: "Feb", saves: 354, shares: 226, comments: 557 },
]

const classYearData = [
  { name: "Freshman", value: 245, color: "#4b2e83" },
  { name: "Sophomore", value: 318, color: "#7b699f" },
  { name: "Junior", value: 412, color: "#b7a57a" },
  { name: "Senior", value: 273, color: "#8f7b58" },
]

const upcomingEvents = [
  { title: "Founder Sprint Night", date: "March 6, 2026", status: "Published", rsvps: 142 },
  { title: "Career Story Lab", date: "March 9, 2026", status: "Published", rsvps: 89 },
  { title: "Campus Research Social", date: "March 13, 2026", status: "Draft", rsvps: 0 },
]

const eventPerformance = [
  { id: "founder-sprint", name: "Founder Sprint Night", rsvps: 142, showRate: 90, engagement: 81 },
  { id: "career-story", name: "Career Story Lab", rsvps: 89, showRate: 92, engagement: 76 },
  { id: "research-social", name: "Campus Research Social", rsvps: 210, showRate: 93, engagement: 88 },
  { id: "community-mixer", name: "Spring Community Mixer", rsvps: 164, showRate: 88, engagement: 74 },
]

type ComparativeMetric =
  | "Engagement"
  | "Reach Efficiency"
  | "Registration"
  | "Attendance"
  | "Commitment"
  | "Repeat Rate"

type RadarComparisonPoint = {
  metric: ComparativeMetric
  yourEvent: number
  similar: number
}

type SimilarEventRecord = {
  name: string
  date: string
  category: string
  attendees: number
  scores: Record<ComparativeMetric, number>
}

const radarComparativeProfiles: Record<string, Array<{ metric: ComparativeMetric; yourEvent: number; similar: number }>> = {
  "all-quarter": [
    { metric: "Engagement", yourEvent: 78, similar: 69 },
    { metric: "Reach Efficiency", yourEvent: 71, similar: 64 },
    { metric: "Registration", yourEvent: 42, similar: 36 },
    { metric: "Attendance", yourEvent: 90, similar: 82 },
    { metric: "Commitment", yourEvent: 76, similar: 68 },
    { metric: "Repeat Rate", yourEvent: 62, similar: 55 },
  ],
  "all-week": [
    { metric: "Engagement", yourEvent: 74, similar: 67 },
    { metric: "Reach Efficiency", yourEvent: 69, similar: 60 },
    { metric: "Registration", yourEvent: 38, similar: 34 },
    { metric: "Attendance", yourEvent: 87, similar: 79 },
    { metric: "Commitment", yourEvent: 73, similar: 64 },
    { metric: "Repeat Rate", yourEvent: 58, similar: 51 },
  ],
  "founder-sprint-quarter": [
    { metric: "Engagement", yourEvent: 84, similar: 72 },
    { metric: "Reach Efficiency", yourEvent: 76, similar: 66 },
    { metric: "Registration", yourEvent: 49, similar: 37 },
    { metric: "Attendance", yourEvent: 92, similar: 83 },
    { metric: "Commitment", yourEvent: 81, similar: 70 },
    { metric: "Repeat Rate", yourEvent: 66, similar: 56 },
  ],
  "founder-sprint-week": [
    { metric: "Engagement", yourEvent: 79, similar: 70 },
    { metric: "Reach Efficiency", yourEvent: 72, similar: 63 },
    { metric: "Registration", yourEvent: 44, similar: 35 },
    { metric: "Attendance", yourEvent: 90, similar: 80 },
    { metric: "Commitment", yourEvent: 77, similar: 67 },
    { metric: "Repeat Rate", yourEvent: 61, similar: 53 },
  ],
}

const similarEventsData: Record<string, { week: SimilarEventRecord[]; quarter: SimilarEventRecord[] }> = {
  all: {
    week: [
      {
        name: "Engineering Expo",
        date: "Feb 18, 2026",
        category: "Academic",
        attendees: 245,
        scores: {
          Engagement: 70,
          "Reach Efficiency": 65,
          Registration: 40,
          Attendance: 85,
          Commitment: 72,
          "Repeat Rate": 58,
        },
      },
      {
        name: "Greek Life Mixer",
        date: "Feb 17, 2026",
        category: "Social",
        attendees: 180,
        scores: {
          Engagement: 68,
          "Reach Efficiency": 62,
          Registration: 35,
          Attendance: 78,
          Commitment: 64,
          "Repeat Rate": 51,
        },
      },
      {
        name: "Coding Workshop",
        date: "Feb 19, 2026",
        category: "Tech/Career",
        attendees: 95,
        scores: {
          Engagement: 66,
          "Reach Efficiency": 58,
          Registration: 33,
          Attendance: 81,
          Commitment: 63,
          "Repeat Rate": 49,
        },
      },
      {
        name: "Volunteer Fair",
        date: "Feb 16, 2026",
        category: "Community Service",
        attendees: 142,
        scores: {
          Engagement: 71,
          "Reach Efficiency": 63,
          Registration: 37,
          Attendance: 82,
          Commitment: 67,
          "Repeat Rate": 53,
        },
      },
    ],
    quarter: [
      {
        name: "Engineering Expo",
        date: "Feb 18, 2026",
        category: "Academic",
        attendees: 245,
        scores: {
          Engagement: 70,
          "Reach Efficiency": 65,
          Registration: 40,
          Attendance: 85,
          Commitment: 72,
          "Repeat Rate": 58,
        },
      },
      {
        name: "Greek Life Mixer",
        date: "Feb 17, 2026",
        category: "Social",
        attendees: 180,
        scores: {
          Engagement: 68,
          "Reach Efficiency": 62,
          Registration: 35,
          Attendance: 78,
          Commitment: 64,
          "Repeat Rate": 51,
        },
      },
      {
        name: "Coding Workshop",
        date: "Feb 19, 2026",
        category: "Tech/Career",
        attendees: 95,
        scores: {
          Engagement: 66,
          "Reach Efficiency": 58,
          Registration: 33,
          Attendance: 81,
          Commitment: 63,
          "Repeat Rate": 49,
        },
      },
      {
        name: "Volunteer Fair",
        date: "Feb 16, 2026",
        category: "Community Service",
        attendees: 142,
        scores: {
          Engagement: 71,
          "Reach Efficiency": 63,
          Registration: 37,
          Attendance: 82,
          Commitment: 67,
          "Repeat Rate": 53,
        },
      },
      {
        name: "Winter Ball",
        date: "Jan 9, 2026",
        category: "Social",
        attendees: 428,
        scores: {
          Engagement: 74,
          "Reach Efficiency": 67,
          Registration: 42,
          Attendance: 79,
          Commitment: 70,
          "Repeat Rate": 56,
        },
      },
      {
        name: "Entrepreneurship Panel",
        date: "Jan 15, 2026",
        category: "Tech/Career",
        attendees: 156,
        scores: {
          Engagement: 69,
          "Reach Efficiency": 64,
          Registration: 38,
          Attendance: 84,
          Commitment: 66,
          "Repeat Rate": 52,
        },
      },
    ],
  },
  "founder-sprint": {
    week: [
      {
        name: "Venture Capital Workshop",
        date: "Feb 17, 2026",
        category: "Tech/Career",
        attendees: 98,
        scores: {
          Engagement: 72,
          "Reach Efficiency": 65,
          Registration: 36,
          Attendance: 80,
          Commitment: 68,
          "Repeat Rate": 54,
        },
      },
      {
        name: "Business Plan Competition",
        date: "Feb 20, 2026",
        category: "Tech/Career",
        attendees: 124,
        scores: {
          Engagement: 74,
          "Reach Efficiency": 66,
          Registration: 37,
          Attendance: 82,
          Commitment: 69,
          "Repeat Rate": 56,
        },
      },
      {
        name: "Startup Pitch Night",
        date: "Feb 21, 2026",
        category: "Tech/Career",
        attendees: 189,
        scores: {
          Engagement: 75,
          "Reach Efficiency": 67,
          Registration: 39,
          Attendance: 83,
          Commitment: 70,
          "Repeat Rate": 57,
        },
      },
    ],
    quarter: [
      {
        name: "Venture Capital Workshop",
        date: "Feb 17, 2026",
        category: "Tech/Career",
        attendees: 98,
        scores: {
          Engagement: 72,
          "Reach Efficiency": 65,
          Registration: 36,
          Attendance: 80,
          Commitment: 68,
          "Repeat Rate": 54,
        },
      },
      {
        name: "Business Plan Competition",
        date: "Feb 20, 2026",
        category: "Tech/Career",
        attendees: 124,
        scores: {
          Engagement: 74,
          "Reach Efficiency": 66,
          Registration: 37,
          Attendance: 82,
          Commitment: 69,
          "Repeat Rate": 56,
        },
      },
      {
        name: "Startup Pitch Night",
        date: "Feb 21, 2026",
        category: "Tech/Career",
        attendees: 189,
        scores: {
          Engagement: 75,
          "Reach Efficiency": 67,
          Registration: 39,
          Attendance: 83,
          Commitment: 70,
          "Repeat Rate": 57,
        },
      },
      {
        name: "Innovation Summit",
        date: "Jan 21, 2026",
        category: "Tech/Career",
        attendees: 267,
        scores: {
          Engagement: 77,
          "Reach Efficiency": 69,
          Registration: 40,
          Attendance: 84,
          Commitment: 71,
          "Repeat Rate": 58,
        },
      },
      {
        name: "Founder's Fireside Chat",
        date: "Jan 14, 2026",
        category: "Tech/Career",
        attendees: 142,
        scores: {
          Engagement: 73,
          "Reach Efficiency": 64,
          Registration: 35,
          Attendance: 81,
          Commitment: 67,
          "Repeat Rate": 55,
        },
      },
    ],
  },
}

const comparativeMetricDefinitions: Record<string, string> = {
  Engagement: "Composite score from saves, shares, comments, and content completion quality.",
  "Reach Efficiency": "How effectively impressions convert into meaningful profile visits and follows.",
  Registration: "Percent of viewers who move from interest to RSVP/registration.",
  Attendance: "Show-up rate among confirmed attendees.",
  Commitment: "Depth of intent based on reminders opened, saves, and pre-event interactions.",
  "Repeat Rate": "Percent of attendees who return to another event from the same organizer.",
}

const comparativeMetricOptions: ComparativeMetric[] = [
  "Engagement",
  "Reach Efficiency",
  "Registration",
  "Attendance",
  "Commitment",
  "Repeat Rate",
]

const calendarSaturationByWeek: Record<string, { date: string; events: number; yourEvent: number }[]> = {
  "Week 5": [
    { date: "Oct 27", events: 3, yourEvent: 1 },
    { date: "Oct 28", events: 5, yourEvent: 0 },
    { date: "Oct 29", events: 8, yourEvent: 1 },
    { date: "Oct 30", events: 4, yourEvent: 0 },
    { date: "Oct 31", events: 6, yourEvent: 1 },
    { date: "Nov 1", events: 2, yourEvent: 0 },
    { date: "Nov 2", events: 7, yourEvent: 0 },
  ],
  "Week 7": [
    { date: "Nov 10", events: 6, yourEvent: 1 },
    { date: "Nov 11", events: 8, yourEvent: 1 },
    { date: "Nov 12", events: 9, yourEvent: 1 },
    { date: "Nov 13", events: 7, yourEvent: 0 },
    { date: "Nov 14", events: 10, yourEvent: 1 },
    { date: "Nov 15", events: 5, yourEvent: 0 },
    { date: "Nov 16", events: 7, yourEvent: 0 },
  ],
  "Week 9": [
    { date: "Nov 24", events: 2, yourEvent: 0 },
    { date: "Nov 25", events: 3, yourEvent: 1 },
    { date: "Nov 26", events: 4, yourEvent: 0 },
    { date: "Nov 27", events: 1, yourEvent: 0 },
    { date: "Nov 28", events: 2, yourEvent: 1 },
    { date: "Nov 29", events: 1, yourEvent: 0 },
    { date: "Nov 30", events: 3, yourEvent: 0 },
  ],
}

const attendanceByEventType: Record<string, { week: string; attendance: number }[]> = {
  "All Events": [
    { week: "W1", attendance: 198 },
    { week: "W2", attendance: 215 },
    { week: "W3", attendance: 234 },
    { week: "W4", attendance: 221 },
    { week: "W5", attendance: 187 },
    { week: "W6", attendance: 203 },
    { week: "W7", attendance: 245 },
    { week: "W8", attendance: 256 },
    { week: "W9", attendance: 178 },
    { week: "W10", attendance: 189 },
  ],
  Social: [
    { week: "W1", attendance: 168 },
    { week: "W2", attendance: 182 },
    { week: "W3", attendance: 204 },
    { week: "W4", attendance: 195 },
    { week: "W5", attendance: 154 },
    { week: "W6", attendance: 176 },
    { week: "W7", attendance: 223 },
    { week: "W8", attendance: 238 },
    { week: "W9", attendance: 149 },
    { week: "W10", attendance: 163 },
  ],
  "Tech/Career": [
    { week: "W1", attendance: 142 },
    { week: "W2", attendance: 159 },
    { week: "W3", attendance: 171 },
    { week: "W4", attendance: 165 },
    { week: "W5", attendance: 134 },
    { week: "W6", attendance: 152 },
    { week: "W7", attendance: 187 },
    { week: "W8", attendance: 194 },
    { week: "W9", attendance: 128 },
    { week: "W10", attendance: 141 },
  ],
}

type DayEvent = {
  name: string
  time: string
  location: string
  category: string
  attendees: number
  isYourEvent: boolean
}

const eventsByDate: Record<string, DayEvent[]> = {
  "Oct 27": [
    { name: "Study Skills Workshop", time: "2:00 PM", location: "Kane Hall 130", category: "Academic", attendees: 45, isYourEvent: true },
    { name: "Greek Life Recruitment", time: "5:00 PM", location: "HUB Ballroom", category: "Social", attendees: 120, isYourEvent: false },
  ],
  "Oct 29": [
    { name: "Halloween Campus Bash", time: "8:00 PM", location: "Red Square", category: "Social", attendees: 450, isYourEvent: true },
    { name: "Coding Hackathon", time: "9:00 AM", location: "CSE Building", category: "Tech/Career", attendees: 150, isYourEvent: false },
  ],
  "Nov 10": [
    { name: "Startup Pitch Practice", time: "6:00 PM", location: "Innovation Studio", category: "Tech/Career", attendees: 92, isYourEvent: true },
    { name: "Club Leadership Circle", time: "4:00 PM", location: "Student Center 210", category: "Community", attendees: 58, isYourEvent: false },
  ],
  "Nov 14": [
    { name: "Inter-Club Showcase", time: "7:00 PM", location: "Main Quad", category: "Social", attendees: 210, isYourEvent: true },
    { name: "Design Jam", time: "1:00 PM", location: "Media Lab", category: "Arts/Culture", attendees: 76, isYourEvent: false },
  ],
  "Nov 24": [
    { name: "Thanksgiving Service Drive", time: "11:00 AM", location: "HUB 145", category: "Community", attendees: 64, isYourEvent: false },
    { name: "Resume Review Sprint", time: "3:00 PM", location: "Career Hub", category: "Tech/Career", attendees: 83, isYourEvent: true },
  ],
}

function getEventsForDate(date: string): DayEvent[] {
  if (eventsByDate[date]) return eventsByDate[date]
  return [
    {
      name: "Campus Collaboration Meetup",
      time: "5:00 PM",
      location: "Student Center",
      category: "General",
      attendees: 48,
      isYourEvent: false,
    },
    {
      name: "Your Community Session",
      time: "6:30 PM",
      location: "Innovation Hub",
      category: "Community",
      attendees: 67,
      isYourEvent: true,
    },
  ]
}

export function Dashboard() {
  const navigate = useNavigate()
  const [analyticsSummary, setAnalyticsSummary] = useState<AnalyticsSummary | null>(null)

  useEffect(() => {
    analyticsApi.getSummary()
      .then(setAnalyticsSummary)
      .catch(() => {/* keep null - will show mock data */})
  }, [])

  const [visibleWidgetIds, setVisibleWidgetIds] = useState<string[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return defaultVisibleWidgetIds
    try {
      const parsed = JSON.parse(stored) as string[]
      // Migration: keep previous choices but ensure newly added core intelligence widgets appear.
      return Array.from(new Set([...defaultVisibleWidgetIds, ...parsed]))
    } catch {
      return defaultVisibleWidgetIds
    }
  })

  const [isConfiguratorOpen, setIsConfiguratorOpen] = useState(false)
  const [draggingSidebarWidgetId, setDraggingSidebarWidgetId] = useState<string | null>(null)

  const gridContainerRef = useRef<HTMLDivElement>(null)
  const trashZoneRef = useRef<HTMLDivElement>(null)
  const gridContainerWidth = useContainerWidth(gridContainerRef)
  const [draggedWidgetId, setDraggedWidgetId] = useState<string | null>(null)
  const [isOverTrashZone, setIsOverTrashZone] = useState(false)

  const [gridLayout, setGridLayout] = useState<Layout[]>(() => {
    try {
      const saved = localStorage.getItem(LAYOUT_STORAGE_KEY)
      if (saved) return withRelaxedConstraints(JSON.parse(saved))
    } catch {}
    return withRelaxedConstraints(DEFAULT_LAYOUT)
  })

  const handleLayoutChange = (layout: Layout[]) => {
    const constrainedLayout = withRelaxedConstraints(layout)
    setGridLayout(constrainedLayout)
    localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(constrainedLayout))
  }

  const [waveSettingsOpen, setWaveSettingsOpen] = useState(false)
  const [waveConfig, setWaveConfig] = useState<ParticleWavesConfig>({
    density: 35,
    speed: 0.07,
    amplitude: 38,
    separation: 85,
    particleColor: '#b7a57a',
  })
  const [isEngagementDialogOpen, setIsEngagementDialogOpen] = useState(false)
  const [comparisonTarget, setComparisonTarget] = useState<"all" | "founder-sprint">("all")
  const [comparisonPeriod, setComparisonPeriod] = useState<"week" | "quarter">("quarter")
  const [compareMetric, setCompareMetric] = useState<ComparativeMetric>("Engagement")
  const [baselineEventId, setBaselineEventId] = useState(eventPerformance[0].id)
  const [comparisonEventId, setComparisonEventId] = useState(eventPerformance[1].id)
  const [selectedComparisonEvents, setSelectedComparisonEvents] = useState<string[]>([])
  const [selectedWeek, setSelectedWeek] = useState<"Week 5" | "Week 7" | "Week 9">("Week 7")
  const [selectedEventType, setSelectedEventType] = useState<"All Events" | "Social" | "Tech/Career">("All Events")
  const [selectedDate, setSelectedDate] = useState<string>("Nov 14")

  const visibleSet = useMemo(() => new Set(visibleWidgetIds), [visibleWidgetIds])

  const onVisibilityChange = (newVisibleIds: string[]) => {
    const deduped = Array.from(new Set(newVisibleIds))
    setVisibleWidgetIds(deduped)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(deduped))
  }

  const removeWidget = (widgetId: string) => {
    const next = visibleWidgetIds.filter((id) => id !== widgetId)
    setVisibleWidgetIds(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  const getPointerPosition = (e: unknown): { x: number; y: number } | null => {
    if (!e || typeof e !== "object") return null
    if ("clientX" in e && "clientY" in e) {
      const evt = e as { clientX: number; clientY: number }
      return { x: evt.clientX, y: evt.clientY }
    }
    if ("touches" in e) {
      const evt = e as { touches?: Array<{ clientX: number; clientY: number }> }
      const touch = evt.touches?.[0]
      if (touch) return { x: touch.clientX, y: touch.clientY }
    }
    if ("changedTouches" in e) {
      const evt = e as { changedTouches?: Array<{ clientX: number; clientY: number }> }
      const touch = evt.changedTouches?.[0]
      if (touch) return { x: touch.clientX, y: touch.clientY }
    }
    return null
  }

  const isPointerInsideTrash = (e: unknown) => {
    const pos = getPointerPosition(e)
    const rect = trashZoneRef.current?.getBoundingClientRect()
    if (!pos || !rect) return false
    return pos.x >= rect.left && pos.x <= rect.right && pos.y >= rect.top && pos.y <= rect.bottom
  }

  const onLayoutReset = () => {
    const next = defaultVisibleWidgetIds
    setVisibleWidgetIds(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  const getWidgetTemplateLayout = (widgetId: string): Layout => {
    const fromDefault = DEFAULT_LAYOUT.find((item) => item.i === widgetId)
    if (fromDefault) return { ...fromDefault }
    const maxY = gridLayout.reduce((max, item) => Math.max(max, item.y + item.h), 0)
    return { i: widgetId, x: 0, y: maxY, w: 4, h: 4, minW: 2, minH: 2 }
  }

  const addWidgetToDashboard = (widgetId: string, dropLayout?: Partial<Layout>) => {
    if (!widgetId) return

    const nextVisible = visibleWidgetIds.includes(widgetId)
      ? visibleWidgetIds
      : [...visibleWidgetIds, widgetId]
    setVisibleWidgetIds(nextVisible)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextVisible))

    const existingLayout = gridLayout.find((item) => item.i === widgetId)
    const base = existingLayout ? { ...existingLayout } : getWidgetTemplateLayout(widgetId)
    const merged: Layout = {
      ...base,
      ...(dropLayout?.x != null ? { x: dropLayout.x } : {}),
      ...(dropLayout?.y != null ? { y: dropLayout.y } : {}),
      ...(dropLayout?.w != null ? { w: dropLayout.w } : {}),
      ...(dropLayout?.h != null ? { h: dropLayout.h } : {}),
    }

    const nextLayoutWithoutWidget = gridLayout.filter((item) => item.i !== widgetId)
    const nextLayout = withRelaxedConstraints([...nextLayoutWithoutWidget, merged])
    setGridLayout(nextLayout)
    localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(nextLayout))
  }

  const getDroppedWidgetId = (e: DragEvent | React.DragEvent) => {
    return (
      e.dataTransfer?.getData("application/x-dashboard-widget") ||
      e.dataTransfer?.getData("text/plain") ||
      draggingSidebarWidgetId ||
      ""
    )
  }

  const handleExternalWidgetDrop = (
    e: React.DragEvent<HTMLDivElement>,
    droppedItem?: Partial<Layout>
  ) => {
    e.preventDefault()
    const droppedWidgetId = getDroppedWidgetId(e)
    if (!droppedWidgetId) return
    addWidgetToDashboard(droppedWidgetId, droppedItem)
    setDraggingSidebarWidgetId(null)
    setIsConfiguratorOpen(false)
  }

  const kpis = [
    {
      label: "Total RSVPs",
      value: analyticsSummary ? analyticsSummary.total_rsvps.toLocaleString() : "—",
      trend: "",
      note: "across all events",
    },
    { label: "Avg. Show Rate", value: "—", trend: "", note: "coming soon" },
    {
      label: "Active Events",
      value: analyticsSummary ? analyticsSummary.total_events.toLocaleString() : "—",
      trend: "",
      note: "total events",
    },
    { label: "Engagement Index", value: "—", trend: "", note: "coming soon" },
  ]

  const baselineEvent = eventPerformance.find((event) => event.id === baselineEventId) ?? eventPerformance[0]
  const comparisonEvent = eventPerformance.find((event) => event.id === comparisonEventId) ?? eventPerformance[1]
  const comparisonEventOptions = useMemo(
    () => eventPerformance.filter((event) => event.id !== baselineEvent.id),
    [baselineEvent.id]
  )
  const metricLabel = compareMetric

  const radarKey = `${comparisonTarget}-${comparisonPeriod}`
  const radarBaseData = radarComparativeProfiles[radarKey] ?? radarComparativeProfiles["all-quarter"]
  const availableComparisonEvents = similarEventsData[comparisonTarget]?.[comparisonPeriod] ?? []
  const filteredComparisonEvents =
    selectedComparisonEvents.length > 0
      ? availableComparisonEvents.filter((event) => selectedComparisonEvents.includes(event.name))
      : availableComparisonEvents

  const radarData: RadarComparisonPoint[] = useMemo(() => {
    const selectedPool = filteredComparisonEvents.length > 0 ? filteredComparisonEvents : availableComparisonEvents
    if (selectedPool.length === 0) return radarBaseData

    return radarBaseData.map((point) => {
      const similarAverage =
        selectedPool.reduce((sum, event) => sum + event.scores[point.metric], 0) / selectedPool.length
      return {
        metric: point.metric,
        yourEvent: point.yourEvent,
        similar: Math.round(similarAverage),
      }
    })
  }, [availableComparisonEvents, filteredComparisonEvents, radarBaseData])

  const selectedMetricPoint = useMemo(
    () => radarData.find((point) => point.metric === compareMetric),
    [compareMetric, radarData]
  )
  const metricDelta = selectedMetricPoint ? selectedMetricPoint.yourEvent - selectedMetricPoint.similar : 0
  const deltaLabel = selectedMetricPoint ? `${metricDelta >= 0 ? "+" : ""}${metricDelta}` : "No data"
  const selectedMetricDefinition = comparativeMetricDefinitions[metricLabel]

  const selectedDateEvents = getEventsForDate(selectedDate)

  const comparativeDeepDiveHref = useMemo(() => {
    const params = new URLSearchParams()
    params.set("target", comparisonTarget)
    params.set("period", comparisonPeriod)
    params.set("metric", compareMetric)
    params.set("baseline", baselineEventId)
    params.set("compare", comparisonEventId)
    selectedComparisonEvents.forEach((name) => params.append("pool", name))
    return `/contributor/analytics/comparative?${params.toString()}`
  }, [
    comparisonTarget,
    comparisonPeriod,
    compareMetric,
    baselineEventId,
    comparisonEventId,
    selectedComparisonEvents,
  ])

  const topComparativeSignal = useMemo(() => {
    if (radarData.length === 0) return null
    return radarData.reduce((best, point) => {
      const bestLead = best.yourEvent - best.similar
      const lead = point.yourEvent - point.similar
      return lead > bestLead ? point : best
    })
  }, [radarData])

  const comparativeInsightSentence = topComparativeSignal
    ? (() => {
        const lead = topComparativeSignal.yourEvent - topComparativeSignal.similar
        const poolSize = filteredComparisonEvents.length || availableComparisonEvents.length
        if (lead >= 0) {
          return `${baselineEvent.name} is outperforming your selected pool on ${topComparativeSignal.metric} by ${lead} points across ${poolSize} comparable events.`
        }
        return `${baselineEvent.name} is trailing your selected pool on ${topComparativeSignal.metric} by ${Math.abs(lead)} points across ${poolSize} comparable events.`
      })()
    : "Select comparable events to surface where your event is over- or under-indexing."

  useEffect(() => {
    const defaults = availableComparisonEvents.map((event) => event.name)
    setSelectedComparisonEvents(defaults)
  }, [comparisonTarget, comparisonPeriod])

  useEffect(() => {
    if (comparisonEventId === baselineEvent.id) {
      setComparisonEventId(comparisonEventOptions[0]?.id ?? baselineEvent.id)
    }
  }, [baselineEvent.id, comparisonEventId, comparisonEventOptions])

  function renderWidget(id: string, layoutItem?: Layout): React.ReactNode {
    switch (id) {
      case "kpi-rsvps":
      case "kpi-showrate":
      case "kpi-events":
      case "kpi-engagement": {
        const kpiIndex = { "kpi-rsvps": 0, "kpi-showrate": 1, "kpi-events": 2, "kpi-engagement": 3 }[id] ?? 0
        const kpi = kpis[kpiIndex]
        const isClickable = kpi.label === "Active Events" || kpi.label === "Engagement Index"
        const spark = kpiSparkData[id] ?? []
        const sparkMax = Math.max(...spark)
        const widgetW = layoutItem?.w ?? 3
        const widgetH = layoutItem?.h ?? 3
        const compact = widgetW <= 2 || widgetH <= 2
        const dense = widgetW <= 2 && widgetH <= 2
        const valueFontSize = Math.max(26, Math.min(64, 16 + widgetW * 8 + widgetH * 5))
        const labelFontSize = dense ? 9 : 10
        const noteFontSize = compact ? 10 : 12
        const showTrend = widgetH >= 3
        return (
          <motion.article
            onClick={() => {
              if (kpi.label === "Active Events") navigate("/contributor/events")
              if (kpi.label === "Engagement Index") setIsEngagementDialogOpen(true)
            }}
            className={`relative h-full overflow-hidden rounded-2xl border border-white/6 bg-[#0d0a1a] p-4 shadow-sm flex flex-col justify-between ${isClickable ? "cursor-pointer" : ""}`}
            whileHover={{ borderColor: "rgba(183,165,122,0.18)" }}
            transition={{ duration: 0.25 }}
          >
            {/* Ambient sparkline bars — background decoration */}
            <div className="absolute inset-x-0 bottom-0 flex items-end gap-[2px] px-2 h-3/4 pointer-events-none">
              {spark.map((v, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-[2px] bg-[#b7a57a]/10"
                  style={{ height: `${(v / sparkMax) * 100}%` }}
                />
              ))}
            </div>
            {/* Purple glow */}
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-[#4b2e83]/20 blur-2xl pointer-events-none" />

            {/* Label */}
            <p
              className="relative uppercase tracking-[0.2em] text-white/35 z-10"
              style={{ fontSize: `${labelFontSize}px` }}
            >
              {kpi.label}
            </p>

            {/* Giant number */}
            <div className="relative z-10 mt-2">
              <p
                className="font-black tracking-tight text-white/90 leading-none"
                style={{ fontSize: `${valueFontSize}px` }}
              >
                <AnimatedNumber value={kpi.value} />
              </p>
              <p className="mt-1 text-white/35" style={{ fontSize: `${noteFontSize}px` }}>
                {kpi.note}
              </p>
            </div>

            {/* Trend footer */}
            {showTrend && (
              <div className="relative z-10 mt-3 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#4b2e83]/30 px-2 py-0.5 text-xs font-semibold text-[#d8c8ff]">
                  <TrendingUp size={11} />
                  {kpi.trend}
                </span>
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#b7a57a] opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#b7a57a]" />
                </span>
                {isClickable && <span className="text-[10px] text-[#cdb7ff]/50 uppercase tracking-wider">tap to open</span>}
              </div>
            )}
          </motion.article>
        )
      }
      case "attendance": return (
        <motion.article
          className="relative overflow-hidden rounded-2xl border border-white/6 bg-[#0d0a1a] p-4 shadow-sm md:p-5 h-full flex flex-col"
          whileHover={{ borderColor: "rgba(183,165,122,0.18)" }}
          transition={{ duration: 0.25 }}
        >
          <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-[#4b2e83]/12 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex items-start justify-between gap-3 mb-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">Attendance Overview</p>
              <p className="mt-1 text-4xl font-black tracking-tight text-white/90 leading-none">
                <AnimatedNumber value="89.6%" />
              </p>
              <p className="mt-1 text-xs text-white/35">avg show rate</p>
            </div>
            <div className="flex flex-col gap-1 text-right mt-1">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#b7a57a]/15 px-2 py-0.5 text-xs font-semibold text-[#b7a57a]">
                <TrendingUp size={10} /> +4.1%
              </span>
              <span className="text-[10px] text-white/30">registered vs attended</span>
            </div>
          </div>

          <div className="relative z-10 flex-1 min-h-0" style={{ minHeight: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1528" vertical={false} />
                <XAxis dataKey="event" tick={{ fontSize: 10, fill: "#6b5f7a" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#6b5f7a" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#1c1730", border: "1px solid #3a3252", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="registered" fill="#4b2e83" radius={[4, 4, 0, 0]} isAnimationActive animationDuration={1000} animationEasing="ease-out" />
                <Bar dataKey="attended" fill="#b7a57a" radius={[4, 4, 0, 0]} isAnimationActive animationDuration={1000} animationEasing="ease-out" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.article>
      )
      case "engagement": return (
        (() => {
          const latest = engagementData[engagementData.length - 1] ?? { month: "", saves: 0, shares: 0, comments: 0 }
          const previous = engagementData[engagementData.length - 2] ?? latest
          const totalActions = latest.saves + latest.shares + latest.comments
          const previousTotalActions = previous.saves + previous.shares + previous.comments
          const deltaPercent = previousTotalActions === 0
            ? 0
            : ((totalActions - previousTotalActions) / previousTotalActions) * 100
          const trendLabel = `${deltaPercent >= 0 ? "+" : ""}${deltaPercent.toFixed(1)}%`

          return (
            <motion.article
              className="relative overflow-hidden rounded-2xl border border-white/6 bg-[#0d0a1a] p-4 shadow-sm md:p-5 h-full flex flex-col"
              whileHover={{ borderColor: "rgba(124,92,191,0.3)" }}
              transition={{ duration: 0.25 }}
            >
              {/* Particle/glow accent */}
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#7c5cbf]/15 blur-3xl pointer-events-none" />
              <div className="absolute top-1/2 right-4 w-20 h-20 rounded-full bg-[#b7a57a]/8 blur-2xl pointer-events-none animate-pulse" />

              {/* Header with key stat */}
              <div className="relative z-10 flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">Engagement Trend</p>
                  <p className="mt-1 text-4xl font-black tracking-tight text-white/90 leading-none">
                    <AnimatedNumber value={`${totalActions}`} />
                  </p>
                  <p className="mt-1 text-xs text-white/35">total actions this month</p>
                  <p className="mt-1 text-[10px] text-white/30">
                    {latest.comments} comments · {latest.shares} shares · {latest.saves} saves
                  </p>
                </div>
                <div className="flex flex-col gap-1 text-right mt-1">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#4b2e83]/30 px-2 py-0.5 text-xs font-semibold text-[#d8c8ff]">
                    <TrendingUp size={10} /> {trendLabel}
                  </span>
                  <span className="text-[10px] text-white/30">vs last month</span>
                </div>
              </div>

              <div className="relative z-10 flex-1 min-h-0" style={{ minHeight: 180 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1a1528" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6b5f7a" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#6b5f7a" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: "#1c1730", border: "1px solid #3a3252", borderRadius: 8, fontSize: 12 }} />
                    <Line
                      type="monotone"
                      dataKey="saves"
                      name="Saves"
                      stroke="#4b2e83"
                      strokeWidth={2.3}
                      dot={{ r: 2.5, fill: "#4b2e83" }}
                      activeDot={{ r: 4 }}
                      isAnimationActive
                      animationDuration={1200}
                      animationEasing="ease-out"
                    />
                    <Line
                      type="monotone"
                      dataKey="shares"
                      name="Shares"
                      stroke="#7b699f"
                      strokeWidth={2.3}
                      dot={{ r: 2.5, fill: "#7b699f" }}
                      activeDot={{ r: 4 }}
                      isAnimationActive
                      animationDuration={1200}
                      animationEasing="ease-out"
                    />
                    <Line
                      type="monotone"
                      dataKey="comments"
                      name="Comments"
                      stroke="#b7a57a"
                      strokeWidth={2.6}
                      dot={{ r: 2.5, fill: "#b7a57a" }}
                      activeDot={{ r: 4 }}
                      isAnimationActive
                      animationDuration={1200}
                      animationEasing="ease-out"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.article>
          )
        })()
      )
      case "demographics": return (
        <motion.article
          className="h-full flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-4 shadow-sm md:p-5"
          whileHover={{ y: -2, scale: 1.005 }}
          transition={{ duration: 0.2 }}
        >
          <h2 className="text-sm font-black uppercase tracking-[0.14em] text-white/85">Audience Distribution</h2>
          <p className="mt-1 text-xs text-white/45">Class-year breakdown of attendees</p>
          <div className="mt-4 flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={classYearData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                  {classYearData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.article>
      )
      case "comparative": return (
        <motion.section
          className="h-full flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-4 shadow-sm transition-colors hover:border-[#7c5cbf]/45 md:p-5"
          whileHover={{ y: -2, scale: 1.003 }}
          transition={{ duration: 0.2 }}
        >
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-black uppercase tracking-[0.14em] text-white/85">Comparative Intelligence</h2>
              <p className="mt-1 text-xs text-white/45">Quick preview of your comparison setup before opening deep dive.</p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-md border border-[#7c5cbf]/45 bg-[#7c5cbf]/12 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.11em] text-[#e2d6ff]">
              Preview
            </span>
          </div>

          <div className="mb-3 rounded-lg border border-[#7c5cbf]/30 bg-[#7c5cbf]/10 p-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#d8c8ff]">Selected Pair</p>
            <p className="mt-1 text-xs text-[#ece5ff]">{baselineEvent.name} vs {comparisonEvent.name}</p>
          </div>

          <div className="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <select
              value={baselineEvent.id}
              onChange={(e) => setBaselineEventId(e.target.value)}
              className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-medium text-white/85 outline-none transition-colors focus:border-[#7c5cbf]"
            >
              {eventPerformance.map((event) => (
                <option key={event.id} value={event.id}>
                  Your Event: {event.name}
                </option>
              ))}
            </select>
            <select
              value={comparisonEvent.id}
              onChange={(e) => setComparisonEventId(e.target.value)}
              className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-medium text-white/85 outline-none transition-colors focus:border-[#7c5cbf]"
            >
              {comparisonEventOptions.map((event) => (
                <option key={event.id} value={event.id}>
                  Compare: {event.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3 grid grid-cols-1 gap-2">
            <select
              value={compareMetric}
              onChange={(e) => setCompareMetric(e.target.value as ComparativeMetric)}
              className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-medium text-white/85 outline-none transition-colors focus:border-[#7c5cbf]"
            >
              {comparativeMetricOptions.map((metric) => (
                <option key={metric} value={metric}>{metric}</option>
              ))}
            </select>
          </div>

          <div className="flex-1 grid grid-cols-1 gap-3 md:grid-cols-[0.95fr_1.05fr] min-h-0">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <p className="text-[11px] uppercase tracking-[0.12em] text-white/45">Snapshot Delta · {metricLabel}</p>
              <p className="mt-1 text-2xl font-black text-[#e7dcff]">{deltaLabel}</p>
              <p className="mt-1 text-xs text-white/55">{comparisonEvent.name} vs {baselineEvent.name}</p>
              <p className="mt-3 text-xs leading-relaxed text-white/60">{comparativeInsightSentence}</p>
              <div className="mt-3 border-t border-white/10 pt-2">
                <p className="text-[10px] uppercase tracking-[0.12em] text-white/40">Metric Definition</p>
                <p className="mt-1 text-[11px] leading-relaxed text-white/50">{selectedMetricDefinition}</p>
              </div>
            </div>
            <div className="flex h-full min-h-0 flex-col rounded-xl border border-white/10 bg-white/[0.03] p-2">
              <div className="mb-2 flex flex-wrap gap-1.5">
                <span className="rounded-full border border-white/12 bg-white/[0.03] px-2 py-0.5 text-[10px] uppercase tracking-[0.11em] text-white/55">
                  {metricLabel}
                </span>
                <span className="rounded-full border border-white/12 bg-white/[0.03] px-2 py-0.5 text-[10px] uppercase tracking-[0.11em] text-white/55">
                  Pool {filteredComparisonEvents.length || availableComparisonEvents.length}
                </span>
              </div>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#2a2238" />
                  <PolarAngleAxis
                    dataKey="metric"
                    tick={{ fontSize: 9, fill: "#a79abc" }}
                    tickFormatter={(value) =>
                      String(value)
                        .replace("Reach Efficiency", "Reach Eff.")
                        .replace("Registration", "Reg.")
                        .replace("Commitment", "Commit.")
                        .replace("Repeat Rate", "Repeat")
                    }
                  />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} />
                  <Radar dataKey="yourEvent" stroke="#7c5cbf" fill="#7c5cbf" fillOpacity={0.45} />
                  <Radar dataKey="similar" stroke="#b7a57a" fill="#b7a57a" fillOpacity={0.22} />
                </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-[10px] text-white/50">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#7c5cbf]" />
                  {baselineEvent.name}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#b7a57a]" />
                  Selected Pool Avg
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 flex justify-end">
            <button
              onClick={() => navigate(comparativeDeepDiveHref)}
              className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-[#7c5cbf]/45 bg-[#7c5cbf]/12 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.11em] text-[#e2d6ff] transition-colors hover:bg-[#7c5cbf]/20"
            >
              Open Deep Dive
              <ArrowUpRight size={11} />
            </button>
          </div>
        </motion.section>
      )
      case "temporal": return (
        <motion.section
          className="h-full flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-4 shadow-sm md:p-5"
          whileHover={{ y: -2, scale: 1.003 }}
          transition={{ duration: 0.2 }}
        >
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-sm font-black uppercase tracking-[0.14em] text-white/85">Temporal Intelligence</h2>
              <p className="mt-1 text-xs text-white/45">Choose timing windows with lower competition and better attendance profiles.</p>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <select
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(e.target.value as "Week 5" | "Week 7" | "Week 9")}
                className="rounded-lg border border-white/15 bg-white/5 backdrop-blur-sm px-3 py-2 text-xs font-medium text-white/85 outline-none transition-colors focus:border-[#7c5cbf]"
              >
                <option value="Week 5">Week 5</option>
                <option value="Week 7">Week 7</option>
                <option value="Week 9">Week 9</option>
              </select>
              <select
                value={selectedEventType}
                onChange={(e) => setSelectedEventType(e.target.value as "All Events" | "Social" | "Tech/Career")}
                className="rounded-lg border border-white/15 bg-white/5 backdrop-blur-sm px-3 py-2 text-xs font-medium text-white/85 outline-none transition-colors focus:border-[#7c5cbf]"
              >
                <option value="All Events">All Events</option>
                <option value="Social">Social</option>
                <option value="Tech/Career">Tech/Career</option>
              </select>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 gap-4 lg:grid-cols-2 min-h-0">
            <article className="h-full flex flex-col rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-white/45">Calendar Saturation</p>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={calendarSaturationByWeek[selectedWeek]}
                    onClick={(state) => {
                      const clicked = state?.activeLabel as string | undefined
                      if (clicked) setSelectedDate(clicked)
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2238" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#b8accd" }} />
                    <YAxis tick={{ fontSize: 11, fill: "#b8accd" }} />
                    <Tooltip />
                    <Bar dataKey="events" fill="#b7a57a" radius={[6, 6, 0, 0]} isAnimationActive={true} animationDuration={1000} animationEasing="ease-out" />
                    <Bar dataKey="yourEvent" fill="#7c5cbf" radius={[6, 6, 0, 0]} isAnimationActive={true} animationDuration={1000} animationEasing="ease-out" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-2 text-xs text-[#d8c8ff]">
                Peak competition in {selectedWeek}:{" "}
                {calendarSaturationByWeek[selectedWeek].reduce((max, row) => (row.events > max.events ? row : max), calendarSaturationByWeek[selectedWeek][0]).date}
              </p>
              <p className="mt-1 text-xs text-white/45">Click a date bar to inspect events for that day.</p>

              <div className="mt-3 rounded-lg border border-white/10 bg-white/[0.03] backdrop-blur-sm p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#d8c8ff]">Events on {selectedDate}</p>
                <div className="mt-2 space-y-2">
                  {selectedDateEvents.map((event) => (
                    <div key={`${selectedDate}-${event.name}`} className="rounded-md border border-white/10 bg-white/[0.04] backdrop-blur-md/70 p-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-white/90">{event.name}</p>
                        {event.isYourEvent && (
                          <span className="rounded-md bg-[#7c5cbf]/25 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#d8c8ff]">
                            Your Event
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-white/60">
                        <span className="inline-flex items-center gap-1">
                          <Clock3 size={11} />
                          {event.time}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin size={11} />
                          {event.location}
                        </span>
                        <span>{event.attendees} attendees</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </article>

            <article className="h-full flex flex-col rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-white/45">Cumulative Attendance Pattern</p>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={attendanceByEventType[selectedEventType]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2238" />
                    <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#b8accd" }} />
                    <YAxis tick={{ fontSize: 11, fill: "#b8accd" }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="attendance" stroke="#7c5cbf" strokeWidth={2.5} dot={{ fill: "#7c5cbf", r: 3 }} isAnimationActive={true} animationDuration={1200} animationEasing="ease-out" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-md bg-green-500/10 p-2">
                  <p className="text-[10px] uppercase text-white/50">Best</p>
                  <p className="text-xs font-semibold text-green-300">Week 7-8</p>
                </div>
                <div className="rounded-md bg-red-500/10 p-2">
                  <p className="text-[10px] uppercase text-white/50">Avoid</p>
                  <p className="text-xs font-semibold text-red-300">Week 5, 9-10</p>
                </div>
                <div className="rounded-md bg-blue-500/10 p-2">
                  <p className="text-[10px] uppercase text-white/50">Drop</p>
                  <p className="text-xs font-semibold text-blue-300">-34% finals</p>
                </div>
              </div>
            </article>
          </div>
        </motion.section>
      )
      case "upcoming": return (
        <motion.section
          className="h-full flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-4 shadow-sm md:p-5"
          whileHover={{ y: -2, scale: 1.003 }}
          transition={{ duration: 0.2 }}
        >
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-[0.14em] text-white/85">Upcoming Events</h2>
            <Link to="/contributor/events" className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#4b2e83]">
              View all
              <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {upcomingEvents.map((event) => (
              <div key={event.title} className="rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-3">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-white/90">{event.title}</h3>
                  <span className="rounded-md bg-[#4b2e83]/8 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#4b2e83]">
                    {event.status}
                  </span>
                </div>
                <p className="flex items-center gap-1.5 text-xs text-white/60">
                  <Calendar size={12} />
                  {event.date}
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-white/60">
                  <Users size={12} />
                  {event.rsvps} RSVPs
                </p>
              </div>
            ))}
          </div>
        </motion.section>
      )
      case "reg-velocity": return (
        <motion.article className="h-full flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-4 shadow-sm md:p-5" whileHover={{ y: -2, scale: 1.005 }} transition={{ duration: 0.2 }}>
          <h2 className="text-sm font-black uppercase tracking-[0.14em] text-white/85">Registration Velocity</h2>
          <p className="mt-1 text-xs text-white/45">Cumulative registrations day-by-day to event</p>
            <div className="mt-4 flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={registrationVelocityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2238" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#b8accd" }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "#b8accd" }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "#b8accd" }} />
                <Tooltip contentStyle={{ background: "#1c1730", border: "1px solid #3a3252", borderRadius: 8, fontSize: 12 }} />
                <Area yAxisId="left" type="monotone" dataKey="cumulative" stroke="#4b2e83" fill="#4b2e83" fillOpacity={0.15} strokeWidth={2} isAnimationActive animationDuration={1200} animationEasing="ease-out" />
                <Bar yAxisId="right" dataKey="daily" fill="#b7a57a" radius={[4, 4, 0, 0]} fillOpacity={0.7} isAnimationActive animationDuration={1000} animationEasing="ease-out" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </motion.article>
      )
      case "reg-sources": return (
        <motion.article className="h-full flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-4 shadow-sm md:p-5" whileHover={{ y: -2, scale: 1.005 }} transition={{ duration: 0.2 }}>
          <h2 className="text-sm font-black uppercase tracking-[0.14em] text-white/85">Registration Sources</h2>
          <p className="mt-1 text-xs text-white/45">Where registrations originate from</p>
          <div className="mt-4 flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={registrationSourceData} dataKey="value" nameKey="source" cx="50%" cy="50%" innerRadius={55} outerRadius={90} label={({ source, percent }) => `${source} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {registrationSourceData.map((entry) => <Cell key={entry.source} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "#1c1730", border: "1px solid #3a3252", borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.article>
      )
      case "live-capacity": return (
        <motion.article className="h-full flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-4 shadow-sm md:p-5" whileHover={{ y: -2, scale: 1.005 }} transition={{ duration: 0.2 }}>
          <h2 className="text-sm font-black uppercase tracking-[0.14em] text-white/85">Capacity Utilization</h2>
          <p className="mt-1 text-xs text-white/45">Attended vs. venue capacity per event</p>
          <div className="mt-4 flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={capacityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2238" />
                <XAxis dataKey="event" tick={{ fontSize: 11, fill: "#b8accd" }} />
                <YAxis tick={{ fontSize: 11, fill: "#b8accd" }} />
                <Tooltip contentStyle={{ background: "#1c1730", border: "1px solid #3a3252", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="capacity" fill="#2a2238" radius={[6, 6, 0, 0]} isAnimationActive animationDuration={1000} animationEasing="ease-out" />
                <Bar dataKey="attended" fill="#4b2e83" radius={[6, 6, 0, 0]} isAnimationActive animationDuration={1000} animationEasing="ease-out" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </motion.article>
      )
      case "post-firsttime": return (
        <motion.article className="h-full flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-4 shadow-sm md:p-5" whileHover={{ y: -2, scale: 1.005 }} transition={{ duration: 0.2 }}>
          <h2 className="text-sm font-black uppercase tracking-[0.14em] text-white/85">First-Time vs. Returning</h2>
          <p className="mt-1 text-xs text-white/45">Repeat attendee ratio per event</p>
          <div className="mt-4 flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={firstTimeRepeatData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2238" />
                <XAxis dataKey="event" tick={{ fontSize: 11, fill: "#b8accd" }} />
                <YAxis tick={{ fontSize: 11, fill: "#b8accd" }} />
                <Tooltip contentStyle={{ background: "#1c1730", border: "1px solid #3a3252", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="returning" stackId="a" fill="#4b2e83" isAnimationActive animationDuration={1000} animationEasing="ease-out" />
                <Bar dataKey="firstTime" stackId="a" fill="#b7a57a" radius={[6, 6, 0, 0]} isAnimationActive animationDuration={1000} animationEasing="ease-out" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex gap-4 text-xs text-white/55">
            <span className="flex items-center gap-1.5"><span className="inline-block h-2 w-2 rounded-full bg-[#4b2e83]" />Returning</span>
            <span className="flex items-center gap-1.5"><span className="inline-block h-2 w-2 rounded-full bg-[#b7a57a]" />First-Time</span>
          </div>
        </motion.article>
      )
      case "post-by-major": return (
        <motion.article className="h-full flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-4 shadow-sm md:p-5" whileHover={{ y: -2, scale: 1.005 }} transition={{ duration: 0.2 }}>
          <h2 className="text-sm font-black uppercase tracking-[0.14em] text-white/85">Attendance by Major</h2>
          <p className="mt-1 text-xs text-white/45">Discipline breakdown across quarters</p>
          <div className="mt-4 flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceByMajorData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2238" />
                  <XAxis type="number" tick={{ fontSize: 11, fill: "#b8accd" }} />
                  <YAxis type="category" dataKey="major" tick={{ fontSize: 11, fill: "#b8accd" }} width={72} />
                  <Tooltip contentStyle={{ background: "#1c1730", border: "1px solid #3a3252", borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="spring" fill="#4b2e83" radius={[0, 4, 4, 0]} isAnimationActive animationDuration={1000} animationEasing="ease-out" />
                <Bar dataKey="fall" fill="#7c5cbf" radius={[0, 4, 4, 0]} isAnimationActive animationDuration={1000} animationEasing="ease-out" />
                <Bar dataKey="winter" fill="#b7a57a" radius={[0, 4, 4, 0]} isAnimationActive animationDuration={1000} animationEasing="ease-out" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.article>
      )
      case "seg-new-returning": return (
        <motion.article className="h-full flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-4 shadow-sm md:p-5" whileHover={{ y: -2, scale: 1.005 }} transition={{ duration: 0.2 }}>
          <h2 className="text-sm font-black uppercase tracking-[0.14em] text-white/85">New vs. Returning Members</h2>
          <p className="mt-1 text-xs text-white/45">Monthly stacked area over the academic year</p>
          <div className="mt-4 flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={newVsReturningData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2238" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#b8accd" }} />
                <YAxis tick={{ fontSize: 11, fill: "#b8accd" }} />
                <Tooltip contentStyle={{ background: "#1c1730", border: "1px solid #3a3252", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="returning" stackId="1" stroke="#4b2e83" fill="#4b2e83" fillOpacity={0.4} isAnimationActive animationDuration={1200} animationEasing="ease-out" />
                <Area type="monotone" dataKey="new" stackId="1" stroke="#b7a57a" fill="#b7a57a" fillOpacity={0.4} isAnimationActive animationDuration={1200} animationEasing="ease-out" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex gap-4 text-xs text-white/55">
            <span className="flex items-center gap-1.5"><span className="inline-block h-2 w-2 rounded-full bg-[#4b2e83]" />Returning</span>
            <span className="flex items-center gap-1.5"><span className="inline-block h-2 w-2 rounded-full bg-[#b7a57a]" />New</span>
          </div>
        </motion.article>
      )
      case "seg-tiers": return (
        <motion.article className="h-full flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-4 shadow-sm md:p-5" whileHover={{ y: -2, scale: 1.005 }} transition={{ duration: 0.2 }}>
          <h2 className="text-sm font-black uppercase tracking-[0.14em] text-white/85">Engagement Tier Distribution</h2>
          <p className="mt-1 text-xs text-white/45">Member count by engagement frequency tier</p>
          <div className="mt-4 flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engagementTierData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2238" />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#b8accd" }} />
                <YAxis type="category" dataKey="tier" tick={{ fontSize: 10, fill: "#b8accd" }} width={110} />
                <Tooltip contentStyle={{ background: "#1c1730", border: "1px solid #3a3252", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="count" radius={[0, 6, 6, 0]} isAnimationActive animationDuration={1000} animationEasing="ease-out">
                  {engagementTierData.map((entry) => <Cell key={entry.tier} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.article>
      )
      case "seg-treemap": return (
        <motion.article className="h-full flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-4 shadow-sm md:p-5" whileHover={{ y: -2, scale: 1.003 }} transition={{ duration: 0.2 }}>
          <h2 className="text-sm font-black uppercase tracking-[0.14em] text-white/85">Academic Profile — Major Breakdown</h2>
          <p className="mt-1 text-xs text-white/45">Treemap sized by attendance count across departments</p>
          <div className="mt-4 flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <Treemap data={majorTreemapData} dataKey="size" aspectRatio={4 / 3} stroke="#0d0a1a" strokeWidth={2} content={({ x, y, width, height, name, fill, value }: any) => width > 30 && height > 20 ? (
                <g>
                  <rect x={x} y={y} width={width} height={height} fill={fill ?? "#4b2e83"} rx={4} />
                  {width > 60 && height > 30 && <text x={x + width / 2} y={y + height / 2 - 5} textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize={11} fontWeight={600}>{name}</text>}
                  {width > 60 && height > 44 && <text x={x + width / 2} y={y + height / 2 + 10} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize={10}>{value?.toLocaleString()}</text>}
                </g>
              ) : <rect x={x} y={y} width={width} height={height} fill={fill ?? "#4b2e83"} rx={2} />} />
            </ResponsiveContainer>
          </div>
        </motion.article>
      )
      case "behav-times": return (
        <motion.article className="h-full flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-4 shadow-sm md:p-5" whileHover={{ y: -2, scale: 1.005 }} transition={{ duration: 0.2 }}>
          <h2 className="text-sm font-black uppercase tracking-[0.14em] text-white/85">Preferred Event Times</h2>
          <p className="mt-1 text-xs text-white/45">Attendance activity by day × time slot</p>
          <div className="mt-4 flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={preferredTimesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2238" />
                <XAxis dataKey="slot" tick={{ fontSize: 9, fill: "#b8accd" }} angle={-35} textAnchor="end" height={46} />
                <YAxis tick={{ fontSize: 11, fill: "#b8accd" }} />
                <Tooltip contentStyle={{ background: "#1c1730", border: "1px solid #3a3252", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="activity" radius={[4, 4, 0, 0]} isAnimationActive animationDuration={1000} animationEasing="ease-out">
                  {preferredTimesData.map((entry) => (
                    <Cell key={entry.slot} fill={entry.activity >= 150 ? "#4b2e83" : entry.activity >= 100 ? "#7c5cbf" : "#b7a57a"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.article>
      )
      case "ret-growth": return (
        <motion.article className="h-full flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-4 shadow-sm md:p-5" whileHover={{ y: -2, scale: 1.005 }} transition={{ duration: 0.2 }}>
          <h2 className="text-sm font-black uppercase tracking-[0.14em] text-white/85">Member Growth</h2>
          <p className="mt-1 text-xs text-white/45">Total members, new acquisitions, and churn per month</p>
          <div className="mt-4 flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={memberGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2238" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#b8accd" }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "#b8accd" }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "#b8accd" }} />
                <Tooltip contentStyle={{ background: "#1c1730", border: "1px solid #3a3252", borderRadius: 8, fontSize: 12 }} />
                <Bar yAxisId="right" dataKey="new" fill="#4b2e83" radius={[4, 4, 0, 0]} name="New" isAnimationActive animationDuration={1000} animationEasing="ease-out" />
                <Bar yAxisId="right" dataKey="churned" fill="#7c3060" radius={[4, 4, 0, 0]} name="Churned" isAnimationActive animationDuration={1000} animationEasing="ease-out" />
                <Line yAxisId="left" type="monotone" dataKey="total" stroke="#b7a57a" strokeWidth={2.5} dot={{ fill: "#b7a57a", r: 3 }} name="Total" isAnimationActive animationDuration={1200} animationEasing="ease-out" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </motion.article>
      )
      case "success-ratings": return (
        <motion.article className="h-full flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-4 shadow-sm md:p-5" whileHover={{ y: -2, scale: 1.005 }} transition={{ duration: 0.2 }}>
          <h2 className="text-sm font-black uppercase tracking-[0.14em] text-white/85">Event Ratings Distribution</h2>
          <p className="mt-1 text-xs text-white/45">Response count by star rating across all events</p>
          <div className="mt-4 flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={eventRatingsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2238" />
                <XAxis dataKey="rating" tick={{ fontSize: 12, fill: "#b8accd" }} />
                <YAxis tick={{ fontSize: 11, fill: "#b8accd" }} />
                <Tooltip contentStyle={{ background: "#1c1730", border: "1px solid #3a3252", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} isAnimationActive animationDuration={1000} animationEasing="ease-out">
                  {eventRatingsData.map((entry, i) => (
                    <Cell key={entry.rating} fill={["#7c3060", "#7c5cbf", "#9e7baa", "#b7a57a", "#4b2e83"][i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.article>
      )
      case "success-roi": return (
        <motion.article className="h-full flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-4 shadow-sm md:p-5" whileHover={{ y: -2, scale: 1.003 }} transition={{ duration: 0.2 }}>
          <h2 className="text-sm font-black uppercase tracking-[0.14em] text-white/85">Event ROI Analysis</h2>
          <p className="mt-1 text-xs text-white/45">Estimated member value created vs. direct cost per event</p>
          <div className="mt-4 flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={eventROIData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2238" />
                <XAxis dataKey="event" tick={{ fontSize: 11, fill: "#b8accd" }} />
                <YAxis tick={{ fontSize: 11, fill: "#b8accd" }} unit="$" />
                <Tooltip contentStyle={{ background: "#1c1730", border: "1px solid #3a3252", borderRadius: 8, fontSize: 12 }} formatter={(v: number) => `$${v.toLocaleString()}`} />
                <Bar dataKey="cost" fill="#7c3060" radius={[4, 4, 0, 0]} name="Cost" isAnimationActive animationDuration={1000} animationEasing="ease-out" />
                <Bar dataKey="value" fill="#4b2e83" radius={[4, 4, 0, 0]} name="Est. Value" isAnimationActive animationDuration={1000} animationEasing="ease-out" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.article>
      )
      case "mkt-channels": return (
        <motion.article className="h-full flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-4 shadow-sm md:p-5" whileHover={{ y: -2, scale: 1.005 }} transition={{ duration: 0.2 }}>
          <h2 className="text-sm font-black uppercase tracking-[0.14em] text-white/85">Registration by Channel</h2>
          <p className="mt-1 text-xs text-white/45">Volume per acquisition source</p>
          <div className="mt-4 flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={channelData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2238" />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#b8accd" }} />
                <YAxis type="category" dataKey="channel" tick={{ fontSize: 11, fill: "#b8accd" }} width={90} />
                <Tooltip contentStyle={{ background: "#1c1730", border: "1px solid #3a3252", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="registrations" fill="#4b2e83" radius={[0, 4, 4, 0]} name="Registrations" isAnimationActive animationDuration={1000} animationEasing="ease-out" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </motion.article>
      )
      case "growth-forecast": return (
        <motion.article className="h-full flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-4 shadow-sm md:p-5" whileHover={{ y: -2, scale: 1.005 }} transition={{ duration: 0.2 }}>
          <h2 className="text-sm font-black uppercase tracking-[0.14em] text-white/85">Attendance Forecast</h2>
          <p className="mt-1 text-xs text-white/45">Predicted attendance with confidence band through May</p>
          <div className="mt-4 flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2238" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#b8accd" }} />
                <YAxis tick={{ fontSize: 11, fill: "#b8accd" }} />
                <Tooltip contentStyle={{ background: "#1c1730", border: "1px solid #3a3252", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="upper" fill="#4b2e83" fillOpacity={0.12} stroke="none" name="Upper bound" connectNulls isAnimationActive animationDuration={1200} animationEasing="ease-out" />
                <Area type="monotone" dataKey="lower" fill="#0d0a1a" fillOpacity={1} stroke="none" name="Lower bound" connectNulls isAnimationActive animationDuration={1200} animationEasing="ease-out" />
                <Line type="monotone" dataKey="actual" stroke="#b7a57a" strokeWidth={2.5} dot={{ fill: "#b7a57a", r: 4 }} name="Actual" connectNulls={false} isAnimationActive animationDuration={1200} animationEasing="ease-out" />
                <Line type="monotone" dataKey="forecast" stroke="#7c5cbf" strokeWidth={2} strokeDasharray="6 3" dot={{ r: 3 }} name="Forecast" connectNulls isAnimationActive animationDuration={1200} animationEasing="ease-out" />
                <ReferenceLine x="Feb" stroke="#ffffff20" strokeDasharray="3 3" label={{ value: "Today", fill: "#b8accd", fontSize: 10 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </motion.article>
      )
      case "timing-days": return (
        <motion.article className="h-full flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-4 shadow-sm md:p-5" whileHover={{ y: -2, scale: 1.005 }} transition={{ duration: 0.2 }}>
          <h2 className="text-sm font-black uppercase tracking-[0.14em] text-white/85">Best Days of Week</h2>
          <p className="mt-1 text-xs text-white/45">Average attendance by day across all events</p>
          <div className="mt-4 flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bestDaysData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2238" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#b8accd" }} />
                <YAxis tick={{ fontSize: 11, fill: "#b8accd" }} />
                <Tooltip contentStyle={{ background: "#1c1730", border: "1px solid #3a3252", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="attendance" radius={[6, 6, 0, 0]} isAnimationActive animationDuration={1000} animationEasing="ease-out">
                  {bestDaysData.map((entry) => (
                    <Cell key={entry.day} fill={entry.attendance >= 280 ? "#4b2e83" : entry.attendance >= 200 ? "#7c5cbf" : "#3d3060"} />
                  ))}
                </Bar>
                <ReferenceLine y={220} stroke="#b7a57a" strokeDasharray="4 4" label={{ value: "Avg", fill: "#b8accd", fontSize: 10 }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.article>
      )
      case "timing-hours": return (
        <motion.article className="h-full flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-4 shadow-sm md:p-5" whileHover={{ y: -2, scale: 1.005 }} transition={{ duration: 0.2 }}>
          <h2 className="text-sm font-black uppercase tracking-[0.14em] text-white/85">Best Hours of Day</h2>
          <p className="mt-1 text-xs text-white/45">Attendance distribution across start times</p>
          <div className="mt-4 flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={bestHoursData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2238" />
                <XAxis dataKey="hour" tick={{ fontSize: 11, fill: "#b8accd" }} />
                <YAxis tick={{ fontSize: 11, fill: "#b8accd" }} />
                <Tooltip contentStyle={{ background: "#1c1730", border: "1px solid #3a3252", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="attendance" stroke="#4b2e83" fill="#4b2e83" fillOpacity={0.25} strokeWidth={2.5} isAnimationActive animationDuration={1200} animationEasing="ease-out" />
                <ReferenceLine x="6pm" stroke="#b7a57a" strokeDasharray="4 4" label={{ value: "Peak", fill: "#b8accd", fontSize: 10 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.article>
      )
      case "ops-venue": return (
        <motion.article className="h-full flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-4 shadow-sm md:p-5" whileHover={{ y: -2, scale: 1.005 }} transition={{ duration: 0.2 }}>
          <h2 className="text-sm font-black uppercase tracking-[0.14em] text-white/85">Venue Utilization</h2>
          <p className="mt-1 text-xs text-white/45">Average and peak fill rates across venues</p>
          <div className="mt-4 flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={venueUtilizationData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2238" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: "#b8accd" }} unit="%" />
                <YAxis type="category" dataKey="venue" tick={{ fontSize: 10, fill: "#b8accd" }} width={120} />
                <Tooltip contentStyle={{ background: "#1c1730", border: "1px solid #3a3252", borderRadius: 8, fontSize: 12 }} formatter={(v: number) => `${v}%`} />
                <Bar dataKey="avg" fill="#4b2e83" radius={[0, 3, 3, 0]} name="Avg Utilization" isAnimationActive animationDuration={1000} animationEasing="ease-out" />
                <Bar dataKey="peak" fill="#7c5cbf" radius={[0, 4, 4, 0]} name="Peak" isAnimationActive animationDuration={1000} animationEasing="ease-out" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.article>
      )
      case "ops-checkin": return (
        <motion.article className="h-full flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-4 shadow-sm md:p-5" whileHover={{ y: -2, scale: 1.005 }} transition={{ duration: 0.2 }}>
          <h2 className="text-sm font-black uppercase tracking-[0.14em] text-white/85">Check-In Time Distribution</h2>
          <p className="mt-1 text-xs text-white/45">How long it takes attendees to check in</p>
          <div className="mt-4 flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={checkInTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2238" />
                <XAxis dataKey="interval" tick={{ fontSize: 11, fill: "#b8accd" }} />
                <YAxis tick={{ fontSize: 11, fill: "#b8accd" }} />
                <Tooltip contentStyle={{ background: "#1c1730", border: "1px solid #3a3252", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} isAnimationActive animationDuration={1000} animationEasing="ease-out">
                  {checkInTimeData.map((entry, i) => (
                    <Cell key={entry.interval} fill={i <= 2 ? "#4b2e83" : i === 3 ? "#7c5cbf" : "#b7a57a"} />
                  ))}
                </Bar>
                <ReferenceLine x="10–15 min" stroke="#b7a57a" strokeDasharray="4 4" label={{ value: "Median", fill: "#b8accd", fontSize: 10 }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.article>
      )
      default: return null
    }
  }

  return (
    <div className="space-y-6 md:space-y-8">

      {/* ── Full-page particle wave background ─────────────────────────────── */}
      <div className="fixed top-14 left-60 right-0 bottom-0 z-0 pointer-events-none">
        <ParticleWaves {...waveConfig} />
      </div>

      {/* ── Dashboard header ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-md shadow-lg" style={{ minHeight: 160 }}>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" />
        <div className="relative z-10 flex flex-col gap-4 p-5 sm:p-7 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b7a57a]/70">Dashboard</p>
            <h1 className="mt-1 text-2xl font-black tracking-tight text-white/90 md:text-4xl">Contributor Command Center</h1>
            <p className="mt-2 max-w-2xl text-sm text-white/40 md:text-base">
              Choose which analytics buckets matter to your team and build your own contributor view.
            </p>
          </div>
          <div className="flex flex-col items-end gap-4">
            <LiveClock />
            <div className="flex flex-col gap-2 sm:flex-row">
            <button
              onClick={() => setIsConfiguratorOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition-colors hover:bg-white/10 cursor-pointer"
            >
              <LayoutGrid size={16} />
              Configure Dashboard
            </button>

            <Link
              to="/contributor/studio"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#4b2e83]/70 border border-[#4b2e83]/40 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#4b2e83]"
            >
              <PlusCircle size={16} />
              Create Event
            </Link>
          </div>
          </div>
        </div>
      </section>

      {/* ── Dashboard configurator side drawer ─────────────────────────────── */}
      <DashboardLayoutConfigurator
        open={isConfiguratorOpen}
        onClose={() => setIsConfiguratorOpen(false)}
        availableWidgets={widgetCatalog}
        visibleWidgetIds={visibleWidgetIds}
        onVisibilityChange={onVisibilityChange}
        onLayoutReset={onLayoutReset}
        onWidgetDragStart={setDraggingSidebarWidgetId}
        onWidgetDragEnd={() => setDraggingSidebarWidgetId(null)}
        isDraggingWidget={!!draggingSidebarWidgetId}
      />

      {/* ── Floating wave settings panel ───────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {waveSettingsOpen && (
            <motion.div
              key="wave-panel"
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="w-64 rounded-2xl border border-white/10 bg-black/70 backdrop-blur-xl p-4 shadow-2xl"
            >
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#b7a57a]/70">Wave Settings</p>

              {[
                { label: 'Density',   key: 'density',   min: 10, max: 60, step: 1,    format: (v: number) => `${v}×${v}` },
                { label: 'Speed',     key: 'speed',     min: 0.01, max: 0.25, step: 0.01, format: (v: number) => v.toFixed(2) },
                { label: 'Amplitude', key: 'amplitude', min: 10, max: 120, step: 1,   format: (v: number) => String(v) },
                { label: 'Spacing',   key: 'separation',min: 50, max: 180, step: 5,   format: (v: number) => String(v) },
              ].map(({ label, key, min, max, step, format }) => (
                <div key={key} className="mb-3">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-xs text-white/50">{label}</span>
                    <span className="text-xs text-white/30">{format((waveConfig as any)[key])}</span>
                  </div>
                  <input
                    type="range"
                    min={min} max={max} step={step}
                    value={(waveConfig as any)[key]}
                    onChange={e => setWaveConfig(c => ({ ...c, [key]: key === 'speed' ? parseFloat(e.target.value) : parseInt(e.target.value) }))}
                    className="w-full accent-[#b7a57a] cursor-pointer"
                  />
                </div>
              ))}

              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs text-white/50">Color</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {['#b7a57a','#7c5cbf','#4ecdc4','#ff6b6b','#ffffff'].map(c => (
                  <button
                    key={c}
                    onClick={() => setWaveConfig(cfg => ({ ...cfg, particleColor: c }))}
                    className={`w-6 h-6 rounded-full border-2 cursor-pointer transition-transform hover:scale-110 ${waveConfig.particleColor === c ? 'border-white' : 'border-white/20'}`}
                    style={{ background: c }}
                  />
                ))}
                <input
                  type="color"
                  value={waveConfig.particleColor}
                  onChange={e => setWaveConfig(c => ({ ...c, particleColor: e.target.value }))}
                  className="w-6 h-6 rounded-full border-2 border-white/20 cursor-pointer overflow-hidden bg-transparent"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setWaveSettingsOpen(o => !o)}
          className={`flex h-11 w-11 items-center justify-center rounded-full border shadow-lg backdrop-blur-md transition-all cursor-pointer ${
            waveSettingsOpen
              ? 'border-[#b7a57a]/60 bg-[#b7a57a]/20 text-[#b7a57a]'
              : 'border-white/10 bg-black/50 text-white/40 hover:text-white/70 hover:border-white/20'
          }`}
          title="Wave settings"
        >
          <Sparkles size={16} />
        </button>
      </div>

      {/* Grid layout CSS overrides */}
      <style>{`
        .recharts-tooltip-cursor {
          fill: rgba(124, 92, 191, 0.12) !important;
          stroke: rgba(124, 92, 191, 0.45) !important;
        }
        .recharts-rectangle.recharts-tooltip-cursor {
          fill: rgba(124, 92, 191, 0.12) !important;
          stroke: rgba(124, 92, 191, 0.45) !important;
        }
        .recharts-crosshair path,
        .recharts-crosshair line {
          stroke: rgba(124, 92, 191, 0.45) !important;
        }
        .react-grid-placeholder {
          background: rgba(75, 46, 131, 0.25) !important;
          border: 1px dashed rgba(75, 46, 131, 0.5) !important;
          border-radius: 12px !important;
          opacity: 1 !important;
        }
        .react-grid-item.react-grid-placeholder {
          z-index: 2;
        }
        /* Allow handles to render outside the item box */
        .react-grid-item {
          overflow: visible !important;
        }
        /* Base handle — invisible by default */
        .react-resizable-handle {
          background-image: none !important;
          background: transparent !important;
          z-index: 40 !important;
          opacity: 0;
          transition: opacity 0.15s;
        }
        /* Reveal on hover of the grid item */
        .react-grid-item:hover .react-resizable-handle {
          opacity: 1;
        }
        /* All corners: small gold L-bracket */
        .react-resizable-handle::after {
          content: '' !important;
          position: absolute !important;
          width: 10px !important;
          height: 10px !important;
          background: transparent !important;
          border: none !important;
        }
        /* SE corner */
        .react-resizable-handle-se {
          width: 18px !important; height: 18px !important;
          bottom: 4px !important; right: 4px !important;
          cursor: se-resize !important;
        }
        .react-resizable-handle-se::after {
          border-right: 2px solid rgba(183,165,122,0.9) !important;
          border-bottom: 2px solid rgba(183,165,122,0.9) !important;
          right: 2px !important; bottom: 2px !important;
        }
        /* SW corner */
        .react-resizable-handle-sw {
          width: 18px !important; height: 18px !important;
          bottom: 4px !important; left: 4px !important;
          cursor: sw-resize !important;
        }
        .react-resizable-handle-sw::after {
          border-left: 2px solid rgba(183,165,122,0.9) !important;
          border-bottom: 2px solid rgba(183,165,122,0.9) !important;
          left: 2px !important; bottom: 2px !important;
        }
        /* NE corner */
        .react-resizable-handle-ne {
          width: 18px !important; height: 18px !important;
          top: 4px !important; right: 4px !important;
          cursor: ne-resize !important;
        }
        .react-resizable-handle-ne::after {
          border-right: 2px solid rgba(183,165,122,0.9) !important;
          border-top: 2px solid rgba(183,165,122,0.9) !important;
          right: 2px !important; top: 2px !important;
        }
        /* NW corner */
        .react-resizable-handle-nw {
          width: 18px !important; height: 18px !important;
          top: 4px !important; left: 4px !important;
          cursor: nw-resize !important;
        }
        .react-resizable-handle-nw::after {
          border-left: 2px solid rgba(183,165,122,0.9) !important;
          border-top: 2px solid rgba(183,165,122,0.9) !important;
          left: 2px !important; top: 2px !important;
        }
        /* S edge */
        .react-resizable-handle-s {
          position: absolute !important;
          height: 10px !important;
          left: 15% !important;
          width: 70% !important;
          bottom: 0px !important;
          cursor: s-resize !important;
          z-index: 40 !important;
        }
        .react-resizable-handle-s::after {
          content: '' !important;
          position: absolute !important;
          left: 20% !important; right: 20% !important;
          bottom: 3px !important;
          height: 3px !important;
          background: rgba(183,165,122,0.7) !important;
          border-radius: 2px !important;
          border: none !important;
        }
        /* N edge */
        .react-resizable-handle-n {
          position: absolute !important;
          height: 10px !important;
          left: 15% !important;
          width: 70% !important;
          top: 0px !important;
          cursor: n-resize !important;
          z-index: 40 !important;
        }
        .react-resizable-handle-n::after {
          content: '' !important;
          position: absolute !important;
          left: 20% !important; right: 20% !important;
          top: 3px !important;
          height: 3px !important;
          background: rgba(183,165,122,0.7) !important;
          border-radius: 2px !important;
          border: none !important;
        }
        /* E edge */
        .react-resizable-handle-e {
          position: absolute !important;
          width: 10px !important;
          top: 15% !important;
          height: 70% !important;
          right: 0px !important;
          cursor: e-resize !important;
          z-index: 40 !important;
        }
        .react-resizable-handle-e::after {
          content: '' !important;
          position: absolute !important;
          top: 20% !important; bottom: 20% !important;
          right: 3px !important;
          width: 3px !important;
          background: rgba(183,165,122,0.7) !important;
          border-radius: 2px !important;
          border: none !important;
        }
        /* W edge */
        .react-resizable-handle-w {
          position: absolute !important;
          width: 10px !important;
          top: 15% !important;
          height: 70% !important;
          left: 0px !important;
          cursor: w-resize !important;
          z-index: 40 !important;
        }
        .react-resizable-handle-w::after {
          content: '' !important;
          position: absolute !important;
          top: 20% !important; bottom: 20% !important;
          left: 3px !important;
          width: 3px !important;
          background: rgba(183,165,122,0.7) !important;
          border-radius: 2px !important;
          border: none !important;
        }
      `}</style>

      <div
        ref={gridContainerRef}
        onDragOver={(e) => {
          const hasPayloadType =
            e.dataTransfer.types.includes("application/x-dashboard-widget") ||
            e.dataTransfer.types.includes("text/plain") ||
            !!draggingSidebarWidgetId
          if (!hasPayloadType) return
          e.preventDefault()
          e.dataTransfer.dropEffect = "copy"
        }}
        onDrop={(e) => handleExternalWidgetDrop(e)}
      >
      <GridLayout
        width={gridContainerWidth}
        layout={withRelaxedConstraints(gridLayout.filter(l => visibleWidgetIds.includes(l.i)))}
        cols={12}
        rowHeight={60}
        margin={[8, 8]}
        containerPadding={[0, 0]}
        compactType={null}
        allowOverlap
        onLayoutChange={handleLayoutChange}
        isDroppable
        droppingItem={{ i: "__dropping__", w: 4, h: 4 }}
        onDrop={(layout, droppedItem, e) => {
          handleExternalWidgetDrop(e as React.DragEvent<HTMLDivElement>, {
            x: droppedItem?.x ?? 0,
            y: droppedItem?.y ?? 0,
            w: droppedItem?.w ?? 4,
            h: droppedItem?.h ?? 4,
          })
        }}
        onDropDragOver={(e) => {
          const hasPayloadType =
            !!e.dataTransfer?.types?.includes("application/x-dashboard-widget") ||
            !!e.dataTransfer?.types?.includes("text/plain") ||
            !!draggingSidebarWidgetId
          if (!hasPayloadType) return false
          return { w: 4, h: 4 }
        }}
        onDragStart={(_, item) => {
          setDraggedWidgetId(item.i)
          setIsOverTrashZone(false)
        }}
        onDrag={(_, item, __, ___, e) => {
          if (!item?.i) return
          setIsOverTrashZone(isPointerInsideTrash(e))
        }}
        onDragStop={(_, item, __, ___, e) => {
          const droppedInTrash = isPointerInsideTrash(e)
          if (droppedInTrash) removeWidget(item.i)
          setDraggedWidgetId(null)
          setIsOverTrashZone(false)
        }}
        isDraggable
        isResizable
        draggableHandle=".drag-handle"
        resizeHandles={['se', 'sw', 'ne', 'nw', 's', 'n', 'e', 'w']}
        useCSSTransforms
      >
        {visibleWidgetIds.map(id => {
          const layoutForWidget = gridLayout.find((item) => item.i === id)
          const widget = renderWidget(id, layoutForWidget)
          if (!widget) return null
          return (
            <div key={id} className="group relative h-full">
              {/* Drag handle */}
              <div className="drag-handle absolute top-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/8 text-white/20 hover:text-white/50 hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing select-none">
                <GripHorizontal size={12} />
                <span className="text-[10px] font-mono">drag</span>
              </div>
              {widget}
            </div>
          )
        })}
      </GridLayout>
      </div>

      {draggedWidgetId && (
        <div className="fixed inset-x-0 bottom-5 z-[70] flex justify-center pointer-events-none">
          <div
            ref={trashZoneRef}
            className={`pointer-events-auto flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] transition-all ${
              isOverTrashZone
                ? "border-red-400/70 bg-red-500/20 text-red-100 scale-105"
                : "border-white/20 bg-black/70 text-white/65"
            }`}
          >
            <Trash2 size={14} />
            Drop Here to Delete Widget
          </div>
        </div>
      )}

      <motion.section
        className="h-full flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-4 shadow-sm md:p-5"
        whileHover={{ y: -2, scale: 1.003 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center gap-2 text-[#4b2e83]">
          <Sparkles size={16} />
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#d8c8ff]">AI Insight</p>
        </div>
        <p className="mt-2 text-sm text-white/75">
          Your most resilient widget combination this week is <span className="font-semibold">Metrics + Engagement + Upcoming</span>.
          Keep this stack pinned if you need fast operational decisions.
        </p>
      </motion.section>

      <Dialog open={isEngagementDialogOpen} onOpenChange={setIsEngagementDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Engagement Index Breakdown</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500">
            Composite score from saves, shares, and comments across your active events.
          </p>
          <div className="mt-3 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="saves" stroke="#4b2e83" strokeWidth={2} isAnimationActive={true} animationDuration={1200} animationEasing="ease-out" />
                <Line type="monotone" dataKey="shares" stroke="#7b699f" strokeWidth={2} isAnimationActive={true} animationDuration={1200} animationEasing="ease-out" />
                <Line type="monotone" dataKey="comments" stroke="#b7a57a" strokeWidth={2} isAnimationActive={true} animationDuration={1200} animationEasing="ease-out" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
