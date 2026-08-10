import { useEffect, useRef, useState } from 'react'
import Plate from './Plate.jsx'

const C = 170 // px/s — light
const V = 55 // px/s — train
const XL = 115
const XR = 525
const MID = 320

export default function Simultaneity() {
  const [status, setStatus] = useState('Both flashes travel at exactly c for everyone.')
  const [mira, setMira] = useState('—')
  const [theo, setTheo] = useState('—')
  const trainRef = useRef(null)
  const waveLRef = useRef(null)
  const waveRRef = useRef(null)
  const boltLRef = useRef(null)
  const boltRRef = useRef(null)
  const animRef = useRef(0)

  const reset = () => {
    cancelAnimationFrame(animRef.current)
    trainRef.current?.setAttribute('transform', `translate(${MID},0)`)
    for (const w of [waveLRef, waveRRef]) {
      w.current?.setAttribute('r', 0)
      w.current?.setAttribute('opacity', 0)
    }
    for (const b of [boltLRef, boltRRef]) b.current?.setAttribute('opacity', 0)
    setMira('—')
    setTheo('—')
  }

  useEffect(() => {
    reset()
    return () => cancelAnimationFrame(animRef.current)
  }, [])

  const play = () => {
    reset()
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const tMira = (MID - XL) / C // both flashes reach Mira together
    const tTheoR = (XR - MID) / (C + V) // front flash meets Theo head-on
    const tTheoL = (MID - XL) / (C - V) // rear flash has to catch him
    if (reduced) {
      setMira('“Simultaneous.”')
      setTheo('“Front first, rear later.”')
      setStatus('Same light, same speed — different verdicts on “at the same time.”')
      waveLRef.current?.setAttribute('opacity', 0.9)
      waveRRef.current?.setAttribute('opacity', 0.9)
      waveLRef.current?.setAttribute('r', 205)
      waveRRef.current?.setAttribute('r', 205)
      trainRef.current?.setAttribute('transform', `translate(${MID + V * 1.2},0)`)
      return
    }
    const start = performance.now()
    let doneMira = false
    let doneTheoR = false
    let doneTheoL = false
    setStatus('Flashes expanding at c…')
    const step = (now) => {
      const t = (now - start) / 1000
      const boltFade = t < 0.35 ? 1 - t / 0.35 : 0
      boltLRef.current?.setAttribute('opacity', boltFade)
      boltRRef.current?.setAttribute('opacity', boltFade)
      const r = Math.min(C * t, 320)
      waveLRef.current?.setAttribute('opacity', 0.9)
      waveRRef.current?.setAttribute('opacity', 0.9)
      waveLRef.current?.setAttribute('r', r)
      waveRRef.current?.setAttribute('r', r)
      trainRef.current?.setAttribute('transform', `translate(${MID + V * t},0)`)
      if (!doneMira && t >= tMira) {
        doneMira = true
        setMira('“Simultaneous.”')
      }
      if (!doneTheoR && t >= tTheoR) {
        doneTheoR = true
        setTheo('“Front flash first…”')
      }
      if (!doneTheoL && t >= tTheoL) {
        doneTheoL = true
        setTheo('“Front first, rear later.”')
        setStatus('Same light, same speed — different verdicts on “at the same time.”')
      }
      if (t < tTheoL + 0.9) animRef.current = requestAnimationFrame(step)
    }
    animRef.current = requestAnimationFrame(step)
  }

  return (
    <Plate fig="Fig. 2" title="Two lightning strikes, one train" tag="Simultaneity">
      <p className="caption">
        Lightning strikes both ends of a moving train. <b>Mira</b> stands on the platform,
        midway between the scorch marks. <b>Theo</b> sits at the train's midpoint, gliding
        right. Press play and watch each flash spread outward at c.
      </p>
      <div className="controls">
        <button className="btn" onClick={play}>
          ▶ Strike the lightning
        </button>
        <span className="readout">{status}</span>
      </div>
      <svg viewBox="0 0 640 190" width="100%" aria-hidden="true" style={{ maxHeight: 200 }}>
        <line x1="10" y1="150" x2="630" y2="150" stroke="rgba(233,238,247,.4)" strokeWidth="1.5" />
        <g ref={trainRef}>
          <rect x="-180" y="96" width="360" height="42" rx="4" fill="none" stroke="#E9EEF7" strokeWidth="1.6" />
          <circle cx="-150" cy="144" r="7" fill="none" stroke="#E9EEF7" strokeWidth="1.4" />
          <circle cx="150" cy="144" r="7" fill="none" stroke="#E9EEF7" strokeWidth="1.4" />
          <circle cx="0" cy="117" r="7" fill="#E9EEF7" />
          <text x="0" y="90" fill="#8B97B0" fontSize="11" textAnchor="middle">
            THEO (TRAIN)
          </text>
        </g>
        <circle cx="320" cy="164" r="7" fill="#E9EEF7" />
        <text x="320" y="184" fill="#8B97B0" fontSize="11" textAnchor="middle">
          MIRA (PLATFORM)
        </text>
        <g ref={boltLRef} opacity="0">
          <path d="M118 20 l-8 26 h10 l-9 30" stroke="#FFC46B" strokeWidth="2.5" fill="none" />
        </g>
        <g ref={boltRRef} opacity="0">
          <path d="M522 20 l-8 26 h10 l-9 30" stroke="#FFC46B" strokeWidth="2.5" fill="none" />
        </g>
        <circle ref={waveLRef} cx={XL} cy="150" r="0" fill="none" stroke="#FFC46B" strokeWidth="1.8" opacity="0" />
        <circle ref={waveRRef} cx={XR} cy="150" r="0" fill="none" stroke="#FFC46B" strokeWidth="1.8" opacity="0" />
      </svg>
      <div className="duo">
        <div className="verdict live">
          <h5>Mira's report</h5>
          <div className="big">{mira}</div>
          <small>standing midway between the strikes</small>
        </div>
        <div className="verdict live">
          <h5>Theo's report</h5>
          <div className="big">{theo}</div>
          <small>riding toward one flash, away from the other</small>
        </div>
      </div>
      <p className="caption" style={{ marginTop: 18 }}>
        <b>Neither is wrong.</b> Given the two postulates, “at the same time” genuinely
        depends on how you move. There is no master clock — the universe simply doesn't keep
        one. This is the demolition of Newton's absolute time.
      </p>
    </Plate>
  )
}
