export default function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="wrap">
        <div className="hero-kicker">
          <span>Bern, Switzerland</span>
          <span className="sep" aria-hidden="true">
            ·
          </span>
          <span className="amber">June 1905</span>
          <span className="sep" aria-hidden="true">
            ·
          </span>
          <span>Swiss Federal Patent Office</span>
        </div>
        <h1>
          <span className="h1-line">
            <span className="h1-inner">What Einstein</span>
          </span>
          <span className="h1-line">
            <span className="h1-inner amber">already knew.</span>
          </span>
        </h1>
        <p className="hero-sub">
          Relativity was not conjured from nothing. It was assembled — from{' '}
          <b>a 270-year-old idea about ships</b>, <b>four famous equations about light</b>,{' '}
          <b>one experiment that kept failing</b>, and a day job in a patent office awash in
          schemes for <b>synchronizing railway clocks</b>. This is the story of the inputs,
          the contradiction, and the move.
        </p>
      </div>
      <div className="hero-cue">
        <span className="cue-line" />
        <span>Scroll — the story runs 1632 → 1919</span>
      </div>
    </section>
  )
}
