"use client"

import { useState, useEffect, useCallback } from "react"
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
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "@/lib/firebase/firebaseConfig"
import { Spinner } from "@/components/ui/spinner"

import { TagInput } from "@/components/tag-input"
import {
  getUserTags,
  upsertUserTag,
  deleteUserTag,
} from "@/lib/firebase/tagService"

import { addActivity, addReflection } from "@/lib/firebase/db"
import { Activity, Reflection, Tag } from "@/types/entry"

export default function TrackerPage() {
  const [user, loading] = useAuthState(auth)
  const router = useRouter()

  if (!user) {
    router.push("/login")
  }

  const [activeTab, setActiveTab] = useState("activity")
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [date, setDate] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [engagementLevel, setEngagementLevel] = useState([75])
  const [energyLevel, setEnergyLevel] = useState([0])

  // tags
  const [tags, setTags] = useState<Tag[]>([])
  const [allTags, setAllTags] = useState<Tag[]>([])

  // load user's tag suggestions once
  useEffect(() => {
    if (!user) return
    getUserTags(user.uid).then((names) =>
      setAllTags(names.map((name) => ({ name })))
    )
  }, [user])

  const handleAddAction = useCallback(
    (tag: Tag) => {
      setTags((prev) => [...prev, tag])
      // persist to /users/{uid}/tags
      upsertUserTag(user!.uid, tag.name).then(() => {
        setAllTags((prev) =>
          prev.some((t) => t.name === tag.name) ? prev : [...prev, tag]
        )
      })
    },
    [user]
  )

  const handleRemoveAction = useCallback(
    (tag: Tag) => {
      setTags((prev) => prev.filter((t) => t.name !== tag.name))
      setAllTags((prev) => prev.filter((t) => t.name !== tag.name))
      // deleteUserTag(user!.uid, tag.name).then(() =>
      //   setAllTags((prev) => prev.filter((t) => t.name !== tag.name))
      // )
    },
    [user]
  )

  const handleSave = async () => {
    if (!user) return

    if (activeTab === "activity") {
      console.log(date)
      const newActivity: Omit<Activity, "id"> = {
        title,
        content,
        date: new Date(date.replace(/-/g, "/").replace(/T.+/, "")),
        engagement: engagementLevel[0],
        energy: energyLevel[0],
        tags,
      }

      console.log(newActivity)

      const id = await addActivity(user.uid, newActivity)
      if (!id) {
        console.error("Failed to save activity")
        return
      }

      router.push("/")
    } else {
      const newReflection: Omit<Reflection, "id"> = {
        title,
        content,
        startDate: new Date(startDate.replace(/-/g, "/").replace(/T.+/, "")),
        endDate: new Date(endDate.replace(/-/g, "/").replace(/T.+/, "")),
        tags,
      }

      const id = await addReflection(user.uid, newReflection)
      if (!id) {
        console.error("Failed to save reflection")
        return
      }

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

  if (loading) return <Spinner />

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

              <div className="flex flex-row items-center h-fit gap-6 space-y-2">
                {/* Engagement Level Slider */}
                <div className="flex-1">
                  <Label htmlFor="engagement-level" className="pb-3">
                    Engagement Level: {engagementLevel[0]}%
                  </Label>
                  <Slider
                    id="engagement-level"
                    min={0}
                    max={100}
                    step={5}
                    value={engagementLevel}
                    onValueChange={setEngagementLevel}
                    className="w-full pb-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Not Engaged (0%)</span>
                    <span>Fully Engaged (100%)</span>
                  </div>
                </div>

                {/* Energy Level Slider */}
                <div className="flex-1">
                  <Label htmlFor="energy-level" className="pb-3">
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
                    className="w-full pb-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Draining (-100%)</span>
                    <span>Neutral (0%)</span>
                    <span>Energizing (+100%)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <TagInput
                  selected={tags}
                  suggestions={allTags}
                  onAddAction={handleAddAction}
                  onRemoveAction={handleRemoveAction}
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
                <Label>Tags</Label>
                <TagInput
                  selected={tags}
                  suggestions={allTags}
                  onAddAction={handleAddAction}
                  onRemoveAction={handleRemoveAction}
                />
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
