"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"

interface ReflectionCardProps {
  id: number
  title: string
  startDate: string
  endDate: string
  content: string
}

export function ReflectionCard({
  id,
  title,
  startDate,
  endDate,
  content,
}: ReflectionCardProps) {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/entries/${id}`)
  }

  return (
    <Card
      className="w-full hover:shadow-md transition-all duration-200 hover:-translate-y-1 cursor-pointer"
      onClick={handleClick}
    >
      <CardContent className="px-4">
        <div className="mb-2">
          <h3 className="font-medium text-lg">{title}</h3>
          <p className="text-muted-foreground text-sm">
            {startDate} - {endDate}
          </p>
        </div>
        <p className="text-muted-foreground line-clamp-2">{content}</p>
      </CardContent>
    </Card>
  )
}
