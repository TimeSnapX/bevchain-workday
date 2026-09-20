import { Link, useParams } from 'react-router-dom'
import type { ChecklistData } from '../types'
import { ChecklistSection } from '../components/ChecklistSection'
import { ProgressBar } from '../components/ProgressBar'
import { StarterNote } from '../components/StarterNote'
import { useLocalChecks } from '../hooks/useLocalChecks'
import { useMemo } from 'react'

type Props = { data: ChecklistData }

export function JobPage({ data }: Props) {
  const { jobId } = useParams<{ jobId: string }>()
  const job = data.jobTypes.find((j) => j.id === jobId)

  const built = useMemo(() => {
    if (!job) {
      return { itemIds: [] as string[], daySections: [], everyItems: [], jobSections: [] }
    }
    const itemIds: string[] = []
    const daySections = data.dayBaseline.sections.map((s, si) => ({
      title: `Day · ${s.title}`,
      items: s.items.map((text, ii) => {
        const id = `day:${si}:${ii}`
        itemIds.push(id)
        return { id, text }
      }),
    }))
    const everyItems = data.sharedEveryJob.items.map((text, i) => {
      const id = `every:${i}`
      itemIds.push(id)
      return { id, text }
    })
    const jobSections = job.sections.map((s, si) => ({
      title: s.title,
      items: s.items.map((text, ii) => {
        const id = `job:${si}:${ii}`
        itemIds.push(id)
        return { id, text }
      }),
    }))
    return { itemIds, daySections, everyItems, jobSections }
  }, [job, data])

  const { checked, toggle, resetToday, done, total, pct, notes, setNotes, date } =
    useLocalChecks(job?.id ?? '_missing', built.itemIds)

  if (!job) {
    return (
      <div className="page">
        <nav className="topnav">
          <Link to="/" className="topnav__back">
            ← Home
          </Link>
        </nav>
        <p>Job type not found.</p>
      </div>
    )
  }

  const stillLearning = job.status === 'not-started' || !!job.badge

  return (
    <div className="page page--detail">
      <nav className="topnav">
        <Link to="/" className="topnav__back">
          ← Home
        </Link>
        <Link to="/day" className="topnav__link">
          Day baseline
        </Link>
      </nav>

      <header className="detail-header">
        <div className="card__head-row">
          <h1>{job.name}</h1>
          {stillLearning ? <span className="badge badge--learning">Still learning</span> : null}
        </div>
        {job.badge ? <p className="badge-line">{job.badge}</p> : null}
        <p className="muted">{job.summary}</p>
        <p className="muted small">Checks for {date}</p>
        <ProgressBar pct={pct} label={`${done}/${total} done`} />
      </header>

      <div className="shared-block">
        <p className="shared-block__label">Shared day baseline</p>
        {built.daySections.map((s) => (
          <ChecklistSection
            key={s.title}
            title={s.title}
            items={s.items}
            checked={checked}
            onToggle={toggle}
          />
        ))}
      </div>

      <ChecklistSection
        title={data.sharedEveryJob.title}
        items={built.everyItems}
        checked={checked}
        onToggle={toggle}
      />

      {built.jobSections.map((s) => (
        <ChecklistSection
          key={s.title}
          title={s.title}
          items={s.items}
          checked={checked}
          onToggle={toggle}
        />
      ))}

      <section className="card">
        <h2 className="card__title">Notes from the road</h2>
        <textarea
          className="notes"
          rows={4}
          placeholder={`Things learned on ${job.shortName} jobs…`}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </section>

      <button type="button" className="btn btn--danger btn--block" onClick={resetToday}>
        Reset today's checks
      </button>

      <StarterNote />
    </div>
  )
}
