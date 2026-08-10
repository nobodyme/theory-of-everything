import { useRef, useState } from 'react'
import Plate from './Plate.jsx'

export default function Elevator() {
  const [rocket, setRocket] = useState(false)
  const ballRef = useRef(null)
  const animRef = useRef(0)

  const drop = () => {
    cancelAnimationFrame(animRef.current)
    const ball = ballRef.current
    if (!ball) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      ball.setAttribute('cy', 186)
      setTimeout(() => ball.setAttribute('cy', 70), 900)
      return
    }
    const s = performance.now()
    const fall = (now) => {
      const t = (now - s) / 1000
      const y = 70 + 260 * t * t // same parabola in either mode — that's the point
      if (y >= 186) {
        ball.setAttribute('cy', 186)
        setTimeout(() => ball.setAttribute('cy', 70), 900)
        return
      }
      ball.setAttribute('cy', y)
      animRef.current = requestAnimationFrame(fall)
    }
    animRef.current = requestAnimationFrame(fall)
  }

  return (
    <Plate fig="Fig. 4" title="The sealed elevator" tag="Equivalence principle">
      <p className="caption">
        You wake inside a sealed box, feet pressed to the floor. Two possible explanations —
        choose one, then release the ball. Can any experiment inside tell them apart?
      </p>
      <div className="controls">
        <button className={`btn${!rocket ? ' active' : ''}`} onClick={() => setRocket(false)}>
          Resting on Earth
        </button>
        <button className={`btn${rocket ? ' active' : ''}`} onClick={() => setRocket(true)}>
          Rocket accelerating in deep space
        </button>
        <button className="btn" onClick={drop}>
          <span aria-hidden="true">● </span>Release ball
        </button>
      </div>
      <svg viewBox="0 0 640 220" width="100%" aria-hidden="true" style={{ maxHeight: 230 }}>
        <path
          d="M20 200 Q 320 160 620 200 L 620 220 L 20 220 Z"
          fill="rgba(233,238,247,.12)"
          opacity={rocket ? 0 : 1}
          style={{ transition: 'opacity .3s' }}
        />
        <text x="320" y="216" fill="#8B97B0" fontSize="15" textAnchor="middle">
          {rocket ? 'DEEP SPACE · THRUST a = 9.8 m/s²' : 'EARTH · g = 9.8 m/s²'}
        </text>
        <g opacity={rocket ? 1 : 0} style={{ transition: 'opacity .3s' }}>
          <path d="M300 196 l8 20 l12 -14 l12 14 l8 -20" stroke="#FFC46B" strokeWidth="2" fill="none" />
        </g>
        <rect x="255" y="46" width="130" height="150" fill="none" stroke="#E9EEF7" strokeWidth="2" />
        <line x1="255" y1="46" x2="385" y2="46" stroke="#E9EEF7" strokeWidth="4" />
        <circle cx="300" cy="176" r="9" fill="none" stroke="#E9EEF7" strokeWidth="1.6" />
        <path d="M291 176 a9 9 0 0 1 18 0" fill="#E9EEF7" />
        <circle cx="300" cy="160" r="6" fill="#E9EEF7" />
        <circle ref={ballRef} cx="345" cy="70" r="7" fill="#FFC46B" />
        <text x="320" y="34" fill="#8B97B0" fontSize="15" textAnchor="middle">
          INSIDE: IDENTICAL, EITHER WAY
        </text>
      </svg>
      <p className="caption" style={{ marginTop: 14 }}>
        <b>Verdict: indistinguishable.</b> The ball falls the same way in both. If gravity is
        locally identical to acceleration, then gravity isn't a force being beamed between
        objects — it's a feature of the stage itself.
      </p>
    </Plate>
  )
}
