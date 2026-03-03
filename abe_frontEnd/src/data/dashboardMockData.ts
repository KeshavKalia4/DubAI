// ── Registration & Pre-Event ─────────────────────────────────────────────────

export const registrationFunnelData = [
  { name: "Event Page Views", value: 1840, fill: "#4b2e83" },
  { name: "RSVP Started", value: 1124, fill: "#5c3a9e" },
  { name: "RSVP Completed", value: 842, fill: "#7c5cbf" },
  { name: "Reminder Set", value: 634, fill: "#9e7baa" },
  { name: "Attended", value: 758, fill: "#b7a57a" },
]

export const registrationVelocityData = [
  { day: "D1", cumulative: 12, daily: 12 },
  { day: "D2", cumulative: 28, daily: 16 },
  { day: "D3", cumulative: 67, daily: 39 },
  { day: "D4", cumulative: 124, daily: 57 },
  { day: "D5", cumulative: 198, daily: 74 },
  { day: "D6", cumulative: 287, daily: 89 },
  { day: "D7", cumulative: 412, daily: 125 },
  { day: "D8", cumulative: 534, daily: 122 },
  { day: "D9", cumulative: 623, daily: 89 },
  { day: "D10", cumulative: 698, daily: 75 },
  { day: "D11", cumulative: 754, daily: 56 },
  { day: "D12", cumulative: 789, daily: 35 },
  { day: "D13", cumulative: 812, daily: 23 },
  { day: "D14", cumulative: 842, daily: 30 },
]

export const waitlistData = [
  { event: "Founder Sprint", waitlist: 45, converted: 38, dropped: 7 },
  { event: "Career Lab", waitlist: 12, converted: 9, dropped: 3 },
  { event: "Research Social", waitlist: 67, converted: 51, dropped: 16 },
  { event: "Community Mixer", waitlist: 23, converted: 18, dropped: 5 },
]

export const registrationSourceData = [
  { source: "madr Feed", value: 412, color: "#4b2e83" },
  { source: "Instagram", value: 198, color: "#7c5cbf" },
  { source: "Word of Mouth", value: 156, color: "#b7a57a" },
  { source: "Email", value: 134, color: "#8f7b58" },
  { source: "UW Website", value: 89, color: "#5a4f8a" },
  { source: "Other", value: 43, color: "#3d3060" },
]

export const rsvpConversionByEvent = [
  { event: "Founder Sprint", rsvps: 142, attended: 128 },
  { event: "Career Lab", rsvps: 89, attended: 82 },
  { event: "Research Social", rsvps: 210, attended: 195 },
  { event: "Community Mixer", rsvps: 164, attended: 151 },
]

// ── Live Event ────────────────────────────────────────────────────────────────

export const peakArrivalData = [
  { time: "5:30", arrivals: 4 },
  { time: "5:45", arrivals: 12 },
  { time: "6:00", arrivals: 34 },
  { time: "6:15", arrivals: 67 },
  { time: "6:30", arrivals: 89 },
  { time: "6:45", arrivals: 112 },
  { time: "7:00", arrivals: 145 },
  { time: "7:15", arrivals: 98 },
  { time: "7:30", arrivals: 56 },
  { time: "7:45", arrivals: 34 },
  { time: "8:00", arrivals: 18 },
  { time: "8:15", arrivals: 9 },
]

export const capacityData = [
  { event: "Founder Sprint", capacity: 150, attended: 128 },
  { event: "Career Lab", capacity: 100, attended: 89 },
  { event: "Research Social", capacity: 200, attended: 195 },
  { event: "Community Mixer", capacity: 175, attended: 151 },
]

// ── Post-Event ────────────────────────────────────────────────────────────────

export const firstTimeRepeatData = [
  { event: "Founder Sprint", firstTime: 45, returning: 83 },
  { event: "Career Lab", firstTime: 31, returning: 51 },
  { event: "Research Social", firstTime: 89, returning: 106 },
  { event: "Community Mixer", firstTime: 67, returning: 84 },
]

export const attendanceByMajorData = [
  { major: "CS / Eng", spring: 412, fall: 389, winter: 356 },
  { major: "Business", spring: 298, fall: 312, winter: 278 },
  { major: "Sciences", spring: 187, fall: 201, winter: 176 },
  { major: "Arts & Hum", spring: 134, fall: 145, winter: 123 },
  { major: "Social Sci", spring: 156, fall: 167, winter: 148 },
]

