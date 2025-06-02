"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { ArrowLeft, Save, Trash } from "lucide-react"

// Sample combined data for activities and reflections
const entriesData = [
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

export default function EntryDetailPage() {
  const params = useParams()
  const router = useRouter()
  const entryId = Number(params.entryId)

  const [entry, setEntry] = useState<any>(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [date, setDate] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [engagementLevel, setEngagementLevel] = useState([75])
  const [energyLevel, setEnergyLevel] = useState([0])
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    // In a real app, this would be an API call
    const foundEntry = entriesData.find((e) => e.id === entryId)
    if (foundEntry) {
      setEntry(foundEntry)
      setTitle(foundEntry.title)
      setContent(foundEntry.content)

      if (foundEntry.type === "activity") {
        setDate(foundEntry.date ?? "")
        setEngagementLevel([foundEntry.engagementLevel ?? 0])
        setEnergyLevel([foundEntry.energyLevel ?? 0])
      } else {
        setStartDate(foundEntry.startDate ?? "")
        setEndDate(foundEntry.endDate ?? "")
      }
    }
  }, [entryId])

  const handleSave = () => {
    // In a real app, this would be an API call to update the entry
    console.log("Saving updated entry:", {
      ...entry,
      title,
      content,
      ...(entry?.type === "activity"
        ? {
            date,
            engagementLevel: engagementLevel[0],
            energyLevel: energyLevel[0],
          }
        : { startDate, endDate }),
    })

    setIsEditing(false)
    // Redirect back after save in a real app
    // router.push(entry?.type === "activity" ? "/" : "/reflections")
  }

  const handleDelete = () => {
    // In a real app, this would be an API call to delete the entry
    console.log("Deleting entry:", entryId)

    // Redirect back after delete
    router.push(entry?.type === "activity" ? "/" : "/reflections")
  }

  const handleBack = () => {
    router.push(entry?.type === "activity" ? "/" : "/reflections")
  }

  if (!entry) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading entry...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEditing ? "Edit Entry" : entry.title}
          </h1>
          <p className="text-muted-foreground">
            {entry.type === "activity"
              ? `Activity on ${new Date(entry.date).toLocaleDateString()}`
              : `Reflection from ${new Date(
                  entry.startDate
                ).toLocaleDateString()} to ${new Date(
                  entry.endDate
                ).toLocaleDateString()}`}
          </p>
        </div>
      </div>

      <Card className="w-full py-0 gap-0">
        {isEditing ? (
          <CardContent className="p-6 space-y-6">
            {entry.type === "activity" ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-date">Date</Label>
                  <Input
                    id="edit-date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-content">Description</Label>
                  <Textarea
                    id="edit-content"
                    className="min-h-[150px]"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>

                {/* Engagement Level Slider */}
                <div className="space-y-3">
                  <Label htmlFor="edit-engagement">
                    Engagement Level: {engagementLevel[0]}%
                  </Label>
                  <Slider
                    id="edit-engagement"
                    min={0}
                    max={100}
                    step={5}
                    value={engagementLevel}
                    onValueChange={setEngagementLevel}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Not Engaged (0%)</span>
                    <span>Fully Engaged (100%)</span>
                  </div>
                </div>

                {/* Energy Level Slider */}
                <div className="space-y-3">
                  <Label htmlFor="edit-energy">
                    Energy Level: {energyLevel[0] > 0 ? "+" : ""}
                    {energyLevel[0]}%
                  </Label>
                  <Slider
                    id="edit-energy"
                    min={-100}
                    max={100}
                    step={5}
                    value={energyLevel}
                    onValueChange={setEnergyLevel}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Draining (-100%)</span>
                    <span>Neutral (0%)</span>
                    <span>Energizing (+100%)</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-start-date">Start Date</Label>
                    <Input
                      id="edit-start-date"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-end-date">End Date</Label>
                    <Input
                      id="edit-end-date"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-content">Content</Label>
                  <Textarea
                    id="edit-content"
                    className="min-h-[150px]"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="flex gap-3 pt-4">
              <Button onClick={handleSave} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        ) : (
          <>
            <CardContent className="px-6 py-4">
              <div className="prose max-w-none">
                <p className="whitespace-pre-line">{entry.content}</p>
              </div>

              {entry.type === "activity" && (
                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Engagement:</span>
                    <span className="text-sm">{entry.engagementLevel}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Energy:</span>
                    <span
                      className={`text-sm ${
                        entry.energyLevel >= 0
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {entry.energyLevel > 0 ? "+" : ""}
                      {entry.energyLevel}%
                    </span>
                  </div>
                </div>
              )}
            </CardContent>

            <div className="border-t p-6 flex justify-between">
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                Edit Entry
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                <Trash className="h-4 w-4 mr-2" />
                Delete Entry
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}
