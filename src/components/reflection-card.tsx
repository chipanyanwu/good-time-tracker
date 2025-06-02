import { Card, CardContent } from "@/components/ui/card"

interface ReflectionCardProps {
  title: string
  startDate: string
  endDate: string
  content: string
}

export function ReflectionCard({
  title,
  startDate,
  endDate,
  content,
}: ReflectionCardProps) {
  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardContent className="px-4">
        <div className="mb-2">
          <h3 className="font-medium text-lg">
            {title}{" "}
            <span className="text-muted-foreground text-sm font-normal">
              / {startDate} - {endDate}
            </span>
          </h3>
        </div>
        <p className="text-muted-foreground line-clamp-2">{content}</p>
      </CardContent>
    </Card>
  )
}