// ── Demographics ──────────────────────────────────────────────────────────────

export const majorTreemapData = [
  {
    name: "Engineering & CS",
    children: [
      { name: "Computer Science", size: 312, fill: "#4b2e83" },
      { name: "Electrical Eng", size: 134, fill: "#5a3a9e" },
      { name: "Info Systems", size: 145, fill: "#6b4aaf" },
      { name: "Mech Eng", size: 89, fill: "#7c5cbf" },
    ],
  },
  {
    name: "Business",
    children: [
      { name: "Business Admin", size: 198, fill: "#b7a57a" },
      { name: "Economics", size: 78, fill: "#c4b28e" },
      { name: "Accounting", size: 56, fill: "#8f7b58" },
    ],
  },
  {
    name: "Other",
    children: [
      { name: "Psychology", size: 89, fill: "#9e7baa" },
      { name: "Communications", size: 67, fill: "#6b5499" },
      { name: "Pre-Med", size: 56, fill: "#3d3060" },
      { name: "Other", size: 136, fill: "#2a2050" },
    ],
  },
]

export const collegeAffiliationData = [
  { college: "Paul G. Allen (CS/EE)", students: 479 },
  { college: "Foster (Business)", students: 332 },
  { college: "Arts & Sciences", students: 289 },
  { college: "Engineering", students: 223 },
  { college: "Information School", students: 145 },
  { college: "Education", students: 67 },
  { college: "Public Health", students: 45 },
]

// ── Audience Segmentation ─────────────────────────────────────────────────────

export const newVsReturningData = [
  { month: "Sep", new: 87, returning: 124 },
  { month: "Oct", new: 134, returning: 145 },
  { month: "Nov", new: 112, returning: 167 },
  { month: "Dec", new: 56, returning: 89 },
  { month: "Jan", new: 145, returning: 178 },
  { month: "Feb", new: 167, returning: 201 },
]

export const engagementTierData = [
  { tier: "Core  (5+ events)", count: 87, fill: "#4b2e83" },
  { tier: "Active (3–4 events)", count: 156, fill: "#7c5cbf" },
  { tier: "Casual (1–2 events)", count: 245, fill: "#b7a57a" },
  { tier: "Lapsed (0 recently)", count: 134, fill: "#3d3060" },
]

// ── Behavioral ────────────────────────────────────────────────────────────────

export const eventTypePrefsData = [
  { category: "Tech/Career", preference: 78, avg: 62 },
  { category: "Social", preference: 62, avg: 71 },
  { category: "Academic", preference: 71, avg: 68 },
  { category: "Community", preference: 55, avg: 58 },
  { category: "Arts/Culture", preference: 44, avg: 52 },
  { category: "Sports/Rec", preference: 38, avg: 45 },
]

export const preferredTimesData = [
  { slot: "Mon Eve", activity: 112 },
  { slot: "Tue Eve", activity: 134 },
  { slot: "Wed PM", activity: 98 },
  { slot: "Wed Eve", activity: 156 },
  { slot: "Thu PM", activity: 112 },
  { slot: "Thu Eve", activity: 178 },
  { slot: "Fri PM", activity: 145 },
  { slot: "Fri Eve", activity: 89 },
  { slot: "Sat AM", activity: 67 },
  { slot: "Sat PM", activity: 198 },
]

// ── Member Retention ──────────────────────────────────────────────────────────

export const cohortRetentionData = [
  { period: "M+0", sep: 100, oct: 100, nov: 100, jan: 100, feb: 100 },
  { period: "M+1", sep: 78, oct: 82, nov: 79, jan: 85, feb: 87 },
  { period: "M+2", sep: 67, oct: 71, nov: 68, jan: 73, feb: null },
  { period: "M+3", sep: 58, oct: 62, nov: 59, jan: null, feb: null },
  { period: "M+4", sep: 52, oct: 55, nov: null, jan: null, feb: null },
  { period: "M+5", sep: 48, oct: null, nov: null, jan: null, feb: null },
]

