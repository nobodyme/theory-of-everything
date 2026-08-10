import { useEffect, useRef, useState } from 'react'
import Plate from './Plate.jsx'

// Both photons drift in a 420px window [140, 560]; positions accumulate so
// slider changes bend the motion smoothly instead of teleporting the dots.
const X_MIN = 140
const X_SPAN = 420

function ChaseLight() {
  const [v, setV] = useState(0)
  const vRef = useRef(0)
  const rootRef = useRef(null)
  const photonRef = useRef(null)
  const photonLabelRef = useRef(null)
  const ghostRef = useRef(null)
  const ghostLabelRef = useRef(null)
  const ticksRef = useRef(null)
  useEffect(() => {
    vRef.current = v
  }, [v])

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return
    let raf = 0
    let running = false
    let last = 0
    let amberX = 60 // offset within the drift window
    let ghostX = 60
    let tickShift = 0

    const loop = (now) => {
      raf = requestAnimationFrame(loop)
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const b = vRef.current / 100
      // your frame: Maxwell's beam recedes at c no matter what
      amberX = (amberX + dt * 110) % X_SPAN
      // Newton's prediction: the beam recedes at (1 − v/c)·c and can freeze
      ghostX = (ghostX + dt * 110 * (1 - b)) % X_SPAN
      // the ground rushes backward faster as you speed up (you stay centered)
      tickShift = (tickShift + dt * b * 260) % 40

      const ax = X_MIN + amberX
      const gx = X_MIN + ghostX
      photonRef.current?.setAttribute('transform', `translate(${ax - 200},0)`)
      photonLabelRef.current?.setAttribute('x', ax)
      ghostRef.current?.setAttribute('transform', `translate(${gx - 200},0)`)
      ghostLabelRef.current?.setAttribute('x', gx)
      ticksRef.current?.setAttribute('transform', `translate(${-tickShift},0)`)
    }

    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !running) {
        running = true
        last = performance.now()
        raf = requestAnimationFrame(loop)
      } else if (!e.isIntersecting && running) {
        running = false
        cancelAnimationFrame(raf)
      }
    })
    if (rootRef.current) io.observe(rootRef.current)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div ref={rootRef}>
      <Plate fig="Fig. 1" title="On pursuing a ray of light" tag="Gedankenexperiment">
        <div className="controls">
          <label htmlFor="chaseV">Your speed</label>
          <input
            type="range"
            id="chaseV"
            min="0"
            max="99"
            value={v}
            onChange={(e) => setV(+e.target.value)}
            aria-label="Your speed as a percentage of light speed"
          />
          <span className="readout">
            <b>{v}%</b> of light speed
          </span>
        </div>
        <svg viewBox="0 0 640 145" width="100%" aria-hidden="true" style={{ maxHeight: 155 }}>
          <line x1="20" y1="118" x2="620" y2="118" stroke="rgba(233,238,247,.35)" strokeWidth="1" />
          <g ref={ticksRef}>
            {Array.from({ length: 17 }, (_, g) => (
              <line
                key={g}
                x1={30 + g * 40}
                y1="115"
                x2={30 + g * 40}
                y2="121"
                stroke="rgba(233,238,247,.3)"
                strokeWidth="1"
              />
            ))}
          </g>
          <circle cx="80" cy="105" r="9" fill="#E9EEF7" />
          <text x="80" y="140" fill="#8B97B0" fontSize="15" textAnchor="middle">
            YOU
          </text>
          <g ref={photonRef}>
            <circle cx="200" cy="46" r="6" fill="#FFC46B" />
            <line x1="170" y1="46" x2="192" y2="46" stroke="#FFC46B" strokeWidth="1.5" opacity=".6" />
            <line x1="150" y1="46" x2="164" y2="46" stroke="#FFC46B" strokeWidth="1.5" opacity=".3" />
          </g>
          <text ref={photonLabelRef} x="200" y="28" fill="#FFC46B" fontSize="15" textAnchor="middle">
            LIGHT — WHAT HAPPENS
          </text>
          <g ref={ghostRef}>
            <circle
              cx="200"
              cy="78"
              r="6"
              fill="none"
              stroke="#E06A4D"
              strokeWidth="1.6"
              strokeDasharray="3 3"
            />
          </g>
          <text ref={ghostLabelRef} x="200" y="98" fill="#E06A4D" fontSize="13" textAnchor="middle">
            NEWTON'S PREDICTION
          </text>
        </svg>
        <div className="duo">
          <div className="verdict dead">
            <div className="vhead">Newton's arithmetic predicts</div>
            <div className="big" aria-live="polite">
              beam recedes at {100 - v}% c
            </div>
            <small>speeds subtract — catch up enough and light stands still</small>
          </div>
          <div className="verdict live">
            <div className="vhead">Maxwell's equations demand</div>
            <div className="big">beam recedes at c. Always.</div>
            <small>a frozen light wave satisfies no equation of physics</small>
          </div>
        </div>
        <p className="caption" style={{ marginTop: 18 }}>
          Push the slider and watch the dashed dot — Newton's predicted beam — slow to a
          crawl while the real one keeps escaping at full speed,{' '}
          <b>as if your running counted for nothing</b>. Both pillars cannot stand. One of
          them is subtly wrong, and it isn't the one every ether hunt had failed to dent.
        </p>
      </Plate>
    </div>
  )
}

export default function Contradiction() {
  return (
    <section className="chapter" id="contradiction">
      <div className="wrap">
        <div className="reveal">
          <div className="eyebrow">
            <span className="chno">Chapter II</span> The contradiction · c. 1895
          </div>
          <h2>
            Chase a beam <em>of light</em>
          </h2>
          <p className="lede">
            At sixteen, Einstein tortured himself with one question: if I run alongside a
            light beam fast enough, will I see it frozen beside me, like two trains keeping
            pace? Newton says yes. Maxwell says never. Drag the slider and watch two pillars
            of physics contradict each other.
          </p>
        </div>
        <ChaseLight />
      </div>
    </section>
  )
}
