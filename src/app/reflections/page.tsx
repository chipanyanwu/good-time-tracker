"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { PlusCircle, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { getAllReflections } from "@/lib/firebase/db"
import { getUserTags } from "@/lib/firebase/tagService"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "@/lib/firebase/firebaseConfig"
import { ReflectionCard } from "@/components/reflection-card"
import { MultiSelect } from "@/components/ui/multi-select"
import type { Reflection, Tag } from "@/types/entry"

export default function ReflectionsPage() {
  const [user, loading] = useAuthState(auth)
  const router = useRouter()

  // all reflections
  const [reflections, setReflections] = useState<Reflection[]>([])
  // all tags for filter
  const [allTags, setAllTags] = useState<Tag[]>([])
  // loading flag
  const [fetching, setFetching] = useState(true)

  // filter state
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // redirect if unauthenticated
  useEffect(() => {
    if (!loading && !user) router.push("/login")
  }, [loading, user, router])

  // fetch reflections and tag list
  useEffect(() => {
    if (!user) return

    const loadData = async () => {
      setFetching(true)

      // reflections
      const fetched = await getAllReflections(user.uid)
      fetched.sort((a, b) => b.startDate.getTime() - a.startDate.getTime())
      setReflections(fetched)

      // user's tags
      const tags = await getUserTags(user.uid)
      setAllTags(tags)

      setFetching(false)
    }

    loadData()
  }, [user])

  // compute filtered reflections
  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return reflections.filter((r) => {
      const matchesSearch =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.content.toLowerCase().includes(q)

      const matchesTags =
        selectedTags.length === 0 ||
        (r.tags ?? []).some((t) => selectedTags.includes(t.name))

      return matchesSearch && matchesTags
    })
  }, [reflections, searchQuery, selectedTags])

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

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full max-w-xl">
          <Input
            placeholder="Search reflections..."
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
          No reflections found.
        </p>
      ) : (
        <div className="grid gap-4">
          {filtered.map((reflection) => (
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
              tags={reflection.tags}
            />
          ))}
        </div>
      )}
    </div>
  )
}
