type Props = {
  title: string
  items: { id: string; text: string }[]
  checked: Record<string, boolean>
  onToggle: (id: string) => void
}

export function ChecklistSection({ title, items, checked, onToggle }: Props) {
  return (
    <section className="checklist-section">
      <h2 className="checklist-section__title">{title}</h2>
      <ul className="checklist">
        {items.map((item) => {
          const isOn = !!checked[item.id]
          return (
            <li key={item.id}>
              <button
                type="button"
                className={`check-row${isOn ? ' check-row--done' : ''}`}
                onClick={() => onToggle(item.id)}
                aria-pressed={isOn}
              >
                <span className="check-row__box" aria-hidden="true">
                  {isOn ? '✓' : ''}
                </span>
                <span className="check-row__text">{item.text}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
