"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Save, X } from "lucide-react"
import { useRouter } from "next/navigation"

export default function TrackerPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("activity")
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [date, setDate] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [engagementLevel, setEngagementLevel] = useState([75])
  const [energyLevel, setEnergyLevel] = useState([0])

  const handleSave = () => {
    // TODO: Implement save functionality
    const entryData = {
      type: activeTab,
      title,
      content,
      ...(activeTab === "activity"
        ? {
            date,
            engagementLevel: engagementLevel[0],
            energyLevel: energyLevel[0],
          }
        : { startDate, endDate }),
    }

    console.log("Saving entry:", entryData)

    // For now, just redirect back to the appropriate page
    if (activeTab === "activity") {
      router.push("/")
    } else {
      router.push("/reflections")
    }
  }

  const handleCancel = () => {
    // Clear form and redirect back
    setTitle("")
    setContent("")
    setDate("")
    setStartDate("")
    setEndDate("")
    setEngagementLevel([75])
    setEnergyLevel([0])

    if (activeTab === "activity") {
      router.push("/")
    } else {
      router.push("/reflections")
    }
  }

  const isActivityFormValid =
    title.trim() !== "" && content.trim() !== "" && date !== ""
  const isReflectionFormValid =
    title.trim() !== "" &&
    content.trim() !== "" &&
    startDate !== "" &&
    endDate !== ""
  const isFormValid =
    activeTab === "activity" ? isActivityFormValid : isReflectionFormValid

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Entry</h1>
        <p className="text-muted-foreground">
          Create a new activity or reflection entry.
        </p>
      </div>

      <Card className="w-full">
        {/* <CardHeader>
          <CardTitle>Entry Details</CardTitle>
          <CardDescription>
            Fill in the details for your new entry.
          </CardDescription>
        </CardHeader> */}
        <CardContent className="space-y-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="reflection">Reflection</TabsTrigger>
            </TabsList>

            <TabsContent value="activity" className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="activity-title">Activity Title</Label>
                <Input
                  id="activity-title"
                  placeholder="Enter activity title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="activity-date">Date</Label>
                <Input
                  id="activity-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="activity-content">Activity Description</Label>
                <Textarea
                  id="activity-content"
                  placeholder="Describe your activity, what you did, how it went, and any observations..."
                  className="min-h-[120px]"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>

              {/* Engagement Level Slider */}
              <div className="space-y-3 pt-3">
                <Label htmlFor="engagement-level">
                  Engagement Level: {engagementLevel[0]}%
                </Label>
                <Slider
                  id="engagement-level"
                  min={0}
                  max={100}
                  step={5}
                  value={engagementLevel}
                  onValueChange={setEngagementLevel}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Not Engaged (0%)</span>
                  <span>Fully Engaged (100%)</span>
                </div>
              </div>

              {/* Energy Level Slider */}
              <div className="space-y-3">
                <Label htmlFor="energy-level">
                  Energy Level: {energyLevel[0] > 0 ? "+" : ""}
                  {energyLevel[0]}%
                </Label>
                <Slider
                  id="energy-level"
                  min={-100}
                  max={100}
                  step={5}
                  value={energyLevel}
                  onValueChange={setEnergyLevel}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Draining (-100%)</span>
                  <span>Neutral (0%)</span>
                  <span>Energizing (+100%)</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reflection" className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="reflection-title">Reflection Title</Label>
                <Input
                  id="reflection-title"
                  placeholder="Enter reflection title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reflection-start-date">Start Date</Label>
                  <Input
                    id="reflection-start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reflection-end-date">End Date</Label>
                  <Input
                    id="reflection-end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reflection-content">Reflection Content</Label>
                <Textarea
                  id="reflection-content"
                  placeholder="Share your thoughts, insights, lessons learned, and reflections on your experiences..."
                  className="min-h-[120px]"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSave}
              disabled={!isFormValid}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Entry
            </Button>
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
