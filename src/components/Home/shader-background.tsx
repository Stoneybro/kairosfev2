"use client"

import React, { useEffect, useRef, useState, useMemo } from "react"
import { MeshGradient } from "@paper-design/shaders-react"

interface ShaderBackgroundProps {
  children: React.ReactNode
}

/**
 * ShaderBackground
 *
 * Provides a staged, performance-aware shader background with graceful fallbacks.
 * - Uses a CSS image fallback so LCP paints immediately.
 * - Defers shader mount until after initial paint (double RAF).
 * - Probes device performance (cores, memory, FPS) to disable shaders on weak devices.
 * - Scales rendering resolution down on low-perf devices to reduce GPU load.
 * - Adds hover interactivity (activates gradients) only for capable, non-mobile devices.
 * - Two gradient layers (light and heavy) mounted in stages:
 *   Layer A = lightweight, mounts first
 *   Layer B = heavier, delayed to avoid blocking LCP
 */
export default function ShaderBackground({ children }: ShaderBackgroundProps) {
  /** --- REFS --- */
  const containerRef = useRef<HTMLDivElement | null>(null) // root container
  const rafRef = useRef<number | null>(null)              // first rAF staging
  const rafRef2 = useRef<number | null>(null)             // second rAF staging
  const probeRafRef = useRef<number | null>(null)         // performance probe loop
  const timeouts = useRef<number[]>([])                   // keep track of active timeouts

  /** --- STATE --- */
  const [isActive, setIsActive] = useState(false)         // whether user is hovering (desktop only)
  const [isMobile, setIsMobile] = useState(false)         // responsive detection (debounced)
  const [lowPerf, setLowPerf] = useState(false)           // whether device is marked low performance
  const [renderScale, setRenderScale] = useState(1)       // render downscaling factor for perf

  // whether shaders should mount at all (false until staged mount is complete)
  const [shadersAllowed, setShadersAllowed] = useState(false)
  // whether to enable second, heavier gradient layer (delayed for perf)
  const [enableLayerB, setEnableLayerB] = useState(false)

  /** --- MOBILE DETECTION (debounced resize) --- */
  useEffect(() => {
    let t: number | null = null
    const check = () => setIsMobile(window.innerWidth < 768)
    const onResize = () => {
      if (t) window.clearTimeout(t)
      t = window.setTimeout(() => {
        check()
        t = null
      }, 150) // debounce: avoid thrashing during continuous resize
    }
    check() // initial run
    window.addEventListener("resize", onResize, { passive: true })
    return () => window.removeEventListener("resize", onResize)
  }, [])

  /** --- REDUCED MOTION PREFERENCE --- */
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false
    return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  }, [])

  /** --- STAGED MOUNT + PERFORMANCE PROBE --- */
  useEffect(() => {
    // Quick hardware heuristic: flag weak devices immediately
    const cores = navigator.hardwareConcurrency || 2
    const deviceMemory = (navigator as any).deviceMemory || 0
    if (cores <= 4 || (deviceMemory && deviceMemory <= 2)) {
      setLowPerf(true)
      setRenderScale(0.5)
      setShadersAllowed(false)
      return
    }

    // Respect system motion preferences: disable shaders entirely
    if (prefersReducedMotion) {
      setLowPerf(true)
      setShadersAllowed(false)
      return
    }

    // Double requestAnimationFrame ensures fallback CSS paints before mounting shaders
    rafRef.current = requestAnimationFrame(() => {
      rafRef2.current = requestAnimationFrame(() => {
        setShadersAllowed(true) // safe to mount shaders now

        // Stage in heavy Layer B later to avoid blocking LCP
        timeouts.current.push(window.setTimeout(() => setEnableLayerB(true), 900))

        // Warm-up then probe sustained FPS to decide if shaders should be disabled
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
                // Only mark low perf if FPS is *consistently* poor
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
          }, 500) // short warm-up before probing
        )
      })
    })

    // Cleanup all async handles
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      if (rafRef2.current) cancelAnimationFrame(rafRef2.current)
      if (probeRafRef.current) cancelAnimationFrame(probeRafRef.current)
      timeouts.current.forEach((id) => clearTimeout(id))
      timeouts.current = []
    }
  }, [prefersReducedMotion])

  /** --- INTERACTIVITY: hover activation (desktop only) --- */
  useEffect(() => {
    const container = containerRef.current
    if (!container || isMobile || lowPerf || prefersReducedMotion) return

    let ignore = false
    const onEnter = () => {
      if (ignore) return
      setIsActive(true)
      ignore = true
      setTimeout(() => (ignore = false), 150) // debounce hover enter
    }
    const onLeave = () => setIsActive(false)

    container.addEventListener("mouseenter", onEnter)
    container.addEventListener("mouseleave", onLeave)
    return () => {
      container.removeEventListener("mouseenter", onEnter)
      container.removeEventListener("mouseleave", onLeave)
    }
  }, [isMobile, lowPerf, prefersReducedMotion])

  /** --- COLOR PALETTES (unchanged) --- */
  const layerAColors = ["#000000", "#333333", "#666666", "#999999", "#cccccc"]
  const layerBColors = ["#111111", "#444444", "#777777", "#aaaaaa"]

  /** --- MOTION SPEEDS --- */
  const speedA = isMobile ? 0.1 : 0.3
  const speedB = isMobile ? 0.05 : 0.2

  /** --- WRAPPER STYLES FOR RENDER SCALE --- */
  const wrapperStyle = {
    position: "absolute" as const,
    left: 0,
    top: 0,
    width: `${100 * renderScale}%`,          // scale base canvas up
    height: `${100 * renderScale}%`,
    transform: `scale(${1 / renderScale})`,  // shrink back down
    transformOrigin: "top left",
    pointerEvents: "none" as const,
    willChange: "transform, opacity",        // hint GPU compositing
  }

  /** --- CLASS FOR SHADER CONTAINERS --- */
  const shaderContainerClass = "absolute inset-0 w-full h-full transition-opacity duration-600 ease-out"

  /** --- RENDER --- */
  return (
    <div
      ref={containerRef}
      className="min-h-screen relative overflow-hidden"
      style={{
        // CSS fallback background ensures LCP paints immediately
        backgroundImage: `url("/fallback-bg.png")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Minimal blur filter (applied only when shaders mount) */}
      {!lowPerf && shadersAllowed && (
        <svg className="absolute inset-0 w-0 h-0" aria-hidden>
          <defs>
            <filter id="soft-blur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation={2} />
            </filter>
          </defs>
        </svg>
      )}

      {/* Layer A: lightweight, mounts first */}
      {shadersAllowed && !lowPerf && (
        <div style={wrapperStyle} aria-hidden className={shaderContainerClass + " z-10"}>
          <MeshGradient className="absolute inset-0 w-full h-full" colors={layerAColors} speed={speedA} />
        </div>
      )}

      {/* Layer B: heavier, delayed and gated */}
      {shadersAllowed && !lowPerf && enableLayerB && (
        <div style={wrapperStyle} aria-hidden className={shaderContainerClass + " z-20"}>
          <MeshGradient
            className={`absolute inset-0 w-full h-full ${isMobile ? "opacity-40" : "opacity-60"}`}
            colors={layerBColors}
            speed={speedB}
          />
        </div>
      )}

      {/* Subtle overlay: reduces contrast across devices */}
      <div className={`absolute inset-0 z-25 pointer-events-none ${isMobile ? "bg-black/20" : "bg-black/10"}`} />

      {/* Foreground content (children always above background layers) */}
      <div className="relative z-30 w-full">{children}</div>
    </div>
  )
}
