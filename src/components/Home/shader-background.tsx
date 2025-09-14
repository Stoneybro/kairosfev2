"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { MeshGradient } from "@paper-design/shaders-react"

interface ShaderBackgroundProps {
  children: React.ReactNode
}

export default function ShaderBackground({ children }: ShaderBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isActive, setIsActive] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if mobile on mount and window resize
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)

    const handleMouseEnter = () => setIsActive(true)
    const handleMouseLeave = () => setIsActive(false)

    const container = containerRef.current
    if (container && !isMobile) {
      container.addEventListener("mouseenter", handleMouseEnter)
      container.addEventListener("mouseleave", handleMouseLeave)
    }

    return () => {
      window.removeEventListener('resize', checkMobile)
      if (container) {
        container.removeEventListener("mouseenter", handleMouseEnter)
        container.removeEventListener("mouseleave", handleMouseLeave)
      }
    }
  }, [isMobile])

  return (
    <div 
      ref={containerRef} 
      className="min-h-screen bg-black relative overflow-hidden"
    >
      {/* SVG Filters */}
      <svg className="absolute inset-0 w-0 h-0" aria-hidden="true">
        <defs>
          <filter id="glass-effect" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence 
              baseFrequency={isMobile ? "0.003" : "0.005"} 
              numOctaves="1" 
              result="noise" 
            />
            <feDisplacementMap 
              in="SourceGraphic" 
              in2="noise" 
              scale={isMobile ? "0.2" : "0.3"} 
            />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0.02
                      0 1 0 0 0.02
                      0 0 1 0 0.05
                      0 0 0 0.9 0"
              result="tint"
            />
          </filter>
          <filter id="gooey-filter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur 
              in="SourceGraphic" 
              stdDeviation={isMobile ? "2" : "4"} 
              result="blur" 
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
              result="gooey"
            />
            <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Background Shaders - Responsive and Performance Optimized */}
      <MeshGradient
        className="absolute inset-0 w-full h-full z-10"
        colors={["#000000", "#333333", "#666666", "#999999", "#cccccc"]}
        speed={isMobile ? 0.1 : 0.3} // Slower on mobile for better performance
      />
      <MeshGradient
        className={`absolute inset-0 w-full h-full z-20 ${
          isMobile ? "opacity-40" : "opacity-60"
        } transition-opacity duration-300`}
        colors={["#111111", "#444444", "#777777", "#aaaaaa"]}
        speed={isMobile ? 0.05 : 0.2} // Much slower on mobile
      />

      {/* Content wrapper with proper mobile spacing */}
      <div className="relative z-30 w-full">
        {children}
      </div>

      {/* Mobile optimization: Reduce visual complexity on smaller screens */}
      {isMobile && (
        <div className="absolute inset-0 bg-black/20 z-25 pointer-events-none" />
      )}
    </div>
  )
}