const ROWS = [
  {
    knew: "Galileo's relativity",
    became: 'Postulate 1',
    note: 'extended from mechanics to all of physics — no privileged stage',
  },
  {
    knew: "Maxwell's constant c",
    became: 'Postulate 2',
    note: 'a law about reality, not a puzzle needing an ether',
  },
  {
    knew: 'Michelson–Morley’s null',
    became: 'Evidence',
    note: 'reread as nature’s verdict: there is no ether wind to find',
  },
  {
    knew: "Lorentz's equations",
    became: 'The geometry of time',
    note: 'kept intact — but reinterpreted, not patched',
  },
  {
    knew: 'Mach & Hume’s doubts',
    became: 'Permission',
    note: 'license to delete “absolute time” as unmeasurable metaphysics',
  },
  {
    knew: "Mercury's 43″ drift",
    became: 'The proof',
    note: 'the 56-year-old anomaly general relativity nailed unprompted',
  },
]

export default function Ledger() {
  return (
    <section className="chapter" id="ledger">
      <div className="wrap">
        <div className="reveal">
          <div className="eyebrow">
            <span className="chno">Chapter V</span> The ledger, closed · 1919
          </div>
          <h2 className="h2-flip">
            Old parts, <em>new machine</em>
          </h2>
          <p className="lede">
            Line up the inputs against the outputs and the pattern is unmistakable:
            Einstein's genius was not private information. It was the courage to take public
            information seriously.
          </p>
        </div>

        <div className="ledger-grid reveal-stagger">
          {ROWS.map((r, i) => (
            <div className="ledger-cell" key={r.knew} style={{ '--i': i }}>
              <div className="lk">He knew</div>
              <div className="lt">{r.knew}</div>
              <div className="arrow">↓ became</div>
              <p>
                <b>{r.became}.</b> {r.note}
              </p>
            </div>
          ))}
        </div>

        <div className="telegram reveal" data-label="What he landed on">
          <p>
            There is no universal “now” — simultaneity depends on motion. Moving clocks run
            slow and moving objects shorten, by Lorentz's factor γ. Mass is frozen energy,{' '}
            <b>E&nbsp;=&nbsp;mc²</b>. And gravity is not a force reaching across space but
            the curvature of spacetime itself — mass tells spacetime how to curve, spacetime
            tells mass how to move.
          </p>
          <p className="small">
            Every claim has since been tested to exquisite precision. Your phone's GPS
            corrects for both relativities every second of every day.
          </p>
        </div>
      </div>
    </section>
  )
}
