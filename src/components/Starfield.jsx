import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// Fixed full-page background: layered drifting starfields, a faint nebula,
// occasional shooting stars. Parallax follows the pointer and scroll.
export default function Starfield() {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true })
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio))
    renderer.setSize(window.innerWidth, window.innerHeight)
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      600
    )
    camera.position.z = 80

    const rand = (a, b) => a + Math.random() * (b - a)

    // soft round dot — default points render as hard squares
    const dotCanvas = document.createElement('canvas')
    dotCanvas.width = dotCanvas.height = 64
    const dctx = dotCanvas.getContext('2d')
    const dg = dctx.createRadialGradient(32, 32, 0, 32, 32, 32)
    dg.addColorStop(0, 'rgba(255,255,255,1)')
    dg.addColorStop(0.35, 'rgba(255,255,255,0.55)')
    dg.addColorStop(1, 'rgba(255,255,255,0)')
    dctx.fillStyle = dg
    dctx.fillRect(0, 0, 64, 64)
    const dotTex = new THREE.CanvasTexture(dotCanvas)

    function makeStars(count, { size, color, opacity, spread, depth }) {
      const pos = new Float32Array(count * 3)
      for (let i = 0; i < count; i++) {
        pos[i * 3] = rand(-spread, spread)
        pos[i * 3 + 1] = rand(-spread * 0.7, spread * 0.7)
        pos[i * 3 + 2] = rand(-depth, 30)
      }
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      const mat = new THREE.PointsMaterial({
        size,
        color,
        map: dotTex,
        transparent: true,
        opacity,
        sizeAttenuation: true,
        depthWrite: false,
      })
      return new THREE.Points(geo, mat)
    }

    const farStars = makeStars(1500, {
      size: 1.3, color: 0xbfcbe2, opacity: 0.7, spread: 240, depth: 260,
    })
    const nearStars = makeStars(320, {
      size: 2.6, color: 0xe9eef7, opacity: 0.85, spread: 200, depth: 160,
    })
    const amberStars = makeStars(85, {
      size: 3.2, color: 0xffc46b, opacity: 0.75, spread: 210, depth: 180,
    })
    scene.add(farStars, nearStars, amberStars)

    // nebula: soft radial-gradient sprites
    function glowTexture(inner, outer) {
      const c = document.createElement('canvas')
      c.width = c.height = 256
      const ctx = c.getContext('2d')
      const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
      g.addColorStop(0, inner)
      g.addColorStop(1, outer)
      ctx.fillStyle = g
      ctx.fillRect(0, 0, 256, 256)
      return new THREE.CanvasTexture(c)
    }
    const nebulaMat = (tex, opacity) =>
      new THREE.SpriteMaterial({
        map: tex,
        transparent: true,
        opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    const neb1 = new THREE.Sprite(
      nebulaMat(glowTexture('rgba(38,58,110,0.55)', 'rgba(38,58,110,0)'), 0.5)
    )
    neb1.position.set(-70, 30, -120)
    neb1.scale.setScalar(260)
    const neb2 = new THREE.Sprite(
      nebulaMat(glowTexture('rgba(120,84,40,0.4)', 'rgba(120,84,40,0)'), 0.34)
    )
    neb2.position.set(90, -40, -140)
    neb2.scale.setScalar(220)
    scene.add(neb1, neb2)

    // shooting star: a short bright line that streaks across occasionally
    const shootGeo = new THREE.BufferGeometry()
    shootGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3))
    const shootMat = new THREE.LineBasicMaterial({
      color: 0xffe3b0,
      transparent: true,
      opacity: 0,
    })
    const shoot = new THREE.Line(shootGeo, shootMat)
    scene.add(shoot)
    let shootState = null
    let nextShootAt = 4 + Math.random() * 6

    function spawnShoot() {
      const x = rand(-90, 90)
      const y = rand(10, 55)
      const dx = rand(-1, -0.5) * 90
      const dy = rand(-0.5, -0.2) * 90
      shootState = { x, y, dx, dy, t: 0, life: rand(0.7, 1.1) }
    }

    const pointer = { x: 0, y: 0 }
    const onPointer = (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onPointer, { passive: true })

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    let raf = 0
    let last = performance.now()
    let elapsed = 0

    function frame(now) {
      raf = requestAnimationFrame(frame)
      if (document.hidden) return
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      elapsed += dt

      farStars.rotation.y += dt * 0.0035
      nearStars.rotation.y += dt * 0.006
      amberStars.rotation.y += dt * 0.0048
      neb1.position.x += Math.sin(elapsed * 0.05) * 0.02
      neb2.position.y += Math.cos(elapsed * 0.04) * 0.015

      // parallax: pointer + scroll depth
      const scrollN =
        window.scrollY /
        Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      camera.position.x += (pointer.x * 5 - camera.position.x) * 0.03
      camera.position.y += (-pointer.y * 3 - scrollN * 14 - camera.position.y) * 0.03
      camera.lookAt(0, camera.position.y * 0.6, 0)

      // shooting stars
      if (!shootState) {
        nextShootAt -= dt
        if (nextShootAt <= 0) {
          spawnShoot()
          nextShootAt = 6 + Math.random() * 9
        }
      } else {
        shootState.t += dt
        const p = shootState.t / shootState.life
        if (p >= 1) {
          shootState = null
          shootMat.opacity = 0
        } else {
          const hx = shootState.x + shootState.dx * p
          const hy = shootState.y + shootState.dy * p
          const tail = 0.12
          const a = shootGeo.attributes.position.array
          a[0] = hx - shootState.dx * tail
          a[1] = hy - shootState.dy * tail
          a[2] = -60
          a[3] = hx
          a[4] = hy
          a[5] = -60
          shootGeo.attributes.position.needsUpdate = true
          shootMat.opacity = Math.sin(p * Math.PI) * 0.9
        }
      }

      renderer.render(scene, camera)
    }

    if (reduced) {
      renderer.render(scene, camera)
    } else {
      raf = requestAnimationFrame(frame)
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose()
        if (o.material) {
          if (o.material.map) o.material.map.dispose()
          o.material.dispose()
        }
      })
      mount.removeChild(renderer.domElement)
    }
  }, [])

  return <div id="bg-stars" ref={mountRef} aria-hidden="true" />
}
