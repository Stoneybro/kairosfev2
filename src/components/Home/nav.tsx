"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { MdArrowOutward, MdMenu, MdClose } from "react-icons/md";

interface NavProps {
  isScrolled?: boolean;
  onNavigate?: (elementId: string) => void;
}

export default function Nav({ isScrolled: externalIsScrolled, onNavigate }: NavProps) {
  const [internalIsScrolled, setInternalIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Use external prop if provided, otherwise use internal state
  const isScrolled = externalIsScrolled ?? internalIsScrolled;

  useEffect(() => {
    // Only set up scroll detection if no external isScrolled prop is provided
    if (externalIsScrolled === undefined) {
      const handleScroll = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        setInternalIsScrolled(scrollTop > 50); // Trigger after 50px scroll
      };

      // Add scroll event listener
      window.addEventListener('scroll', handleScroll, { passive: true });
      
      // Check initial scroll position
      handleScroll();

      // Cleanup
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [externalIsScrolled]);

  const handleNavClick = (elementId: string) => {
    if (onNavigate) {
      onNavigate(elementId);
    } else {
      // Default scroll behavior
      const element = document.getElementById(elementId);
      if (element) {
        const headerOffset = 120; // Account for sticky header height + margin
        const elementPosition =
          element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };

  // Get responsive width values
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
    <>
      {/* Desktop Navigation */}
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
        <a
          className={`z-50 flex items-center justify-center gap-2 transition-all duration-300 ${
            isScrolled ? "ml-2" : ""
          }`}
          href='https://v0.app'
          target='_blank'
          rel='noopener noreferrer'
        >
          <Image
            src={"/kairoslogo-light.svg"}
            width={isScrolled ? 70 : 90}
            height={isScrolled ? 70 : 90}
            alt='kairos logo'
            className="transition-all duration-300"
          />
        </a>

        <div className='flex gap-2 lg:gap-4'>
          <Link href={"/dashboard"}>
            <Button 
              variant={"default"} 
              className="rounded-3xl text-sm lg:text-base px-4 lg:px-6"
            >
              Launch App
            </Button>
          </Link>
        </div>
      </header>


    </>
  );
}