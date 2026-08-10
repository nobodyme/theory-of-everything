import { useEffect, useState } from 'react'
import Starfield from './components/Starfield.jsx'
import Hero from './components/Hero.jsx'
import Prologue from './components/Prologue.jsx'
import Inheritance from './components/Inheritance.jsx'
import Contradiction from './components/Contradiction.jsx'
import TheMove from './components/TheMove.jsx'
import Gravity from './components/Gravity.jsx'
import Ledger from './components/Ledger.jsx'
import Footer from './components/Footer.jsx'

const CHAPTERS = [
  { id: 'hero', label: 'Bern', year: '1905' },
  { id: 'prologue', label: 'The Clerk', year: '1902' },
  { id: 'inheritance', label: 'The Shelf', year: '1687' },
  { id: 'contradiction', label: 'The Chase', year: '1895' },
  { id: 'move', label: 'The Move', year: '1905' },
  { id: 'gravity', label: 'Gravity', year: '1915' },
  { id: 'ledger', label: 'The Ledger', year: '1919' },
]

export default function App() {
  const [active, setActive] = useState('hero')

  // reveal-on-scroll for everything tagged .reveal
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('on')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  // scroll-spy for the chapter rail + ghost year
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-42% 0px -42% 0px' }
    )
    CHAPTERS.forEach((c) => {
      const el = document.getElementById(c.id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  const activeChapter = CHAPTERS.find((c) => c.id === active) ?? CHAPTERS[0]

  return (
    <>
      <Starfield />
      <div className="ghost-year" key={activeChapter.year} aria-hidden="true">
        {activeChapter.year}
      </div>
      <nav className="rail" aria-label="Chapters">
        {CHAPTERS.map((c) => (
          <a key={c.id} href={`#${c.id}`} className={active === c.id ? 'on' : ''}>
            <span className="rail-yr">{c.year}</span> {c.label}
          </a>
        ))}
      </nav>
      <main>
        <Hero />
        <Prologue />
        <Inheritance />
        <Contradiction />
        <TheMove />
        <Gravity />
        <Ledger />
        <Footer />
      </main>
      <div className="grain" aria-hidden="true" />
    </>
  )
}
