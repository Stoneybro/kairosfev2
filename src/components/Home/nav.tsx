"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import Link from "next/link";

interface NavProps {
  isScrolled?: boolean;
  onNavigate?: (id: string) => void;
}

export default function Nav({ isScrolled: external, onNavigate }: NavProps) {
  const [internal, setInternal] = useState(false);
  const isScrolled = external ?? internal;

  useEffect(() => {
    if (external !== undefined) return;
    const onScroll = () => setInternal(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [external]);

  const getWidth = () => {
    if (typeof window !== 'undefined') {
      const vw = window.innerWidth;
      if (vw < 768) { // Mobile
        return isScrolled ? "calc(100vw - 2rem)" : "calc(100vw - 1rem)";
      } else if (vw < 1024) { // Tablet
        return isScrolled ? "32rem" : "40rem"; // 512px : 640px
      } else if (vw < 1280) { // Desktop
        return isScrolled ? "40rem" : "48rem"; // 640px : 768px
      } else { // Large desktop
        return isScrolled ? "48rem" : "64rem"; // 768px : 1024px
      }
    }
    return isScrolled ? "48rem" : "64rem";
  };

  return (
 <header
        className="fixed top-4 left-1/2 transform z-[9999] flex flex-row items-center justify-between rounded-full bg-foreground/20 backdrop-blur-sm border border-border/10 shadow-lg transition-all duration-300 py-2"
        style={{
          willChange: "transform",
          transform: "translateX(-50%) translateZ(0)",
          backfaceVisibility: "hidden",
          perspective: "1000px",
          width: getWidth(),
          maxWidth: "calc(100vw - 2rem)", // Prevent overflow on small screens
          paddingLeft: isScrolled ? "0.5rem" : "1rem",
          paddingRight: isScrolled ? "0.5rem" : "1rem",
        }}
    >
      <Image
        src='/kairoslogo-light.svg'
        width={isScrolled ? 70 : 90}
        height={isScrolled ? 70 : 90}
        alt='kairos logo'
        className='transition-all'
      />

      <Link href='/dashboard'>
        <Button className='rounded-3xl text-sm lg:text-base px-4 lg:px-6'>
          Launch App
        </Button>
      </Link>
    </header>
  );
}
