import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Footer component
 * - Appears when user scrolls near the bottom of the page
 * - Animates in/out using Framer Motion
 */
function Footer() {
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = window.scrollY;
          const windowHeight = window.innerHeight;
          const documentHeight = document.documentElement.scrollHeight;

          // Show footer if user is within 100px of bottom
          setIsAtBottom(scrollTop + windowHeight >= documentHeight - 100);

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // run once on mount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isAtBottom && (
        <motion.div
          className="fixed bottom-0 left-0 z-50 flex h-80 w-full items-center justify-center bg-muted"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="relative flex h-full w-full items-start justify-end px-12 py-12 text-right text-primary">
            {/* Navigation links */}
            <motion.div
              className="flex flex-row space-x-12 text-sm sm:space-x-16 sm:text-lg md:space-x-24 md:text-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <ul className="space-y-2">
                <li>Home</li>
                <li>Docs</li>
                <li>Components</li>
              </ul>
              <ul className="space-y-2">
                <li>Github</li>
                <li>Twitter</li>
                <li>Discord</li>
              </ul>
            </motion.div>

            {/* Wordmark */}
            <motion.h2
              className="absolute bottom-0 left-0 select-none text-[80px] font-bold text-primary sm:text-[192px]"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Kairos
            </motion.h2>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Footer;
