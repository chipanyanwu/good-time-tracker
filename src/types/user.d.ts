import type { Activity, Reflection } from "./entry"

export interface User {
  userId: string
  name: string
  email: string | null
  profilePic: string
  activities: Activity[]
  reflections: Reflection[]
}
