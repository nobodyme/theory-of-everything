import { useEffect, useRef, useState } from 'react'
import Plate from './Plate.jsx'

function ChaseLight() {
  const [v, setV] = useState(0)
  const photonRef = useRef(null)
  const labelRef = useRef(null)
  const ticksRef = useRef(null)
  const vRef = useRef(0)
  useEffect(() => {
    vRef.current = v
  }, [v])

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return
    let raf = 0
    const t0 = performance.now()
    const loop = (now) => {
      raf = requestAnimationFrame(loop)
      const t = (now - t0) / 1000
      // in YOUR frame the beam always recedes at c — fixed drift, slider-independent
      const px = 140 + ((t * 110) % 420)
      if (photonRef.current)
        photonRef.current.setAttribute('transform', `translate(${px - 200},0)`)
      if (labelRef.current) labelRef.current.setAttribute('x', px)
      // the ground rushes backward faster as you speed up (you stay centered)
      const shift = (t * (vRef.current / 100) * 260) % 40
      if (ticksRef.current)
        ticksRef.current.setAttribute('transform', `translate(${-shift},0)`)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
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
      <svg viewBox="0 0 640 120" width="100%" aria-hidden="true" style={{ maxHeight: 130 }}>
        <line x1="20" y1="95" x2="620" y2="95" stroke="rgba(233,238,247,.35)" strokeWidth="1" />
        <g ref={ticksRef}>
          {Array.from({ length: 17 }, (_, g) => (
            <line
              key={g}
              x1={30 + g * 40}
              y1="92"
              x2={30 + g * 40}
              y2="98"
              stroke="rgba(233,238,247,.3)"
              strokeWidth="1"
            />
          ))}
        </g>
        <circle cx="80" cy="82" r="9" fill="#E9EEF7" />
        <text x="80" y="115" fill="#8B97B0" fontSize="11" textAnchor="middle">
          YOU
        </text>
        <g ref={photonRef}>
          <circle cx="200" cy="52" r="6" fill="#FFC46B" />
          <line x1="170" y1="52" x2="192" y2="52" stroke="#FFC46B" strokeWidth="1.5" opacity=".6" />
          <line x1="150" y1="52" x2="164" y2="52" stroke="#FFC46B" strokeWidth="1.5" opacity=".3" />
        </g>
        <text ref={labelRef} x="200" y="36" fill="#FFC46B" fontSize="11" textAnchor="middle">
          LIGHT
        </text>
      </svg>
      <div className="duo">
        <div className="verdict dead">
          <h5>Newton's arithmetic predicts</h5>
          <div className="big">beam recedes at {100 - v}% c</div>
          <small>speeds subtract — catch up enough and light stands still</small>
        </div>
        <div className="verdict live">
          <h5>Maxwell's equations demand</h5>
          <div className="big">beam recedes at c. Always.</div>
          <small>a frozen light wave satisfies no equation of physics</small>
        </div>
      </div>
      <p className="caption" style={{ marginTop: 18 }}>
        However fast you run, the beam pulls away at full speed —{' '}
        <b>as if your running counted for nothing</b>. Both pillars cannot stand. One of them
        is subtly wrong, and it isn't the one confirmed by Michelson &amp; Morley.
      </p>
    </Plate>
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
