enum TagType {
  "Rock",
  "Pebble",
  "Sand",
}

export interface Tag {
  name: string
  type?: TagType
}

export interface Activity {
  id: string
  title: string
  content: string
  date: Date
  engagement: number
  energy: number
  tags?: Tag[]
}

export interface Reflection {
  id: string
  title: string
  content: string
  startDate: Date
  endDate: Date
  tags?: Tag[]
}
