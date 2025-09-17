"use client"

import React, { useEffect, useRef, useState, useMemo } from "react"
import { MeshGradient } from "@paper-design/shaders-react"

interface ShaderBackgroundProps {
  children: React.ReactNode
}

export default function ShaderBackground({ children }: ShaderBackgroundProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const rafRef2 = useRef<number | null>(null)
  const probeRafRef = useRef<number | null>(null)
  const timeouts = useRef<number[]>([])

  const [isActive, setIsActive] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [lowPerf, setLowPerf] = useState(false)
  const [renderScale, setRenderScale] = useState(1)

  // controls when shaders mount (starts false so fallback paints first)
  const [shadersAllowed, setShadersAllowed] = useState(false)
  // enable heavy second layer later to avoid LCP impacts
  const [enableLayerB, setEnableLayerB] = useState(false)

  // debounced mobile detection
  useEffect(() => {
    let t: number | null = null
    const check = () => setIsMobile(window.innerWidth < 768)
    const onResize = () => {
      if (t) window.clearTimeout(t)
      t = window.setTimeout(() => {
        check()
        t = null
      }, 150)
    }
    check()
    window.addEventListener("resize", onResize, { passive: true })
    return () => window.removeEventListener("resize", onResize)
  }, [])

  // reduced motion
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  }, [])

  // staged mount + conservative probe
  useEffect(() => {
    // quick hardware heuristic: immediate low-perf for very weak devices
    const cores = navigator.hardwareConcurrency || 2
    const deviceMemory = (navigator as any).deviceMemory || 0
    if (cores <= 4 || (deviceMemory && deviceMemory <= 2)) {
      setLowPerf(true)
      setRenderScale(0.5)
      setShadersAllowed(false)
      return
    }

    if (prefersReducedMotion) {
      // respect reduced motion: keep fallback, no shaders
      setLowPerf(true)
      setShadersAllowed(false)
      return
    }

    // Ensure fallback paints first: double rAF before mounting shaders
    rafRef.current = requestAnimationFrame(() => {
      rafRef2.current = requestAnimationFrame(() => {
        // allow shaders to mount now (image has painted)
        setShadersAllowed(true)

        // enable heavy second layer after a delay (prevents LCP waiting)
        timeouts.current.push(window.setTimeout(() => setEnableLayerB(true), 900))

        // give shader a short warm-up then run a longer probe
        timeouts.current.push(
          window.setTimeout(() => {
            let frames = 0
            const probeStart = performance.now()
            function probe(ts: number) {
              frames++
              if (ts - probeStart < 1600) {
                probeRafRef.current = requestAnimationFrame(probe)
              } else {
                const duration = ts - probeStart
                const fps = frames / (duration / 1000)
                // relaxed threshold: only disable shaders on sustained very low fps
                if (fps < 28) {
                  setLowPerf(true)
                  setRenderScale(0.5)
                  setShadersAllowed(false)
                  setEnableLayerB(false)
                } else {
                  setLowPerf(false)
                  setRenderScale(1)
                }
              }
            }
            probeRafRef.current = requestAnimationFrame(probe)
          }, 500) // warm-up before probing
        )
      })
    })

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      if (rafRef2.current) cancelAnimationFrame(rafRef2.current)
      if (probeRafRef.current) cancelAnimationFrame(probeRafRef.current)
      timeouts.current.forEach((id) => clearTimeout(id))
      timeouts.current = []
    }
  }, [prefersReducedMotion])

  // mouse enter/leave only on capable devices
  useEffect(() => {
    const container = containerRef.current
    if (!container || isMobile || lowPerf || prefersReducedMotion) return

    let ignore = false
    const onEnter = () => {
      if (ignore) return
      setIsActive(true)
      ignore = true
      setTimeout(() => (ignore = false), 150)
    }
    const onLeave = () => setIsActive(false)

    container.addEventListener("mouseenter", onEnter)
    container.addEventListener("mouseleave", onLeave)
    return () => {
      container.removeEventListener("mouseenter", onEnter)
      container.removeEventListener("mouseleave", onLeave)
    }
  }, [isMobile, lowPerf, prefersReducedMotion])

  // Keep colors unchanged
  const layerAColors = ["#000000", "#333333", "#666666", "#999999", "#cccccc"]
  const layerBColors = ["#111111", "#444444", "#777777", "#aaaaaa"]

  const speedA = isMobile ? 0.1 : 0.3
  const speedB = isMobile ? 0.05 : 0.2

  // render-scale wrapper styles
  const wrapperStyle = {
    position: "absolute" as const,
    left: 0,
    top: 0,
    width: `${100 * renderScale}%`,
    height: `${100 * renderScale}%`,
    transform: `scale(${1 / renderScale})`,
    transformOrigin: "top left",
    pointerEvents: "none" as const,
    willChange: "transform, opacity",
  }

  const shaderContainerClass = "absolute inset-0 w-full h-full transition-opacity duration-600 ease-out"

  return (
    <div
      ref={containerRef}
      className="min-h-screen relative overflow-hidden"
      style={{
        // CSS fallback background so LCP paints immediately
        backgroundImage: `url("/fallback-bg.png")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* minimal svg filter only when shaders actually mounted */}
      {!lowPerf && shadersAllowed && (
        <svg className="absolute inset-0 w-0 h-0" aria-hidden>
          <defs>
            <filter id="soft-blur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation={2} />
            </filter>
          </defs>
        </svg>
      )}

      {/* Layer A: mounts only after fallback painted */}
      {shadersAllowed && !lowPerf && (
        <div style={wrapperStyle} aria-hidden className={shaderContainerClass + " z-10"}>
          <MeshGradient
            className="absolute inset-0 w-full h-full"
            colors={layerAColors}
            speed={speedA}
          />
        </div>
      )}

      {/* Layer B: heavy layer delayed and gated */}
      {shadersAllowed && !lowPerf && enableLayerB && (
        <div style={wrapperStyle} aria-hidden className={shaderContainerClass + " z-20"}>
          <MeshGradient
            className={`absolute inset-0 w-full h-full ${isMobile ? "opacity-40" : "opacity-60"}`}
            colors={layerBColors}
            speed={speedB}
          />
        </div>
      )}

      {/* subtle overlay to reduce contrast */}
      <div className={`absolute inset-0 z-25 pointer-events-none ${isMobile ? "bg-black/20" : "bg-black/10"}`} />

      {/* content sits above everything; h1 will paint over CSS background early */}
      <div className="relative z-30 w-full">{children}</div>
    </div>
  )
}
