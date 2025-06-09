"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Activity, Battery } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { Tag } from "@/types/entry"
import { Badge } from "@/components/ui/badge"

interface ActivityCardProps {
  id: string
  title: string
  date: string
  content: string
  engagementLevel: number // 0-100
  energyLevel: number // -100 to 100
  tags?: Tag[]
}

export function ActivityCard({
  id,
  title,
  date,
  content,
  engagementLevel,
  energyLevel,
  tags = [],
}: ActivityCardProps) {
  const router = useRouter()

  // Format the engagement level as a percentage
  const engagementFormatted = `${engagementLevel}%`

  // Format the energy level as a percentage with + or - sign
  const energyFormatted = `${energyLevel > 0 ? "+" : ""}${energyLevel}%`

  // Determine energy level color based on value
  const energyColor = energyLevel > 0 ? "text-green-500" : "text-red-500"

  const handleClick = () => {
    router.push(`/entries/${id}`)
  }

  return (
    <Card
      className="w-full hover:shadow-md transition-all duration-200 hover:-translate-y-1 cursor-pointer"
      onClick={handleClick}
    >
      <CardContent className="px-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
          <div>
            <h3 className="font-medium text-lg">{title}</h3>
            <p className="text-muted-foreground text-sm">{date}</p>
          </div>
          <div className="flex flex-row sm:flex-row gap-2 mt-2 sm:mt-0">
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
        {tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag.name} variant="outline">
                {tag.name}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
