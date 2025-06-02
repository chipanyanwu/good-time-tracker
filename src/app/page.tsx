"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { ActivityCard } from "@/components/activity-card"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "@/lib/firebase/firebaseConfig"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Spinner } from "@/components/ui/spinner"
import { getAllActivities } from "@/lib/firebase/db"
import type { Activity } from "@/types/entry"

export default function ActivityTrackerPage() {
  const [user, loading] = useAuthState(auth)
  const router = useRouter()

  // Local state to hold fetched activities
  const [activities, setActivities] = useState<Activity[]>([])
  const [fetching, setFetching] = useState(true)

  // Redirect unauthenticated users to /login
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [loading, user, router])

  // Once the user is available, fetch their activities
  useEffect(() => {
    if (!user) return

    const loadActivities = async () => {
      setFetching(true)
      const fetched = await getAllActivities(user.uid)
      setActivities(fetched)
      setFetching(false)
    }

    loadActivities()
  }, [user])

  // Show spinner while auth or data is loading
  if (loading || fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="space-y-6">
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

      {activities.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No activities found. Click “New Entry” to add your first activity.
        </p>
      ) : (
        <div className="grid gap-4">
          {activities.map((activity, index) => (
            <ActivityCard
              key={index}
              id={activity.id}
              title={activity.title}
              date={new Date(activity.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              content={activity.content}
              engagementLevel={activity.engagement}
              energyLevel={activity.energy}
            />
          ))}
        </div>
      )}
    </div>
  )
}