export const memberGrowthData = [
  { month: "Sep", total: 234, new: 87, churned: 12 },
  { month: "Oct", total: 301, new: 89, churned: 22 },
  { month: "Nov", total: 356, new: 78, churned: 23 },
  { month: "Dec", total: 367, new: 34, churned: 23 },
  { month: "Jan", total: 445, new: 98, churned: 20 },
  { month: "Feb", total: 512, new: 89, churned: 22 },
]

export const churnReasonData = [
  { reason: "Graduated / Transferred", value: 38, fill: "#4b2e83" },
  { reason: "Schedule Conflicts", value: 29, fill: "#7c5cbf" },
  { reason: "Lost Interest", value: 18, fill: "#b7a57a" },
  { reason: "Joined Another Org", value: 10, fill: "#8f7b58" },
  { reason: "Unknown", value: 5, fill: "#3d3060" },
]

// ── Community Health ──────────────────────────────────────────────────────────

export const activeMemberRatioData = [
  { name: "Active", value: 72, fill: "#4b2e83" },
  { name: "At Risk", value: 18, fill: "#b7a57a" },
  { name: "Inactive", value: 10, fill: "#2a2050" },
]

export const memberAcquisitionData = [
  { month: "Sep", acquired: 87, rate: 3.2 },
  { month: "Oct", acquired: 89, rate: 3.8 },
  { month: "Nov", acquired: 78, rate: 3.3 },
  { month: "Dec", acquired: 34, rate: 1.4 },
  { month: "Jan", acquired: 98, rate: 4.1 },
  { month: "Feb", acquired: 89, rate: 3.7 },
]

// ── Event Success ─────────────────────────────────────────────────────────────

export const eventRatingsData = [
  { rating: "5★", count: 234 },
  { rating: "4★", count: 312 },
  { rating: "3★", count: 156 },
  { rating: "2★", count: 45 },
  { rating: "1★", count: 12 },
]

export const satisfactionTrendData = [
  { month: "Sep", score: 4.1, nps: 42 },
  { month: "Oct", score: 4.2, nps: 47 },
  { month: "Nov", score: 4.3, nps: 51 },
  { month: "Dec", score: 4.0, nps: 44 },
  { month: "Jan", score: 4.4, nps: 56 },
  { month: "Feb", score: 4.5, nps: 58 },
]

export const eventROIData = [
  { event: "Founder Sprint", cost: 450, value: 1890 },
  { event: "Career Lab", cost: 280, value: 1120 },
  { event: "Research Social", cost: 620, value: 2450 },
  { event: "Community Mixer", cost: 380, value: 1540 },
]

export const npsZonesData = [
  { name: "Promoters", value: 58, fill: "#4b2e83" },
  { name: "Passives", value: 28, fill: "#b7a57a" },
  { name: "Detractors", value: 14, fill: "#2a2050" },
]

// ── Marketing & Channels ──────────────────────────────────────────────────────

export const channelData = [
  { channel: "madr App", registrations: 412, conversion: 78 },
  { channel: "Instagram", registrations: 198, conversion: 62 },
  { channel: "Word of Mouth", registrations: 156, conversion: 71 },
  { channel: "Email List", registrations: 134, conversion: 69 },
  { channel: "UW Website", registrations: 89, conversion: 55 },
  { channel: "Flyers", registrations: 43, conversion: 48 },
]

export const emailMetricsData = [
  { campaign: "Save the Date", sent: 1240, opened: 856, clicked: 412 },
  { campaign: "1 Week Out", sent: 1240, opened: 934, clicked: 567 },
  { campaign: "3 Day Reminder", sent: 1124, opened: 978, clicked: 689 },
  { campaign: "Day Before", sent: 1124, opened: 1045, clicked: 756 },
  { campaign: "Morning Of", sent: 987, opened: 912, clicked: 634 },
]

export const contentPerformanceData = [
  { type: "Event w/ Image", views: 2340, clicks: 812, conversion: 34.7 },
  { type: "Event w/ Video", views: 1890, clicks: 734, conversion: 38.8 },
  { type: "Event Text Only", views: 1120, clicks: 312, conversion: 27.9 },
  { type: "Club Announcement", views: 890, clicks: 201, conversion: 22.6 },
]

// ── Growth & Trends ───────────────────────────────────────────────────────────

