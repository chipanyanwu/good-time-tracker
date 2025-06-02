// Activity Tracker page
export const activities = [
  {
    id: 1,
    title: "Morning Meditation",
    date: "June 1, 2025",
    content:
      "Started the day with a 20-minute meditation session. Focused on breathing techniques and mindfulness. Felt very centered and ready to tackle the day ahead.",
    engagementLevel: 100,
    energyLevel: 75,
  },
  {
    id: 2,
    title: "Project Planning",
    date: "June 1, 2025",
    content:
      "Spent 2 hours planning the new marketing campaign. Outlined key objectives, target audience, and content strategy. Team seemed engaged but we hit some roadblocks with budget constraints.",
    engagementLevel: 85,
    energyLevel: -20,
  },
  {
    id: 3,
    title: "Team Meeting",
    date: "May 31, 2025",
    content:
      "Led the weekly team meeting. Discussed project progress, addressed concerns about the timeline, and assigned new tasks. Everyone participated actively.",
    engagementLevel: 90,
    energyLevel: 50,
  },
  {
    id: 4,
    title: "Client Presentation",
    date: "May 31, 2025",
    content:
      "Presented the quarterly results to our main client. They were impressed with our performance but had some concerns about the new strategy. Need to follow up with more detailed analytics.",
    engagementLevel: 95,
    energyLevel: -50,
  },
  {
    id: 5,
    title: "Learning Session",
    date: "May 30, 2025",
    content:
      "Attended a workshop on advanced data visualization techniques. Learned several new approaches that could be applied to our current projects. The instructor was very knowledgeable.",
    engagementLevel: 75,
    energyLevel: 30,
  },
]

// Reflections page
const reflections = [
  {
    id: 101,
    title: "Weekly Review",
    startDate: "May 26, 2025",
    endDate: "June 1, 2025",
    content:
      "This week was particularly productive. I managed to complete three major projects and felt a strong sense of accomplishment. The team collaboration was excellent, and we overcame several technical challenges together. Looking forward, I want to focus more on work-life balance.",
  },
  {
    id: 102,
    title: "Monthly Goals Assessment",
    startDate: "May 1, 2025",
    endDate: "May 31, 2025",
    content:
      "Reflecting on May's goals, I achieved about 80% of what I set out to do. The marketing campaign launch was successful, but I fell short on the personal development goals I had set. Need to be more realistic about time allocation and prioritize better.",
  },
  {
    id: 103,
    title: "Project Retrospective",
    startDate: "April 15, 2025",
    endDate: "May 15, 2025",
    content:
      "The client project that spanned a month taught me valuable lessons about communication and expectation management. While we delivered on time, there were several moments where clearer communication could have prevented confusion. The technical implementation went smoothly.",
  },
  {
    id: 104,
    title: "Learning Journey",
    startDate: "April 1, 2025",
    endDate: "April 30, 2025",
    content:
      "Dedicated April to learning new technologies and frameworks. Completed three online courses and built two practice projects. The investment in learning is already paying off in my current work. Planning to continue this momentum into the next month.",
  },
  {
    id: 105,
    title: "Quarterly Reflection",
    startDate: "January 1, 2025",
    endDate: "March 31, 2025",
    content:
      "The first quarter of 2025 was transformative. Started new role, moved to a new city, and established new routines. While challenging, the growth has been immense. Key learnings include the importance of adaptability and maintaining connections during transitions.",
  },
]

