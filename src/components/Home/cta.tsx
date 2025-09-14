import { ArrowRight } from 'lucide-react'
import React from 'react'

function Cta() {
  return (
  <section className="mt-12 w-full ">
      <div className="mx-auto max-w-4xl rounded-[40px] border-background  p-2 shadow-sm">
        <div className="relative mx-auto h-[400px] max-w-4xl overflow-hidden rounded-[38px] border-background  bg-muted p-2 shadow-sm">
          {/* Subtle radial glow from center */}
          <div
            className="absolute inset-0 z-0"
            style={{
              background: "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(128,128,128,0.2), transparent 70%)",
            }}
          />

          {/* Film grain overlay */}
          <div
            className="absolute inset-0 z-0 opacity-[0.02]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />

          <div className="relative z-10">
            <div className="mt-8 text-center">
              <h2 className="text-4xl font-bold text-white mb-6">Simple. Trustless. Automated.</h2>
              <p className="text-white/60 mb-8">Built to turn goals into reality.</p>

              <div className="flex items-center justify-center">
                <a href="/docs/get-started">
                  <div className="group border-border bg-secondary/70 flex h-[64px] cursor-pointer items-center gap-2 rounded-full border p-[11px] mt-10">
                    <div className="border-border bg-foreground flex h-[43px] items-center justify-center rounded-full border">
                      <p className="mr-3 ml-2 flex items-center justify-center gap-2 font-medium tracking-tight text-background">

                      Join Kairos
                      </p>
                    </div>
                    <div className="border-border flex size-[26px] bg-foreground text-background items-center justify-center rounded-full border-2 transition-all ease-in-out group-hover:ml-2">
                        <ArrowRight />
                    </div>
                  </div>
                </a>
              </div>
            </div>

            {/* Stroked text wordmark */}
            <h1
              className="absolute inset-x-0 mt-[120px] text-center text-[100px] font-semibold text-transparent sm:mt-[30px] sm:text-[190px] pointer-events-none"
              style={{
                WebkitTextStroke: "1px currentColor",
                color: "transparent",
              }}
              aria-hidden="true"
            >
              skiper/ui
            </h1>
            <h1
              className="absolute inset-x-0 mt-[120px] text-center text-[100px] font-semibold text-primary sm:mt-[30px] sm:text-[190px] pointer-events-none"
              aria-hidden="true"
            >
              skiper/ui
            </h1>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Cta