export const yoyGrowthData = [
  { month: "Sep", y2024: 156, y2025: 234 },
  { month: "Oct", y2024: 189, y2025: 301 },
  { month: "Nov", y2024: 212, y2025: 356 },
  { month: "Dec", y2024: 198, y2025: 367 },
  { month: "Jan", y2024: 223, y2025: 445 },
  { month: "Feb", y2024: 245, y2025: 512 },
]

export const forecastData = [
  { month: "Sep", actual: 234, forecast: 234, upper: null, lower: null },
  { month: "Oct", actual: 301, forecast: 301, upper: null, lower: null },
  { month: "Nov", actual: 356, forecast: 356, upper: null, lower: null },
  { month: "Dec", actual: 367, forecast: 367, upper: null, lower: null },
  { month: "Jan", actual: 445, forecast: 445, upper: null, lower: null },
  { month: "Feb", actual: 512, forecast: 512, upper: 540, lower: 485 },
  { month: "Mar", actual: null, forecast: 567, upper: 615, lower: 519 },
  { month: "Apr", actual: null, forecast: 598, upper: 665, lower: 531 },
  { month: "May", actual: null, forecast: 623, upper: 712, lower: 534 },
]

// ── Member Journey ────────────────────────────────────────────────────────────

export const acquisitionFunnelData = [
  { name: "Awareness", value: 4200, fill: "#4b2e83" },
  { name: "Interest", value: 2800, fill: "#5c3a9e" },
  { name: "First Event", value: 1240, fill: "#7c5cbf" },
  { name: "Second Event", value: 756, fill: "#9e7baa" },
  { name: "Active Member", value: 512, fill: "#b7a57a" },
  { name: "Core Member", value: 87, fill: "#8f7b58" },
]

export const onboardingStepsData = [
  { step: "Profile Created", completed: 512, fill: "#4b2e83" },
  { step: "Interests Set", completed: 489, fill: "#5c3a9e" },
  { step: "First Event Saved", completed: 412, fill: "#7c5cbf" },
  { step: "First RSVP", completed: 356, fill: "#9e7baa" },
  { step: "First Attended", completed: 289, fill: "#b7a57a" },
  { step: "Second Attended", completed: 201, fill: "#8f7b58" },
]

// ── Timing Insights ───────────────────────────────────────────────────────────

export const bestDaysData = [
  { day: "Mon", attendance: 156, events: 4 },
  { day: "Tue", attendance: 198, events: 5 },
  { day: "Wed", attendance: 234, events: 6 },
  { day: "Thu", attendance: 267, events: 7 },
  { day: "Fri", attendance: 201, events: 5 },
  { day: "Sat", attendance: 312, events: 3 },
  { day: "Sun", attendance: 145, events: 2 },
]

export const bestHoursData = [
  { hour: "10am", attendance: 67 },
  { hour: "11am", attendance: 89 },
  { hour: "12pm", attendance: 134 },
  { hour: "1pm", attendance: 112 },
  { hour: "2pm", attendance: 98 },
  { hour: "3pm", attendance: 145 },
  { hour: "4pm", attendance: 189 },
  { hour: "5pm", attendance: 223 },
  { hour: "6pm", attendance: 267 },
  { hour: "7pm", attendance: 245 },
  { hour: "8pm", attendance: 178 },
  { hour: "9pm", attendance: 112 },
]

// ── Operational Analytics ─────────────────────────────────────────────────────

export const venueUtilizationData = [
  { venue: "Innovation Studio", avg: 87, peak: 98, capacity: 100 },
  { venue: "HUB 250", avg: 74, peak: 91, capacity: 100 },
  { venue: "Kane Hall 130", avg: 92, peak: 100, capacity: 100 },
  { venue: "CSE Atrium", avg: 68, peak: 84, capacity: 100 },
  { venue: "Odegaard 220", avg: 81, peak: 95, capacity: 100 },
]

export const checkInTimeData = [
  { interval: "0–5 min", count: 89 },
  { interval: "5–10 min", count: 145 },
  { interval: "10–15 min", count: 178 },
  { interval: "15–20 min", count: 134 },
  { interval: "20–30 min", count: 67 },
  { interval: "30+ min", count: 23 },
]
