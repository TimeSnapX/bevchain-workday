type Props = { pct: number; label?: string }

export function ProgressBar({ pct, label }: Props) {
  return (
    <div className="progress" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={label ?? 'Progress'}>
      <div className="progress__track">
        <div className="progress__fill" style={{ width: `${pct}%` }} />
      </div>
      {label ? <span className="progress__label">{label}</span> : null}
    </div>
  )
}
