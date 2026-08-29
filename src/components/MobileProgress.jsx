import { useEffect, useRef } from 'react'

// Wayfinding fallback for viewports where the chapter rail is hidden:
// a thin photon progress bar plus the current chapter label.
export default function MobileProgress({ chapter }) {
  const barRef = useRef(null)

  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0
      if (barRef.current) barRef.current.style.width = `${(p * 100).toFixed(2)}%`
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div className="mprog" aria-hidden="true">
      <div className="mprog-bar" ref={barRef} />
      <div className="mprog-label">
        <span className="amber">{chapter.year}</span> · {chapter.label}
      </div>
    </div>
  )
}
