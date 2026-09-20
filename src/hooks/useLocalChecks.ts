import { useCallback, useEffect, useMemo, useState } from 'react'

export function todayKey(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function bucketKey(bucket: string, date = todayKey()): string {
  return `bevchain-checks:${date}:${bucket}`
}

function notesKey(jobId: string): string {
  return `bevchain-notes:${jobId}`
}

function loadBucket(bucket: string): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(bucketKey(bucket))
    return raw ? (JSON.parse(raw) as Record<string, boolean>) : {}
  } catch {
    return {}
  }
}

function saveBucket(bucket: string, data: Record<string, boolean>) {
  try {
    localStorage.setItem(bucketKey(bucket), JSON.stringify(data))
  } catch {
    /* ignore */
  }
}

/** Map item id prefix → storage bucket so day/every sync across pages */
function bucketForItem(itemId: string, pageJobId: string): string {
  if (itemId.startsWith('day:')) return 'day-baseline'
  if (itemId.startsWith('every:')) return 'every-job'
  return pageJobId
}

function loadMerged(pageJobId: string, itemIds: string[]): Record<string, boolean> {
  const buckets = new Set(itemIds.map((id) => bucketForItem(id, pageJobId)))
  const merged: Record<string, boolean> = {}
  for (const b of buckets) {
    Object.assign(merged, loadBucket(b))
  }
  return merged
}

export function useLocalChecks(jobId: string, itemIds: string[]) {
  const date = todayKey()
  const itemKey = itemIds.join('|')

  const [checked, setChecked] = useState<Record<string, boolean>>(() =>
    loadMerged(jobId, itemIds),
  )

  const [notes, setNotesState] = useState(() => {
    try {
      return localStorage.getItem(notesKey(jobId)) ?? ''
    } catch {
      return ''
    }
  })

  useEffect(() => {
    setChecked(loadMerged(jobId, itemIds))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId, date, itemKey])

  useEffect(() => {
    try {
      setNotesState(localStorage.getItem(notesKey(jobId)) ?? '')
    } catch {
      setNotesState('')
    }
  }, [jobId])

  const toggle = useCallback(
    (itemId: string) => {
      const bucket = bucketForItem(itemId, jobId)
      const current = loadBucket(bucket)
      const next = { ...current, [itemId]: !current[itemId] }
      saveBucket(bucket, next)
      setChecked(loadMerged(jobId, itemIds))
    },
    [jobId, itemIds],
  )

  const resetToday = useCallback(() => {
    const buckets = new Set(itemIds.map((id) => bucketForItem(id, jobId)))
    for (const b of buckets) {
      const current = loadBucket(b)
      const next = { ...current }
      for (const id of itemIds) {
        if (bucketForItem(id, jobId) === b) delete next[id]
      }
      saveBucket(b, next)
    }
    setChecked(loadMerged(jobId, itemIds))
  }, [jobId, itemIds])

  const setNotes = useCallback(
    (value: string) => {
      setNotesState(value)
      try {
        localStorage.setItem(notesKey(jobId), value)
      } catch {
        /* ignore */
      }
    },
    [jobId],
  )

  const done = useMemo(
    () => itemIds.filter((id) => checked[id]).length,
    [checked, itemIds],
  )
  const total = itemIds.length
  const pct = total === 0 ? 0 : Math.round((done / total) * 100)

  return { checked, toggle, resetToday, done, total, pct, notes, setNotes, date }
}

export function readProgress(
  jobId: string,
  itemIds: string[],
): { done: number; total: number; pct: number } {
  const checked = loadMerged(jobId, itemIds)
  const done = itemIds.filter((id) => checked[id]).length
  const total = itemIds.length
  const pct = total === 0 ? 0 : Math.round((done / total) * 100)
  return { done, total, pct }
}
