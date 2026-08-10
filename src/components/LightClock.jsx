import { useEffect, useRef, useState } from 'react'
import Plate from './Plate.jsx'

const gamma = (b) => 1 / Math.sqrt(1 - b * b)

export default function LightClock() {
  const [v, setV] = useState(60)
  const vRef = useRef(60)
  const ball1Ref = useRef(null)
  const ball2Ref = useRef(null)
  const zigRef = useRef(null)

  useEffect(() => {
    vRef.current = v
    // zigzag geometry: the diagonal path the moving photon traces for you
    const b = v / 100
    let d = 'M 320 46'
    let x = 320
    let up = false
    for (let k = 0; k < 3; k++) {
      x += b * 118 * 0.9 + 18
      d += ` L ${x.toFixed(1)} ${up ? 46 : 164}`
      up = !up
    }
    zigRef.current?.setAttribute('d', d)
  }, [v])

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return
    let raf = 0
    const t0 = performance.now()
    const loop = (now) => {
      raf = requestAnimationFrame(loop)
      const b = vRef.current / 100
      const g = gamma(b)
      const t = (now - t0) / 1000
      const period = 1.6
      const ph = (t % period) / period
      const y = ph < 0.5 ? 46 + 118 * (ph * 2) : 164 - 118 * ((ph - 0.5) * 2)
      ball1Ref.current?.setAttribute('cy', y)
      const phm = ((t / g) % period) / period // the moving clock ticks slower by γ
      const ym = phm < 0.5 ? 46 + 118 * (phm * 2) : 164 - 118 * ((phm - 0.5) * 2)
      const xm = 320 + ((t * b * 74) % 280)
      ball2Ref.current?.setAttribute('cy', ym)
      ball2Ref.current?.setAttribute('cx', xm)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const g = gamma(v / 100)

  return (
    <Plate fig="Fig. 3" title="The light clock" tag="Time dilation">
      <p className="caption">
        Build the simplest clock imaginable: one photon bouncing between two mirrors — every
        bounce, one tick. Now put an identical clock on a passing ship and drag the slider.
        From your platform, the ship's photon must travel a <b>diagonal</b>, longer path. But
        light cannot speed up to compensate — so the moving clock's ticks must stretch.
      </p>
      <div className="controls">
        <label htmlFor="lcV">Ship speed</label>
        <input
          type="range"
          id="lcV"
          min="0"
          max="99"
          value={v}
          onChange={(e) => setV(+e.target.value)}
          aria-label="Ship speed as a percentage of light speed"
        />
        <span className="readout">
          <b>{v}%</b> of c
        </span>
      </div>
      <svg viewBox="0 0 640 200" width="100%" aria-hidden="true" style={{ maxHeight: 210 }}>
        <g>
          <line x1="90" y1="40" x2="170" y2="40" stroke="#E9EEF7" strokeWidth="3" />
          <line x1="90" y1="170" x2="170" y2="170" stroke="#E9EEF7" strokeWidth="3" />
          <line x1="130" y1="46" x2="130" y2="164" stroke="rgba(255,196,107,.3)" strokeWidth="1.5" strokeDasharray="4 4" />
          <circle ref={ball1Ref} cx="130" cy="46" r="6" fill="#FFC46B" />
          <text x="130" y="196" fill="#8B97B0" fontSize="11" textAnchor="middle">
            YOUR CLOCK
          </text>
        </g>
        <g>
          <line x1="300" y1="40" x2="620" y2="40" stroke="rgba(233,238,247,.3)" strokeWidth="1" />
          <line x1="300" y1="170" x2="620" y2="170" stroke="rgba(233,238,247,.3)" strokeWidth="1" />
          <path ref={zigRef} d="" stroke="rgba(255,196,107,.4)" strokeWidth="1.5" fill="none" strokeDasharray="4 4" />
          <circle ref={ball2Ref} cx="320" cy="46" r="6" fill="#FFC46B" />
          <text x="460" y="196" fill="#8B97B0" fontSize="11" textAnchor="middle">
            CLOCK ON THE MOVING SHIP — AS YOU SEE IT
          </text>
        </g>
      </svg>
      <div className="verdict live" style={{ marginTop: 16 }}>
        <h5>The exchange rate of time (γ)</h5>
        <div className="big">
          1 s aboard = {g.toFixed(3)} s for you
        </div>
        <small>
          γ = 1 ÷ √(1 − v²/c²) — the very factor Lorentz had already written down, now
          revealed as a fact about time itself, not about ether squeezing objects
        </small>
      </div>
      <p className="caption" style={{ marginTop: 18 }}>
        This is <b>time dilation</b> — real, measured daily in particle accelerators and GPS
        satellites. Length contraction falls out of the same logic: the moving ship is
        genuinely shorter along its motion, by the same factor. Lorentz's “patch” was never a
        patch; it was the true geometry of space and time, misfiled.
      </p>
    </Plate>
  )
}
