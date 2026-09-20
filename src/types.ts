export type JobStatus = 'learning' | 'not-started' | 'confident'

export interface ChecklistSection {
  title: string
  items: string[]
}

export interface JobType {
  id: string
  name: string
  shortName: string
  status: JobStatus | string
  badge?: string
  summary: string
  sections: ChecklistSection[]
}

export interface SharedEveryJob {
  title: string
  items: string[]
}

export interface DayBaseline {
  title: string
  sitesNote?: string
  sections: ChecklistSection[]
}

export interface WorkDayShape {
  wake: string
  start: string
  finishWindow: string
  phases: string[]
}

export interface ChecklistData {
  appName: string
  tagline: string
  notes: string
  workDayShape: WorkDayShape
  jobTypes: JobType[]
  sharedEveryJob: SharedEveryJob
  dayBaseline: DayBaseline
}
