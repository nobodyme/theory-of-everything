import Elevator from './Elevator.jsx'
import Fabric3D from './Fabric3D.jsx'

export default function Gravity() {
  return (
    <section className="chapter" id="gravity">
      <div className="wrap">
        <div className="reveal">
          <div className="eyebrow">
            <span className="chno">Chapter IV</span> The ten-year sequel · 1907–1915
          </div>
          <h2>
            Then he came <em>for gravity</em>
          </h2>
          <p className="lede">
            Special relativity had one glaring omission: Newton's gravity acted instantly
            across space, which the new physics forbade — nothing outruns light, not even a
            force. In 1907, still at the patent office, Einstein had what he called{' '}
            <i>the happiest thought of my life</i>: a person falling freely does not feel
            their own weight.
          </p>
        </div>

        <Elevator />

        <div className="prose reveal" style={{ marginTop: 48 }}>
          <p>
            Turning that hunch into equations took eight more years and mathematics Einstein
            didn't yet own — the curved-surface geometry of Riemann, which his university
            friend <b>Marcel Grossmann</b> helped him learn. (Even here: existing knowledge,
            borrowed and repurposed.) The result, November 1915: the field equations of
            general relativity.
          </p>
        </div>

        <Fabric3D />

        <div className="stat-line reveal">
          <div className="stat">
            <div className="sv">43″</div>
            <div className="sl">Mercury's unexplained drift per century — nailed by the equations, untuned</div>
          </div>
          <div className="stat">
            <div className="sv">8 yrs</div>
            <div className="sl">From the happiest thought to the field equations</div>
          </div>
          <div className="stat">
            <div className="sv">1.75″</div>
            <div className="sl">Predicted bending of starlight grazing the Sun</div>
          </div>
        </div>

        <div className="eclipse-scene reveal">
          <div className="eclipse-disc" aria-hidden="true" />
          <div className="eclipse-copy">
            <div className="nyt-sub">The New York Times · November 10, 1919</div>
            <div className="nyt">Lights all askew in the heavens</div>
            <p>
              <b>May 1919.</b> The theory's boldest prediction: starlight grazing the Sun
              should bend by a precise, tiny angle. Arthur Eddington photographed stars
              beside the eclipsed Sun — and they had shifted, by Einstein's amount.
              Overnight, a patent clerk's rebuild of space and time became front-page news
              worldwide.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
