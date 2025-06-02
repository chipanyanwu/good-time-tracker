import { Card, CardContent } from "@/components/ui/card"
import { Activity, Battery } from "lucide-react"
import { cn } from "@/lib/utils"

interface ActivityCardProps {
  title: string
  date: string
  content: string
  engagementLevel: number // 0-100
  energyLevel: number // -100 to 100
}

export function ActivityCard({
  title,
  date,
  content,
  engagementLevel,
  energyLevel,
}: ActivityCardProps) {
  // Format the engagement level as a percentage
  const engagementFormatted = `${engagementLevel}%`

  // Format the energy level as a percentage with + or - sign
  const energyFormatted = `${energyLevel > 0 ? "+" : ""}${energyLevel}%`

  // Determine energy level color based on value
  const energyColor = energyLevel >= 0 ? "text-green-500" : "text-red-500"

  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardContent className="px-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-medium text-lg">
              {title}{" "}
              <span className="text-muted-foreground text-sm font-normal">
                / {date}
              </span>
            </h3>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-1 text-sm border rounded-md px-2 py-1">
              <Activity className="h-4 w-4" />
              <span>{engagementFormatted}</span>
            </div>
            <div
              className={cn(
                "flex items-center gap-1 text-sm border rounded-md px-2 py-1",
                energyColor
              )}
            >
              <Battery className="h-4 w-4" />
              <span>{energyFormatted}</span>
            </div>
          </div>
        </div>
        <p className="text-muted-foreground line-clamp-2">{content}</p>
      </CardContent>
    </Card>
  )
}
