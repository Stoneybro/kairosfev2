import { ArrowRight } from "lucide-react";
import React from "react";

function Cta() {
  return (
    <section className="mt-12 w-full">
      <div className="mx-auto max-w-4xl rounded-[40px] border-background p-2 shadow-sm">
        <div className="relative mx-auto h-[400px] max-w-4xl overflow-hidden rounded-[38px] border-background bg-muted p-2 shadow-sm">
          {/* Radial glow background */}
          <div
            className="absolute inset-0 z-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(128,128,128,0.2), transparent 70%)",
            }}
          />

          {/* Subtle noise texture */}
          <div
            className="absolute inset-0 z-0 opacity-[0.02]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />

          <div className="relative z-10">
            <div className="mt-8 text-center">
              <h2 className="mb-6 text-4xl font-bold text-white">
                Simple. Trustless. Automated.
              </h2>
              <p className="mb-8 text-white/60">Built to turn goals into reality.</p>

              {/* CTA button */}
              <div className="flex items-center justify-center">
                <a href="/docs/get-started">
                  <div className="group mt-10 flex h-[64px] cursor-pointer items-center gap-2 rounded-full border border-border bg-secondary/70 p-[11px]">
                    <div className="flex h-[43px] items-center justify-center rounded-full border border-border bg-foreground">
                      <p className="ml-2 mr-3 flex items-center justify-center gap-2 font-medium tracking-tight text-background">
                        Join Kairos
                      </p>
                    </div>
                    <div className="flex size-[26px] items-center justify-center rounded-full border-2 border-border bg-foreground text-background transition-all ease-in-out group-hover:ml-2">
                      <ArrowRight />
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Cta;
