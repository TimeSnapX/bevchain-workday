import { Link } from 'react-router-dom'
import type { ChecklistData } from '../types'
import { ChecklistSection } from '../components/ChecklistSection'
import { ProgressBar } from '../components/ProgressBar'
import { StarterNote } from '../components/StarterNote'
import { useLocalChecks } from '../hooks/useLocalChecks'

type Props = { data: ChecklistData }

export function DayBaselinePage({ data }: Props) {
  const { dayBaseline, jobTypes } = data
  const itemIds: string[] = []
  const sections = dayBaseline.sections.map((s, si) => ({
    title: s.title,
    items: s.items.map((text, ii) => {
      const id = `day:${si}:${ii}`
      itemIds.push(id)
      return { id, text }
    }),
  }))

  const { checked, toggle, resetToday, done, total, pct, notes, setNotes, date } =
    useLocalChecks('day-baseline', itemIds)

  return (
    <div className="page page--detail">
      <nav className="topnav">
        <Link to="/" className="topnav__back">
          ← Home
        </Link>
      </nav>

      <header className="detail-header">
        <div className="card__head-row">
          <h1>{dayBaseline.title}</h1>
          <span className="badge badge--shared">Shared</span>
        </div>
        {dayBaseline.sitesNote ? <p className="muted">{dayBaseline.sitesNote}</p> : null}
        <p className="muted small">Checks for {date}</p>
        <ProgressBar pct={pct} label={`${done}/${total} done`} />
      </header>

      {sections.map((s) => (
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
          placeholder="Things learned about the day baseline, weighbridge, tablets…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </section>

      <section className="card">
        <h2 className="card__title">Jump to a job type</h2>
        <div className="chip-row">
          {jobTypes.map((j) => (
            <Link key={j.id} className="chip" to={`/job/${j.id}`}>
              {j.shortName}
            </Link>
          ))}
        </div>
      </section>

      <button type="button" className="btn btn--danger btn--block" onClick={resetToday}>
        Reset today's checks
      </button>

      <StarterNote />
    </div>
  )
}
