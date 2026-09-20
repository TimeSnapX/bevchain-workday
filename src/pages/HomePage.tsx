import { Link } from 'react-router-dom'
import type { ChecklistData } from '../types'
import { ProgressBar } from '../components/ProgressBar'
import { StarterNote } from '../components/StarterNote'
import { readProgress, todayKey } from '../hooks/useLocalChecks'

function itemIdsForJob(jobId: string, data: ChecklistData): string[] {
  const job = data.jobTypes.find((j) => j.id === jobId)
  if (!job) return []
  const ids: string[] = []
  data.dayBaseline.sections.forEach((s, si) => {
    s.items.forEach((_, ii) => ids.push(`day:${si}:${ii}`))
  })
  data.sharedEveryJob.items.forEach((_, i) => ids.push(`every:${i}`))
  job.sections.forEach((s, si) => {
    s.items.forEach((_, ii) => ids.push(`job:${si}:${ii}`))
  })
  return ids
}

function dayBaselineIds(data: ChecklistData): string[] {
  const ids: string[] = []
  data.dayBaseline.sections.forEach((s, si) => {
    s.items.forEach((_, ii) => ids.push(`day:${si}:${ii}`))
  })
  return ids
}

type Props = { data: ChecklistData }

export function HomePage({ data }: Props) {
  const { workDayShape, jobTypes, dayBaseline, sharedEveryJob } = data
  const date = todayKey()
  const dayProg = readProgress('day-baseline', dayBaselineIds(data))

  return (
    <div className="page page--home">
      <header className="hero">
        <p className="hero__eyebrow">TimeSnap · BevChain / Linfox · Brisbane</p>
        <h1 className="hero__title">{data.appName}</h1>
        <p className="hero__tagline">{data.tagline}</p>
        <p className="hero__date">Today · {date}</p>
      </header>

      <section className="card day-shape" aria-labelledby="day-shape-heading">
        <h2 id="day-shape-heading" className="card__title">
          A typical work day
        </h2>
        <dl className="day-meta">
          <div>
            <dt>Wake</dt>
            <dd>{workDayShape.wake}</dd>
          </div>
          <div>
            <dt>Start</dt>
            <dd>{workDayShape.start}</dd>
          </div>
          <div>
            <dt>Finish</dt>
            <dd>{workDayShape.finishWindow}</dd>
          </div>
        </dl>
        <ol className="phases">
          {workDayShape.phases.map((phase) => (
            <li key={phase}>{phase}</li>
          ))}
        </ol>
      </section>

      <section className="card card--accent" aria-labelledby="baseline-heading">
        <div className="card__head-row">
          <h2 id="baseline-heading" className="card__title">
            {dayBaseline.title}
          </h2>
          <span className="badge badge--shared">Shared</span>
        </div>
        {dayBaseline.sitesNote ? <p className="muted">{dayBaseline.sitesNote}</p> : null}
        <ProgressBar pct={dayProg.pct} label={`${dayProg.done}/${dayProg.total} checked today`} />
        <Link className="btn btn--primary btn--block" to="/day">
          Open day baseline
        </Link>
      </section>

      <section aria-labelledby="jobs-heading">
        <h2 id="jobs-heading" className="section-heading">
          Job types
        </h2>
        <div className="job-grid">
          {jobTypes.map((job) => {
            const prog = readProgress(job.id, itemIdsForJob(job.id, data))
            const stillLearning = job.status === 'not-started' || !!job.badge
            return (
              <Link key={job.id} to={`/job/${job.id}`} className="job-card">
                <div className="job-card__top">
                  <span className="job-card__name">{job.shortName}</span>
                  {stillLearning ? (
                    <span className="badge badge--learning">Still learning</span>
                  ) : job.status === 'learning' ? (
                    <span className="badge badge--learning">Learning</span>
                  ) : null}
                </div>
                <p className="job-card__summary">{job.summary}</p>
                <ProgressBar pct={prog.pct} label={`${prog.done}/${prog.total}`} />
              </Link>
            )
          })}
        </div>
      </section>

      <section className="card" aria-labelledby="every-heading">
        <h2 id="every-heading" className="card__title">
          {sharedEveryJob.title}
        </h2>
        <ul className="bullet-list">
          {sharedEveryJob.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="muted small">Also appears on every job checklist (checkable there).</p>
      </section>

      <StarterNote />
    </div>
  )
}
