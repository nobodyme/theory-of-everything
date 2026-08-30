import { useState } from 'react'

const DOSSIERS = [
  {
    yr: '1632',
    who: "Galileo — the ship's cabin",
    gave: (
      <p>
        Locked below deck on a smoothly sailing ship, no experiment with dripping water or
        thrown balls can tell you whether the ship is moving or docked. The laws of{' '}
        <b>mechanics</b> — pushing, falling, bouncing — look identical in any steadily moving
        room. Physicists call this the <b>principle of relativity</b>, and it was already
        old.
      </p>
    ),
    crack: (
      <p>
        Galileo only claimed this for mechanics. Nobody knew whether it also held for the
        newer physics of electricity, magnetism, and light. That open question is where
        everything breaks.
      </p>
    ),
  },
  {
    yr: '1687',
    who: 'Newton — the clockwork universe',
    gave: (
      <p>
        Three laws of motion plus universal gravitation. Speeds simply add: walk at 5 km/h
        inside a train doing 100 km/h, and the ground sees 105 km/h. Behind it all, Newton
        assumed <b>absolute time</b> (one master clock for the universe) and{' '}
        <b>absolute space</b> (a fixed stage). It predicted planets and cannonballs superbly
        for two centuries.
      </p>
    ),
    crack: (
      <p>
        Since 1859, astronomers knew Mercury's orbit drifts by a tiny amount Newton's
        gravity cannot explain — Le Verrier clocked it near 38 seconds of arc per century;
        by 1882 the books settled on 43. A small, stubborn, unexplained residue. Remember
        it; it returns at the end.
      </p>
    ),
  },
  {
    yr: '1865',
    who: 'Maxwell — light appears in his equations',
    gave: (
      <p>
        His equations — later distilled to the famous four — unified electricity and
        magnetism, and out of the mathematics dropped a wave traveling at exactly{' '}
        <b>c ≈ 300,000 km/s</b>. That was the measured speed of light. Conclusion: light{' '}
        <b>is</b> an electromagnetic wave. Einstein studied these equations obsessively at
        university, partly outside the official syllabus.
      </p>
    ),
    crack: (
      <p>
        The equations state one speed, c — but speed <b>relative to what?</b> Physicists
        had an answer waiting, decades older than Maxwell: light is a wave, and a wave —
        like sound in air — surely needs a medium. So c must be light's speed relative to
        that long-assumed medium, the “luminiferous ether.” Which meant the ether could, in
        principle, be detected. So they tried.
      </p>
    ),
  },
  {
    yr: '1887',
    who: 'Michelson & Morley — the failed experiment',
    gave: (
      <p>
        Earth orbits the Sun at 30 km/s, so it should plow through the ether like a car
        through air — and light should travel slightly faster “downwind” than “upwind.”
        Michelson and Morley built an exquisitely sensitive instrument to catch that
        difference.
      </p>
    ),
    crack: (
      <p>
        They found <b>nothing</b>. No ether wind, whichever way they turned the instrument,
        morning or evening — and every later repetition, season after season, agreed.
        Light's speed came out the same every time. One of the most famous null results in
        science — and in 1905 it was still an open wound in physics.
      </p>
    ),
  },
  {
    yr: '1889–1904',
    who: 'Lorentz & FitzGerald — the patch',
    gave: (
      <p>
        To save the ether, FitzGerald (1889) and Lorentz (1892) proposed that objects moving
        through it physically <b>shrink</b> in the direction of motion — by just the right
        amount to hide the ether wind. Lorentz built out the mathematics in stages, complete
        by 1904: the <b>Lorentz transformations</b>. The equations Einstein would need{' '}
        <b>already existed</b>.
      </p>
    ),
    crack: (
      <p>
        It worked as arithmetic but felt like a conspiracy: nature contorting itself
        precisely so we can never detect the ether. Why would the universe hide its own
        scaffolding? The math was right; the story around it was wrong.
      </p>
    ),
  },
  {
    yr: '1883–1902',
    who: 'Mach, Poincaré & the philosophers',
    gave: (
      <p>
        How did a patent clerk know all this? Reading. Ernst Mach's book attacked Newton's
        “absolute space” as meaningless metaphysics. Poincaré openly asked whether “two
        events are simultaneous” even has an absolute meaning. Einstein devoured both in the
        Olympia Academy, alongside the philosopher Hume — who taught him to distrust concepts
        nobody can actually measure.
      </p>
    ),
    crack: (
      <p>
        The critics could smell that absolute time and space were rotten — but none of them
        made the final move. The demolition was ready; nobody had lit the fuse.
      </p>
    ),
  },
]

function Dossier({ d, open, onToggle }) {
  return (
    <article className={`dossier${open ? ' open' : ''}`}>
      <button className="dossier-head" onClick={onToggle} aria-expanded={open}>
        <span className="dossier-yr">{d.yr}</span>
        <span className="dossier-who">{d.who}</span>
        <span className="dossier-plus" aria-hidden="true">
          +
        </span>
      </button>
      <div className="dossier-body">
        <div>
          <div className="dossier-cols">
            <div className="gave">
              <div className="colhead">What it established</div>
              {d.gave}
            </div>
            <div className="crack">
              <div className="colhead">The crack</div>
              {d.crack}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

export default function Inheritance() {
  const [openIdx, setOpenIdx] = useState(0)
  return (
    <section className="chapter" id="inheritance">
      <div className="wrap">
        <div className="reveal">
          <div className="eyebrow">
            <span className="chno">Chapter I</span> The inheritance · 1632–1902
          </div>
          <h2>
            The shelf he <em>inherited</em>
          </h2>
          <p className="lede">
            Everything below was public knowledge — the standard equipment of a well-read
            physicist of 1905. Open each file: what it established, and the crack running
            through it.
          </p>
        </div>
        <div className="dossier-stack reveal">
          {DOSSIERS.map((d, i) => (
            <Dossier
              key={d.yr}
              d={d}
              open={openIdx === i}
              onToggle={() => setOpenIdx(openIdx === i ? -1 : i)}
            />
          ))}
        </div>
        <p className="note reveal">
          <strong>The point:</strong> every ingredient — the relativity principle, the
          constancy of c, even the transformation equations — was already published. What was
          missing was someone willing to take two of those facts{' '}
          <b>literally at the same time</b>, and let absolute time die.
        </p>
      </div>
    </section>
  )
}
