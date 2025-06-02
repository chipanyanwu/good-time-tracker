import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { ActivityCard } from "@/components/activity-card"

// Sample activity data
const activities = [
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

export default function ActivityTrackerPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Activity Tracker
          </h1>
          <p className="text-muted-foreground">
            Track and monitor your daily activities
          </p>
        </div>
        <Button size={"lg"} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          <span>New Entry</span>
        </Button>
      </div>

      <div className="grid gap-4">
        {activities.map((activity) => (
          <ActivityCard
            key={activity.id}
            title={activity.title}
            date={activity.date}
            content={activity.content}
            engagementLevel={activity.engagementLevel}
            energyLevel={activity.energyLevel}
          />
        ))}
      </div>
    </div>
  )
}
