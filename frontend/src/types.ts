export type Habit = {
  id: number
  name: string
  category: string
  description: string | null
  reason: string | null
}

export type DailyLog = {
  id: number
  completed: boolean
  date: string
  habit: { id: number }
}