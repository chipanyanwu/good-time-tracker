"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { getAllActivities } from "@/lib/firebase/db"
import { getUserTags } from "@/lib/firebase/tagService"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "@/lib/firebase/firebaseConfig"
import { ActivityCard } from "@/components/activity-card"
import { MultiSelect } from "@/components/ui/multi-select"
import type { Activity, Tag } from "@/types/entry"
import { Search } from "lucide-react"

export default function ActivityTrackerPage() {
  const [user, loading] = useAuthState(auth)
  const router = useRouter()

  // all activities
  const [activities, setActivities] = useState<Activity[]>([])
  // all tags for filter
  const [allTags, setAllTags] = useState<Tag[]>([])
  // loading flags
  const [fetching, setFetching] = useState(true)

  // filter state
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // redirect if unauthenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [loading, user, router])

  // fetch activities and tags once user is ready
  useEffect(() => {
    if (!user) return

    const loadData = async () => {
      setFetching(true)

      // activities
      const fetched = await getAllActivities(user.uid)
      fetched.sort((a, b) => b.date.getTime() - a.date.getTime())
      setActivities(fetched)

      // user’s global tags
      const tagNames = await getUserTags(user.uid)
      setAllTags(tagNames.map((name) => ({ name })))

      setFetching(false)
    }

    loadData()
  }, [user])

  // compute filtered list
  const filtered = useMemo(() => {
    return activities.filter((act) => {
      // search match
      const q = searchQuery.trim().toLowerCase()
      const matchesSearch =
        !q ||
        act.title.toLowerCase().includes(q) ||
        act.content.toLowerCase().includes(q)

      // tag match (any selected tag)
      const matchesTags =
        selectedTags.length === 0 ||
        (act.tags ?? []).some((t) => selectedTags.includes(t.name))

      return matchesSearch && matchesTags
    })
  }, [activities, searchQuery, selectedTags])

  if (loading || fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Activity Tracker
          </h1>
          <p className="text-muted-foreground">
            Track and monitor your daily activities
          </p>
        </div>
        <Link href="/tracker">
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            <span>New Entry</span>
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full max-w-xl">
          <Input
            placeholder="Search activities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
            startIcon={Search}
          />
        </div>

        <div className="w-full sm:w-64">
          <MultiSelect
            options={allTags.map((t) => ({ value: t.name, label: t.name }))}
            defaultValue={selectedTags}
            onValueChange={setSelectedTags}
            placeholder="Filter by tags"
            variant="default"
          />
        </div>
      </div>

      {/* No results message */}
      {filtered.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No activities found.
        </p>
      ) : (
        <div className="grid gap-4">
          {filtered.map((activity) => (
            <ActivityCard
              key={activity.id}
              id={activity.id}
              title={activity.title}
              date={activity.date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              content={activity.content}
              engagementLevel={activity.engagement}
              energyLevel={activity.energy}
              tags={activity.tags}
            />
          ))}
        </div>
      )}
    </div>
  )
}
