import Simultaneity from './Simultaneity.jsx'
import LightClock from './LightClock.jsx'

export default function TheMove() {
  return (
    <section className="chapter" id="move">
      <div className="wrap">
        <div className="reveal">
          <div className="eyebrow">
            <span className="chno">Chapter III</span> The move · June 1905
          </div>
          <h2>
            Keep both facts. <em>Sacrifice time.</em>
          </h2>
          <p className="lede">
            Einstein's paper — “On the Electrodynamics of Moving Bodies” — cites not a
            single source: no footnotes, no references, no new data. Instead it makes an
            audacious accounting decision. Take two things everyone already half-believed
            and declare them both absolutely true:
          </p>
        </div>

        <div className="postulates reveal-stagger">
          <div className="postulate" style={{ '--i': 0 }}>
            <div className="pnum">1</div>
            <h3>The laws of physics are the same in every steadily moving room.</h3>
            <p>
              Galileo was right — and not just for mechanics. Electricity, magnetism, light:
              all of it. There is no ether, no privileged stage, no experiment that can
              reveal “absolute rest.”
            </p>
            <div className="src">
              Source — <b>the ship's cabin, 1632</b>, promoted to law
            </div>
          </div>
          <div className="postulate" style={{ '--i': 1 }}>
            <div className="pnum">2</div>
            <h3>Every observer measures light at the same speed, c.</h3>
            <p>
              Maxwell was right, literally: c is not a speed relative to some medium. It is
              the same for everyone, no matter how they move. Full stop.
            </p>
            <div className="src">
              Source — <b>Maxwell's equations, 1865</b>, taken at their word. Michelson
              &amp; Morley's “failure” stood by as silent confirmation
            </div>
          </div>
        </div>

        <div className="prose reveal" style={{ marginTop: 36 }}>
          <p>
            If both hold, something else must give. What gives is the thing Newton never
            dared question and Einstein's patent work primed him to doubt:{' '}
            <b>the assumption that all clocks everywhere can agree on “now.”</b>
          </p>
        </div>

        <Simultaneity />
        <LightClock />

        <div className="miracle reveal">
          <div className="miracle-head">
            For scale — <b>everything else he published that same year</b>, evenings and
            weekends, while employed full-time
          </div>
          <div className="miracle-row">
            <div className="miracle-cell">
              <div className="mm">March</div>
              <div className="mt">Light comes in packets</div>
              <p>The photoelectric effect — the paper that seeded quantum theory and later won him the Nobel Prize.</p>
            </div>
            <div className="miracle-cell">
              <div className="mm">May</div>
              <div className="mt">Atoms are real</div>
              <p>Brownian motion explained by molecular collisions — the argument that ended doubt about atoms.</p>
            </div>
            <div className="miracle-cell hot">
              <div className="mm">June</div>
              <div className="mt">Special relativity</div>
              <p>The paper this story is about. Space and time, rebuilt in thirty pages.</p>
            </div>
            <div className="miracle-cell hot">
              <div className="mm">September</div>
              <div className="mt">E = mc²</div>
              <p>A three-page afterthought chasing the consequences into energy bookkeeping.</p>
            </div>
          </div>
        </div>

        <div className="telegram reveal" data-label="Conclusion · Sept 1905">
          <p>
            <b>Mass and energy are one ledger in two currencies.</b> When an object radiates
            energy, it loses a sliver of mass:
          </p>
          <div className="formula">E = mc²</div>
          <p className="small">
            With c² an enormous number, a speck of mass is a vault of energy — the line
            explaining why the Sun has burned for billions of years.
          </p>
        </div>
      </div>
    </section>
  )
}
