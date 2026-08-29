export default function Plate({ fig, title, tag, children, wide = false }) {
  return (
    <div className={`plate reveal${wide ? ' plate-wide' : ''}`}>
      <div className="plate-head">
        <span className="plate-fig">
          <b>{fig}</b> — {title}
        </span>
        <span className="plate-tag">{tag}</span>
      </div>
      <div className="plate-inner">{children}</div>
    </div>
  )
}
