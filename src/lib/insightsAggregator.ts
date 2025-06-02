import { getAllActivities } from "@/lib/firebase/db"
import type { Activity } from "@/types/entry"

/**
 * Helper to format a Date as "YYYY-MM-DD"
 */
const formatDate = (d: Date): string => {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd}`
}

/**
 * Returns an array of the last N days (inclusive of today), formatted as "YYYY-MM-DD",
 * in ascending order (oldest first).
 */
const getLastNDates = (n: number): string[] => {
  const dates: string[] = []
  const today = new Date()
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    dates.push(formatDate(d))
  }
  return dates
}

/**
 * Groups activities by date (YYYY-MM-DD), computing average energy and engagement per day.
 * Returns an array of length 30, one object per day for the last 30 days, with zeroes where no data.
 */
export const getEnergyEngagementOverTime = async (
  userId: string
): Promise<Array<{ date: string; energy: number; engagement: number }>> => {
  const activities = await getAllActivities(userId)
  // Map date string → array of activities on that date
  const byDate: Record<string, Activity[]> = {}
  activities.forEach((act) => {
    const dStr = formatDate(act.date)
    if (!byDate[dStr]) byDate[dStr] = []
    byDate[dStr].push(act)
  })

  const last30 = getLastNDates(30)
  return last30.map((dateStr) => {
    const list = byDate[dateStr] || []
    if (list.length === 0) {
      return { date: dateStr, energy: 0, engagement: 0 }
    }
    const totalEnergy = list.reduce((sum, a) => sum + a.energy, 0)
    const totalEngagement = list.reduce((sum, a) => sum + a.engagement, 0)
    return {
      date: dateStr,
      energy: Math.round(totalEnergy / list.length),
      engagement: Math.round(totalEngagement / list.length),
    }
  })
}

/**
 * Returns the start-of-week (Monday) Date object for a given date.
 */
const getMonday = (date: Date): Date => {
  const d = new Date(date)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day // if Sunday, go back 6; else go to Monday
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

/**
 * Computes the last 8 weeks (Monday dates), returning an array of Date start-of-week (Monday),
 * oldest first.
 */
const getLastNWeekMondays = (n: number): Date[] => {
  const mondays: Date[] = []
  const today = new Date()
  const thisMonday = getMonday(today)
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(thisMonday)
    d.setDate(thisMonday.getDate() - i * 7)
    mondays.push(d)
  }
  return mondays
}

/**
 * Computes average engagement per week for the last 8 weeks.
 * Returns [{ week: "Week 1", engagement: number }, ... , { week: "Week 8", engagement: number }]
 * where "Week 1" is 8 weeks ago, "Week 8" is current week.
 */
export const getWeeklyEngagementTrend = async (
  userId: string
): Promise<Array<{ week: string; engagement: number }>> => {
  const activities = await getAllActivities(userId)
  const mondays = getLastNWeekMondays(8) // array of 8 Mondays, oldest first
  // For easier comparison, map each activity to its week's Monday string
  const weekMap: Record<string, Activity[]> = {}
  activities.forEach((act) => {
    const mon = getMonday(act.date)
    const key = formatDate(mon)
    if (!weekMap[key]) weekMap[key] = []
    weekMap[key].push(act)
  })

  return mondays.map((monDate, idx) => {
    const key = formatDate(monDate)
    const list = weekMap[key] || []
    if (list.length === 0) {
      return { week: `Week ${idx + 1}`, engagement: 0 }
    }
    const avgEng = Math.round(
      list.reduce((sum, a) => sum + a.engagement, 0) / list.length
    )
    return { week: `Week ${idx + 1}`, engagement: avgEng }
  })
}

/**
 * Computes average energy per week for the last 8 weeks.
 * Returns [{ week: "Week 1", energy: number }, ... , { week: "Week 8", energy: number }]
 */
export const getWeeklyEnergyTrend = async (
  userId: string
): Promise<Array<{ week: string; energy: number }>> => {
  const activities = await getAllActivities(userId)
  const mondays = getLastNWeekMondays(8)
  const weekMap: Record<string, Activity[]> = {}
  activities.forEach((act) => {
    const mon = getMonday(act.date)
    const key = formatDate(mon)
    if (!weekMap[key]) weekMap[key] = []
    weekMap[key].push(act)
  })

  return mondays.map((monDate, idx) => {
    const key = formatDate(monDate)
    const list = weekMap[key] || []
    if (list.length === 0) {
      return { week: `Week ${idx + 1}`, energy: 0 }
    }
    const avgEn = Math.round(
      list.reduce((sum, a) => sum + a.energy, 0) / list.length
    )
    return { week: `Week ${idx + 1}`, energy: avgEn }
  })
}

/**
 * Computes the average energy and engagement over the last seven days (including today).
 * Returns { energy: number; engagement: number }
 */
export const getCurrentWeekAverages = async (
  userId: string
): Promise<{ energy: number; engagement: number }> => {
  const activities = await getAllActivities(userId)

  const today = new Date()
  // Calculate the date exactly 7 days ago
  const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

  // Filter activities from the last seven days
  const recentActs = activities.filter((act) => act.date >= sevenDaysAgo)

  if (recentActs.length === 0) {
    return { energy: 0, engagement: 0 }
  }

  const totalEnergy = recentActs.reduce((sum, a) => sum + a.energy, 0)
  const totalEngagement = recentActs.reduce((sum, a) => sum + a.engagement, 0)

  return {
    energy: Math.round(totalEnergy / recentActs.length),
    engagement: Math.round(totalEngagement / recentActs.length),
  }
}
