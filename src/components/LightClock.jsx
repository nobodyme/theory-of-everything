import { useEffect, useRef, useState } from 'react'
import Plate from './Plate.jsx'

const gamma = (b) => 1 / Math.sqrt(1 - b * b)
const PERIOD = 1.6 // seconds per full tick of your clock
const Y_TOP = 46
const Y_BOT = 164
// horizontal advance per half-tick (sketch scale; +18 keeps it visible at v=0)
const segDx = (b) => b * 118 * 0.9 + 18

export default function LightClock() {
  const [v, setV] = useState(60)
  const vRef = useRef(60)
  const rootRef = useRef(null)
  const ball1Ref = useRef(null)
  const ball2Ref = useRef(null)
  const zigRef = useRef(null)

  useEffect(() => {
    vRef.current = v
    // one full tick of the moving clock, as you see it: down the diagonal, back up
    const dx = segDx(v / 100)
    zigRef.current?.setAttribute(
      'd',
      `M 320 ${Y_TOP} L ${(320 + dx).toFixed(1)} ${Y_BOT} L ${(320 + 2 * dx).toFixed(1)} ${Y_TOP}`
    )
  }, [v])

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return
    let raf = 0
    let running = false
    let t = 0
    let last = 0

    const loop = (now) => {
      raf = requestAnimationFrame(loop)
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      t += dt
      const b = vRef.current / 100
      const g = gamma(b)
      // your clock: straight up and down
      const ph = (t % PERIOD) / PERIOD
      const y = ph < 0.5 ? Y_TOP + 118 * (ph * 2) : Y_BOT - 118 * ((ph - 0.5) * 2)
      ball1Ref.current?.setAttribute('cy', y)
      // the ship's clock ticks slower by γ, and its photon rides the drawn diagonal
      const phm = ((t / g) % PERIOD) / PERIOD
      const dx = segDx(b)
      const ym = phm < 0.5 ? Y_TOP + 118 * (phm * 2) : Y_BOT - 118 * ((phm - 0.5) * 2)
      const xm = 320 + 2 * dx * phm
      ball2Ref.current?.setAttribute('cy', ym)
      ball2Ref.current?.setAttribute('cx', xm)
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

  const g = gamma(v / 100)

  return (
    <div ref={rootRef}>
      <Plate fig="Fig. 3" title="The light clock" tag="Time dilation">
        <p className="caption">
          Build the simplest clock imaginable: one photon bouncing between two mirrors —
          every bounce, one tick. Now put an identical clock on a passing ship and drag the
          slider. From your platform, the ship's photon must travel a <b>diagonal</b>,
          longer path. But light cannot speed up to compensate — so the moving clock's ticks
          must stretch.
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
            <line
              x1="130" y1="46" x2="130" y2="164"
              stroke="rgba(255,196,107,.3)" strokeWidth="1.5" strokeDasharray="4 4"
            />
            <circle ref={ball1Ref} cx="130" cy="46" r="6" fill="#FFC46B" />
            <text x="130" y="196" fill="#8B97B0" fontSize="15" textAnchor="middle">
              YOUR CLOCK
            </text>
          </g>
          <g>
            <line x1="300" y1="40" x2="620" y2="40" stroke="rgba(233,238,247,.3)" strokeWidth="1" />
            <line x1="300" y1="170" x2="620" y2="170" stroke="rgba(233,238,247,.3)" strokeWidth="1" />
            <path ref={zigRef} d="" stroke="rgba(255,196,107,.4)" strokeWidth="1.5" fill="none" strokeDasharray="4 4" />
            <circle ref={ball2Ref} cx="320" cy="46" r="6" fill="#FFC46B" />
            <text x="460" y="196" fill="#8B97B0" fontSize="15" textAnchor="middle">
              SHIP'S CLOCK — AS YOU SEE IT
            </text>
          </g>
        </svg>
        <div className="verdict live" style={{ marginTop: 16 }}>
          <div className="vhead">The exchange rate of time (γ)</div>
          <div className="big" aria-live="polite">
            1 s aboard = {g.toFixed(3)} s for you
          </div>
          <small>
            γ = 1 ÷ √(1 − v²/c²) — the very factor Lorentz had already written down, now
            revealed as a fact about time itself, not about ether squeezing objects
          </small>
        </div>
        <p className="caption" style={{ marginTop: 18 }}>
          This is <b>time dilation</b> — real, measured daily in particle accelerators and
          GPS satellites. Length contraction falls out of the same logic: the moving ship is
          genuinely shorter along its motion, by the same factor. Lorentz's “patch” was never
          a patch; it was the true geometry of space and time, misfiled.
        </p>
      </Plate>
    </div>
  )
}
