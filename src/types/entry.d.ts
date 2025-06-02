export interface Activity {
  id: string
  title: string
  content: string
  date: Date
  engagement: number
  energy: number
}

export interface Reflection {
  id: string
  title: string
  content: string
  startDate: Date
  endDate: Date
}
