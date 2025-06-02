"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { ReflectionCard } from "@/components/reflection-card"
import Link from "next/link"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "@/lib/firebase/firebaseConfig"
import { useRouter } from "next/navigation"
import { Spinner } from "@/components/ui/spinner"

import { getAllReflections } from "@/lib/firebase/db"
import type { Reflection } from "@/types/entry"

export default function ReflectionsPage() {
  const [user, loading] = useAuthState(auth)
  const router = useRouter()

  const [reflections, setReflections] = useState<Reflection[]>([])
  const [fetching, setFetching] = useState(true)

  // Redirect unauthenticated users to /login
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [loading, user, router])

  // Once the user is available, fetch their reflections
  useEffect(() => {
    if (!user) return

    const loadReflections = async () => {
      setFetching(true)
      const fetched = await getAllReflections(user.uid)
      setReflections(fetched)
      setFetching(false)
    }

    loadReflections()
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
          <h1 className="text-3xl font-bold tracking-tight">Reflections</h1>
          <p className="text-muted-foreground">
            Capture and review your thoughts and insights over time
          </p>
        </div>
        <Link href="/tracker">
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            <span>New Entry</span>
          </Button>
        </Link>
      </div>

      {reflections.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No reflections found. Click “New Entry” to add your first reflection.
        </p>
      ) : (
        <div className="grid gap-4">
          {reflections.map((reflection) => (
            <ReflectionCard
              key={reflection.id}
              id={reflection.id}
              title={reflection.title}
              startDate={reflection.startDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              endDate={reflection.endDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              content={reflection.content}
            />
          ))}
        </div>
      )}
    </div>
  )
}
