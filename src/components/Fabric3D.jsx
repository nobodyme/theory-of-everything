import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import Plate from './Plate.jsx'

const EXT = 24 // half-extent of the fabric
const DIV = 48 // grid divisions
const ORBIT_R = 13
const PHOTON_SPEED = 15
const BEND_K = 340 // strength of light-bending toward the mass

const warpY = (x, z, m) => {
  const s2 = 2 * 6.2 * 6.2
  return -m * 11 * Math.exp(-(x * x + z * z) / s2)
}

const massLabel = (m) =>
  m < 0.05
    ? 'empty space — flat, Euclid is happy'
    : m < 0.35
      ? 'moon-grade dent'
      : m < 0.7
        ? 'planet-grade dent — orbits tighten'
        : 'star-grade dent — watch the light ray curve'

export default function Fabric3D() {
  const mountRef = useRef(null)
  const massRef = useRef(0.45)
  const renderOnceRef = useRef(null)
  const [mass, setMass] = useState(45)

  useEffect(() => {
    massRef.current = mass / 100
    renderOnceRef.current?.()
  }, [mass])

  useEffect(() => {
    const mount = mountRef.current
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const W = () => mount.clientWidth || 800
    const H = () => Math.round(Math.min(540, Math.max(360, W() * 0.56)))

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio))
    renderer.setSize(W(), H())
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(46, W() / H(), 0.1, 300)

    // --- the fabric: a grid of line segments we displace by hand
    const segs = []
    const step = (EXT * 2) / DIV
    for (let i = 0; i <= DIV; i++) {
      const a = -EXT + i * step
      for (let j = 0; j < DIV; j++) {
        const b0 = -EXT + j * step
        const b1 = b0 + step
        segs.push(a, 0, b0, a, 0, b1) // line parallel to z
        segs.push(b0, 0, a, b1, 0, a) // line parallel to x
      }
    }
    const gridPos = new Float32Array(segs)
    const gridGeo = new THREE.BufferGeometry()
    gridGeo.setAttribute('position', new THREE.BufferAttribute(gridPos, 3))
    const grid = new THREE.LineSegments(
      gridGeo,
      new THREE.LineBasicMaterial({ color: 0x8fa5cc, transparent: true, opacity: 0.38 })
    )
    scene.add(grid)

    let warpedFor = -1
    function applyWarp(m) {
      if (m === warpedFor) return
      warpedFor = m
      for (let i = 0; i < gridPos.length; i += 3) {
        gridPos[i + 1] = warpY(gridPos[i], gridPos[i + 2], m)
      }
      gridGeo.attributes.position.needsUpdate = true
    }

    // --- central mass with glow
    const star = new THREE.Mesh(
      new THREE.SphereGeometry(1, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xffc46b })
    )
    scene.add(star)
    const glowCanvas = document.createElement('canvas')
    glowCanvas.width = glowCanvas.height = 128
    const gctx = glowCanvas.getContext('2d')
    const gg = gctx.createRadialGradient(64, 64, 0, 64, 64, 64)
    gg.addColorStop(0, 'rgba(255,206,130,0.85)')
    gg.addColorStop(0.4, 'rgba(255,196,107,0.25)')
    gg.addColorStop(1, 'rgba(255,196,107,0)')
    gctx.fillStyle = gg
    gctx.fillRect(0, 0, 128, 128)
    const glow = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: new THREE.CanvasTexture(glowCanvas),
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    )
    scene.add(glow)

    // --- orbiting planet + its path
    const planet = new THREE.Mesh(
      new THREE.SphereGeometry(0.55, 24, 24),
      new THREE.MeshBasicMaterial({ color: 0xdfe8f6 })
    )
    scene.add(planet)
    const ORBIT_N = 128
    const orbitPos = new Float32Array(ORBIT_N * 3)
    const orbitGeo = new THREE.BufferGeometry()
    orbitGeo.setAttribute('position', new THREE.BufferAttribute(orbitPos, 3))
    const orbitLine = new THREE.LineLoop(
      orbitGeo,
      new THREE.LineBasicMaterial({ color: 0xffc46b, transparent: true, opacity: 0.22 })
    )
    scene.add(orbitLine)
    function layOrbit(m) {
      const y = warpY(ORBIT_R, 0, m) + 0.55
      for (let i = 0; i < ORBIT_N; i++) {
        const a = (i / ORBIT_N) * Math.PI * 2
        orbitPos[i * 3] = Math.cos(a) * ORBIT_R
        orbitPos[i * 3 + 1] = y
        orbitPos[i * 3 + 2] = Math.sin(a) * ORBIT_R
      }
      orbitGeo.attributes.position.needsUpdate = true
    }

    // --- a ray of light crossing the fabric, bending near the mass
    const TRAIL_N = 260
    const trailPts = []
    const trailPos = new Float32Array(TRAIL_N * 3)
    const trailGeo = new THREE.BufferGeometry()
    trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPos, 3))
    trailGeo.setDrawRange(0, 0)
    const trail = new THREE.Line(
      trailGeo,
      new THREE.LineBasicMaterial({
        color: 0xffd68f,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending,
      })
    )
    scene.add(trail)
    const photonHead = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: glow.material.map,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    )
    photonHead.scale.setScalar(2.4)
    scene.add(photonHead)

    const photon = { x: 0, z: 0, vx: 0, vz: 0 }
    function resetPhoton() {
      photon.x = -EXT - 2
      photon.z = 6.5
      photon.vx = PHOTON_SPEED
      photon.vz = 0
      trailPts.length = 0
      trailGeo.setDrawRange(0, 0)
    }
    resetPhoton()

    function stepPhoton(dt, m) {
      const r2 = photon.x * photon.x + photon.z * photon.z
      const r = Math.sqrt(r2)
      if (m > 0.01 && r > 0.001) {
        const acc = (BEND_K * m) / r2
        photon.vx -= ((acc * photon.x) / r) * dt
        photon.vz -= ((acc * photon.z) / r) * dt
        const sp = Math.hypot(photon.vx, photon.vz)
        photon.vx = (photon.vx / sp) * PHOTON_SPEED // light never changes speed
        photon.vz = (photon.vz / sp) * PHOTON_SPEED
      }
      photon.x += photon.vx * dt
      photon.z += photon.vz * dt
      const swallowed = r < 0.6 + m * 2.0
      if (swallowed || Math.abs(photon.x) > EXT + 3 || Math.abs(photon.z) > EXT + 3) {
        resetPhoton()
        return
      }
      const y = warpY(photon.x, photon.z, m) + 0.3
      trailPts.push([photon.x, y, photon.z])
      if (trailPts.length > TRAIL_N) trailPts.shift()
      for (let i = 0; i < trailPts.length; i++) {
        trailPos[i * 3] = trailPts[i][0]
        trailPos[i * 3 + 1] = trailPts[i][1]
        trailPos[i * 3 + 2] = trailPts[i][2]
      }
      trailGeo.attributes.position.needsUpdate = true
      trailGeo.setDrawRange(0, trailPts.length)
      photonHead.position.set(photon.x, y, photon.z)
    }

    // --- camera: gentle auto-orbit, drag to steer
    let theta = 0.62
    let phi = 1.02
    let targetTheta = theta
    let targetPhi = phi
    const RADIUS = 43
    let dragging = false
    let lastPointer = null
    let lastInteraction = -10

    function placeCamera() {
      theta += (targetTheta - theta) * 0.08
      phi += (targetPhi - phi) * 0.08
      camera.position.set(
        RADIUS * Math.sin(phi) * Math.cos(theta),
        RADIUS * Math.cos(phi),
        RADIUS * Math.sin(phi) * Math.sin(theta)
      )
      camera.lookAt(0, -2.5, 0)
    }

    const el = renderer.domElement
    const onDown = (e) => {
      dragging = true
      lastPointer = [e.clientX, e.clientY]
      lastInteraction = performance.now() / 1000
      el.setPointerCapture?.(e.pointerId)
    }
    const onMove = (e) => {
      if (!dragging) return
      const dx = e.clientX - lastPointer[0]
      const dy = e.clientY - lastPointer[1]
      lastPointer = [e.clientX, e.clientY]
      targetTheta += dx * 0.006
      targetPhi = Math.min(1.32, Math.max(0.38, targetPhi - dy * 0.005))
      lastInteraction = performance.now() / 1000
      if (reduced) renderOnce()
    }
    const onUp = () => {
      dragging = false
      lastPointer = null
    }
    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerup', onUp)
    el.addEventListener('pointercancel', onUp)

    // --- scene state per frame
    let planetAng = 0
    function updateScene(dt) {
      const m = massRef.current
      applyWarp(m)
      layOrbit(m)
      star.scale.setScalar(Math.max(0.001, 0.5 + m * 2.0))
      star.position.y = warpY(0, 0, m) * 0.12
      star.visible = m > 0.03
      glow.position.copy(star.position)
      glow.scale.setScalar(3 + m * 13)
      glow.material.opacity = m > 0.03 ? 0.9 : 0
      planetAng += dt * (0.18 + m * 1.15) // deeper well, faster orbit — Kepler recovered
      const py = warpY(ORBIT_R, 0, m) + 0.55
      planet.position.set(Math.cos(planetAng) * ORBIT_R, py, Math.sin(planetAng) * ORBIT_R)
      if (dt > 0) {
        const sub = Math.ceil((PHOTON_SPEED * dt) / 0.35)
        for (let s = 0; s < sub; s++) stepPhoton(dt / sub, m)
      }
    }

    function renderOnce() {
      updateScene(0)
      theta = targetTheta
      phi = targetPhi
      placeCamera()
      renderer.render(scene, camera)
    }
    renderOnceRef.current = renderOnce

    let raf = 0
    let last = performance.now()
    function frame(now) {
      raf = requestAnimationFrame(frame)
      if (document.hidden) return
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (!dragging && now / 1000 - lastInteraction > 2.5) {
        targetTheta += dt * 0.05
      }
      updateScene(dt)
      placeCamera()
      renderer.render(scene, camera)
    }

    if (reduced) {
      planetAng = 0.8
      renderOnce()
    } else {
      raf = requestAnimationFrame(frame)
    }

    const ro = new ResizeObserver(() => {
      renderer.setSize(W(), H())
      camera.aspect = W() / H()
      camera.updateProjectionMatrix()
      if (reduced) renderOnce()
    })
    ro.observe(mount)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerup', onUp)
      el.removeEventListener('pointercancel', onUp)
      renderOnceRef.current = null
      renderer.dispose()
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose()
        if (o.material) {
          if (o.material.map) o.material.map.dispose()
          o.material.dispose()
        }
      })
      if (el.parentNode === mount) mount.removeChild(el)
    }
  }, [])

  return (
    <Plate fig="Fig. 5" title="Mass tells spacetime how to curve" tag="General relativity">
      <p className="caption">
        Space and time form one flexible fabric. Mass dents it; things moving through the
        dent follow curved paths — which we experience as gravity. Load the fabric with the
        slider, then <b>drag the scene</b> to look around. The amber streak is a ray of
        light: watch what the dent does to it.
      </p>
      <div className="controls">
        <label htmlFor="massV">Mass</label>
        <input
          type="range"
          id="massV"
          min="0"
          max="100"
          value={mass}
          onChange={(e) => setMass(+e.target.value)}
          aria-label="Mass of the central body"
        />
        <span className="readout">
          <b>{massLabel(mass / 100)}</b>
        </span>
      </div>
      <div className="fabric-mount" ref={mountRef}>
        <span className="fabric-hint">Drag to orbit the scene</span>
      </div>
      <p className="caption" style={{ marginTop: 16 }}>
        The payoff was immediate: the equations predicted Mercury's mysterious 43-arcsecond
        drift — <b>the crack in Newton's file since 1859</b> — with no tuning at all.
        Einstein said the discovery gave him heart palpitations.
      </p>
    </Plate>
  )
}
