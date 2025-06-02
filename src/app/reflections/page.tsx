import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { ReflectionCard } from "@/components/reflection-card"

// Sample reflection data
const reflections = [
  {
    id: 1,
    title: "Weekly Review",
    startDate: "May 26, 2025",
    endDate: "June 1, 2025",
    content:
      "This week was particularly productive. I managed to complete three major projects and felt a strong sense of accomplishment. The team collaboration was excellent, and we overcame several technical challenges together. Looking forward, I want to focus more on work-life balance.",
  },
  {
    id: 2,
    title: "Monthly Goals Assessment",
    startDate: "May 1, 2025",
    endDate: "May 31, 2025",
    content:
      "Reflecting on May's goals, I achieved about 80% of what I set out to do. The marketing campaign launch was successful, but I fell short on the personal development goals I had set. Need to be more realistic about time allocation and prioritize better.",
  },
  {
    id: 3,
    title: "Project Retrospective",
    startDate: "April 15, 2025",
    endDate: "May 15, 2025",
    content:
      "The client project that spanned a month taught me valuable lessons about communication and expectation management. While we delivered on time, there were several moments where clearer communication could have prevented confusion. The technical implementation went smoothly.",
  },
  {
    id: 4,
    title: "Learning Journey",
    startDate: "April 1, 2025",
    endDate: "April 30, 2025",
    content:
      "Dedicated April to learning new technologies and frameworks. Completed three online courses and built two practice projects. The investment in learning is already paying off in my current work. Planning to continue this momentum into the next month.",
  },
  {
    id: 5,
    title: "Quarterly Reflection",
    startDate: "January 1, 2025",
    endDate: "March 31, 2025",
    content:
      "The first quarter of 2025 was transformative. Started new role, moved to a new city, and established new routines. While challenging, the growth has been immense. Key learnings include the importance of adaptability and maintaining connections during transitions.",
  },
]

export default function ReflectionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reflections</h1>
          <p className="text-muted-foreground">
            Capture and review your thoughts and insights over time
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          <span>New Entry</span>
        </Button>
      </div>

      <div className="grid gap-4">
        {reflections.map((reflection) => (
          <ReflectionCard
            key={reflection.id}
            title={reflection.title}
            startDate={reflection.startDate}
            endDate={reflection.endDate}
            content={reflection.content}
          />
        ))}
      </div>
    </div>
  )
}