// Entries Page
export const entriesData = [
  // Activities
  {
    id: 1,
    type: "activity",
    title: "Morning Meditation",
    date: "2025-06-01",
    content:
      "Started the day with a 20-minute meditation session. Focused on breathing techniques and mindfulness. Felt very centered and ready to tackle the day ahead.",
    engagementLevel: 100,
    energyLevel: 75,
  },
  {
    id: 2,
    type: "activity",
    title: "Project Planning",
    date: "2025-06-01",
    content:
      "Spent 2 hours planning the new marketing campaign. Outlined key objectives, target audience, and content strategy. Team seemed engaged but we hit some roadblocks with budget constraints.",
    engagementLevel: 85,
    energyLevel: -20,
  },
  // Reflections
  {
    id: 101,
    type: "reflection",
    title: "Weekly Review",
    startDate: "2025-05-26",
    endDate: "2025-06-01",
    content:
      "This week was particularly productive. I managed to complete three major projects and felt a strong sense of accomplishment. The team collaboration was excellent, and we overcame several technical challenges together. Looking forward, I want to focus more on work-life balance.",
  },
  {
    id: 102,
    type: "reflection",
    title: "Monthly Goals Assessment",
    startDate: "2025-05-01",
    endDate: "2025-05-31",
    content:
      "Reflecting on May's goals, I achieved about 80% of what I set out to do. The marketing campaign launch was successful, but I fell short on the personal development goals I had set. Need to be more realistic about time allocation and prioritize better.",
  },
]

// Insights
// Sample data for Energy and Engagement Over Time (last 30 days)
const energyEngagementData = [
  { date: "2025-05-02", energy: 75, engagement: 85 },
  { date: "2025-05-03", energy: 60, engagement: 70 },
  { date: "2025-05-04", energy: 80, engagement: 90 },
  { date: "2025-05-05", energy: 45, engagement: 60 },
  { date: "2025-05-06", energy: 70, engagement: 80 },
  { date: "2025-05-07", energy: 85, engagement: 95 },
  { date: "2025-05-08", energy: 90, engagement: 85 },
  { date: "2025-05-09", energy: 55, engagement: 65 },
  { date: "2025-05-10", energy: 75, engagement: 80 },
  { date: "2025-05-11", energy: 65, engagement: 75 },
  { date: "2025-05-12", energy: 80, engagement: 90 },
  { date: "2025-05-13", energy: 70, engagement: 85 },
  { date: "2025-05-14", energy: 85, engagement: 80 },
  { date: "2025-05-15", energy: 60, engagement: 70 },
  { date: "2025-05-16", energy: 75, engagement: 85 },
  { date: "2025-05-17", energy: 80, engagement: 90 },
  { date: "2025-05-18", energy: 70, engagement: 75 },
  { date: "2025-05-19", energy: 85, engagement: 95 },
  { date: "2025-05-20", energy: 65, engagement: 70 },
  { date: "2025-05-21", energy: 75, engagement: 80 },
  { date: "2025-05-22", energy: 80, engagement: 85 },
  { date: "2025-05-23", energy: 70, engagement: 75 },
  { date: "2025-05-24", energy: 85, engagement: 90 },
  { date: "2025-05-25", energy: 60, engagement: 65 },
  { date: "2025-05-26", energy: 75, engagement: 80 },
  { date: "2025-05-27", energy: 80, engagement: 85 },
  { date: "2025-05-28", energy: 70, engagement: 75 },
  { date: "2025-05-29", energy: 85, engagement: 90 },
  { date: "2025-05-30", energy: 75, engagement: 80 },
  { date: "2025-06-01", energy: 80, engagement: 85 },
]

// Sample data for Weekly Engagement Trend
const weeklyEngagementData = [
  { week: "Week 1", engagement: 78 },
  { week: "Week 2", engagement: 82 },
  { week: "Week 3", engagement: 75 },
  { week: "Week 4", engagement: 85 },
  { week: "Week 5", engagement: 80 },
  { week: "Week 6", engagement: 88 },
  { week: "Week 7", engagement: 83 },
  { week: "Week 8", engagement: 90 },
]

// Sample data for Weekly Energy Trend
const weeklyEnergyData = [
  { week: "Week 1", energy: 72 },
  { week: "Week 2", energy: 78 },
  { week: "Week 3", energy: 69 },
  { week: "Week 4", energy: 81 },
  { week: "Week 5", energy: 76 },
  { week: "Week 6", energy: 84 },
  { week: "Week 7", energy: 79 },
  { week: "Week 8", energy: 86 },
]

// Sample data for Current Week's Radial Charts
const currentWeekEnergy = [{ name: "Energy", value: 76, fill: "#3b82f6" }]
const currentWeekEngagement = [
  { name: "Engagement", value: 84, fill: "#10b981" },
]
