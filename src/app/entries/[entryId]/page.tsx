"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { ArrowLeft, Save, Trash } from "lucide-react"
import { useAuthState } from "react-firebase-hooks/auth"
import { Spinner } from "@/components/ui/spinner"
import { auth } from "@/lib/firebase/firebaseConfig"
import { Badge } from "@/components/ui/badge"

import {
  getAllActivities,
  getAllReflections,
  updateActivity,
  updateReflection,
  deleteActivity,
  deleteReflection,
} from "@/lib/firebase/db"
import {
  getUserTags,
  upsertUserTag,
  deleteUserTag,
} from "@/lib/firebase/tagService"
import { TagInput } from "@/components/tag-input"

import type { Activity, Reflection, Tag } from "@/types/entry"

type UnifiedEntry =
  | {
      id: string
      type: "activity"
      title: string
      content: string
      date: string // stored as "YYYY-MM-DD"
      engagement: number
      energy: number
      tags?: Tag[]
    }
  | {
      id: string
      type: "reflection"
      title: string
      content: string
      startDate: string // stored as "YYYY-MM-DD"
      endDate: string // stored as "YYYY-MM-DD"
      tags?: Tag[]
    }

export default function EntryDetailPage() {
  const [user, loading] = useAuthState(auth)
  const router = useRouter()
  const params = useParams()
  const entryId = String(params.entryId)

  const [entry, setEntry] = useState<UnifiedEntry | null>(null)
  const [fetching, setFetching] = useState(true)

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [date, setDate] = useState("") // for activity
  const [startDate, setStartDate] = useState("") // for reflection
  const [endDate, setEndDate] = useState("") // for reflection
  const [engagementLevel, setEngagementLevel] = useState([75])
  const [energyLevel, setEnergyLevel] = useState([0])

  const [tags, setTags] = useState<Tag[]>([])
  const [allTags, setAllTags] = useState<Tag[]>([])

  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [loading, user, router])

  // load user's tag list for suggestions
  useEffect(() => {
    if (!user) return
    getUserTags(user.uid).then((names) =>
      setAllTags(names.map((name) => ({ name })))
    )
  }, [user])

  // Fetch all activities + reflections, then find the matching entry
  useEffect(() => {
    if (!user) return

    const loadEntry = async () => {
      setFetching(true)

      const activities = await getAllActivities(user.uid)
      const reflections = await getAllReflections(user.uid)

      const unified: UnifiedEntry[] = [
        ...activities.map((a: Activity) => ({
          id: a.id,
          type: "activity" as const,
          title: a.title,
          content: a.content,
          // a.date is already a Date (because service converted epoch→Date)
          date: a.date.toISOString().substring(0, 10),
          engagement: a.engagement,
          energy: a.energy,
          tags: a.tags,
        })),
        ...reflections.map((r: Reflection) => ({
          id: r.id,
          type: "reflection" as const,
          title: r.title,
          content: r.content,
          startDate: r.startDate.toISOString().substring(0, 10),
          endDate: r.endDate.toISOString().substring(0, 10),
          tags: r.tags,
        })),
      ]

      const found = unified.find((e) => e.id === entryId)
      if (!found) {
        console.error(`No entry found with ID: ${entryId}`)
        router.push("/")
        return
      }

      setEntry(found)
      setTitle(found.title)
      setContent(found.content)
      setTags(found.tags ?? [])

      if (found.type === "activity") {
        setDate(found.date)
        setEngagementLevel([found.engagement])
        setEnergyLevel([found.energy])
      } else {
        setStartDate(found.startDate)
        setEndDate(found.endDate)
      }

      setFetching(false)
    }

    loadEntry()
  }, [user, entryId, router])

  const handleAddTag = useCallback(
    (tag: Tag) => {
      setTags((prev) => [...prev, tag])
      upsertUserTag(user!.uid, tag.name).then(() =>
        setAllTags((prev) =>
          prev.some((t) => t.name === tag.name) ? prev : [...prev, tag]
        )
      )
    },
    [user]
  )

  const handleRemoveTag = useCallback(
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
    if (!user || !entry) return
    setSaving(true)

    if (entry.type === "activity") {
      const updated: Omit<Activity, "id"> = {
        title,
        content,
        date: new Date(date.replace(/-/g, "/").replace(/T.+/, "")), // convert "YYYY-MM-DD" → Date
        engagement: engagementLevel[0],
        energy: energyLevel[0],
        tags,
      }
      const success = await updateActivity(user.uid, entry.id, updated)
      if (!success) {
        console.error("Failed to update activity")
        setSaving(false)
        return
      }
    } else {
      const updated: Omit<Reflection, "id"> = {
        title,
        content,
        startDate: new Date(startDate.replace(/-/g, "/").replace(/T.+/, "")), // convert "YYYY-MM-DD" → Date
        endDate: new Date(endDate.replace(/-/g, "/").replace(/T.+/, "")), // convert "YYYY-MM-DD" → Date
        tags,
      }
      const success = await updateReflection(user.uid, entry.id, updated)
      if (!success) {
        console.error("Failed to update reflection")
        setSaving(false)
        return
      }
    }

    router.push(entry.type === "activity" ? "/" : "/reflections")
  }

  const handleDelete = async () => {
    if (!user || !entry) return
    setDeleting(true)

    if (entry.type === "activity") {
      const success = await deleteActivity(user.uid, entry.id)
      if (!success) {
        console.error("Failed to delete activity")
        setDeleting(false)
        return
      }
    } else {
      const success = await deleteReflection(user.uid, entry.id)
      if (!success) {
        console.error("Failed to delete reflection")
        setDeleting(false)
        return
      }
    }

    setDeleting(false)
    router.push(entry.type === "activity" ? "/" : "/reflections")
  }

  const handleBack = () => {
    router.push(entry?.type === "activity" ? "/" : "/reflections")
  }

  if (loading || fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner />
      </div>
    )
  }

  if (!entry) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          disabled={saving || deleting}
        >
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
                    disabled={saving || deleting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-date">Date</Label>
                  <Input
                    id="edit-date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    disabled={saving || deleting}
                  />
                </div>
                <div className="flex flex-row items-center h-fit gap-6 space-y-2">
                  <div className="flex-1">
                    <Label htmlFor="edit-engagement" className="pb-3">
                      Engagement Level: {engagementLevel[0]}%
                    </Label>
                    <Slider
                      id="edit-engagement"
                      min={0}
                      max={100}
                      step={5}
                      value={engagementLevel}
                      onValueChange={setEngagementLevel}
                      disabled={saving || deleting}
                      className="w-full pb-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Not Engaged (0%)</span>
                      <span>Fully Engaged (100%)</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="edit-energy" className="pb-3">
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
                      disabled={saving || deleting}
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
                    onAddAction={handleAddTag}
                    onRemoveAction={handleRemoveTag}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-content">Description</Label>
                  <Textarea
                    id="edit-content"
                    className="min-h-[150px]"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    disabled={saving || deleting}
                  />
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
                    disabled={saving || deleting}
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
                      disabled={saving || deleting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-end-date">End Date</Label>
                    <Input
                      id="edit-end-date"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      disabled={saving || deleting}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <TagInput
                    selected={tags}
                    suggestions={allTags}
                    onAddAction={handleAddTag}
                    onRemoveAction={handleRemoveTag}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-content">Content</Label>
                  <Textarea
                    id="edit-content"
                    className="min-h-[150px]"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    disabled={saving || deleting}
                  />
                </div>
              </>
            )}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSave}
                className="flex items-center gap-2"
                disabled={saving || deleting}
              >
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                disabled={saving || deleting}
              >
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
                <div className="flex flex-col sm:flex-row gap-2 mt-6">
                  <Badge variant={"secondary"}>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Engagement:</span>
                      <span className="text-sm">{entry.engagement}%</span>
                    </div>
                  </Badge>
                  <Badge variant={"secondary"}>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Energy:</span>
                      <span
                        className={`text-sm ${
                          entry.energy > 0 ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {entry.energy > 0 ? "+" : ""}
                        {entry.energy}%
                      </span>
                    </div>
                  </Badge>
                </div>
              )}
              {tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  <h4>Tags:</h4>
                  {tags.map((tag) => (
                    <Badge key={tag.name} variant="outline">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
            <div className="border-t p-6 flex justify-between">
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                disabled={saving || deleting}
              >
                Edit Entry
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={saving || deleting}
              >
                <Trash className="h-4 w-4 mr-2" />
                {deleting ? "Deleting..." : "Delete Entry"}
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}
