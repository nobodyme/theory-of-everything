# What Einstein Already Knew

An interactive visual history of the inputs behind relativity — what information
existed in the world before 1905, how Einstein encountered it, and how he
assembled it into special and general relativity. Written for readers with
high-school physics.

The story runs 1632 → 1919 as a cinematic scroll:

- **Prologue** — the patent clerk, the Olympia Academy, and a day job judging
  clock-synchronization patents
- **Chapter I** — the shelf he inherited: Galileo, Newton, Maxwell,
  Michelson–Morley, Lorentz, Mach & Poincaré, as archival dossiers
- **Chapter II** — chasing a beam of light: Newton vs. Maxwell, live
- **Chapter III** — the two postulates, the relativity of simultaneity, the
  light clock (γ computed live), and E = mc²
- **Chapter IV** — the equivalence principle elevator and an interactive 3D
  spacetime fabric (Three.js) with an orbiting planet and a bending light ray
- **Chapter V** — the ledger: what he knew → what it became

All interactive figures use the real formulas — the γ readout, simultaneity
timings, and orbital speeds are computed, not illustrated.

## Stack

React 18 + Vite + Three.js. Typography: Fraunces, Newsreader, IBM Plex Mono
(self-hosted via Fontsource).

## Develop

```bash
npm install
npm run dev        # local dev server
npm run build      # production build → dist/
npm run build:single   # self-contained single-file build → dist-single/
```
