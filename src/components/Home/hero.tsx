import React from "react";


/**
 * Hero section
 * - Fullscreen intro area
 * - Highlights Kairos' core value: accountability on-chain
 */
function Hero() {
  return (
    <div className="relative z-40 flex min-h-screen w-full items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-center sm:gap-6 lg:gap-8">
        
        {/* Main heading */}
        <h1 className="text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl xl:text-8xl">
          <span className="block sm:inline">Accountability,</span>{" "}
          <span className="block sm:inline">onChain.</span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-xs px-2 text-base text-gray-300 sm:max-w-md sm:text-lg md:max-w-lg md:text-xl lg:max-w-xl lg:text-2xl">
          A user-friendly smart wallet system that makes commitments auditable and automated.
        </p>
      </div>
    </div>
  );
}

export default Hero;
