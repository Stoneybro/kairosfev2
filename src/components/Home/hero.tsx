import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

function Hero() {
  return (
    <div className='w-full min-h-screen flex items-center justify-center relative z-40 px-4 sm:px-6 lg:px-8'>
      <div className='flex flex-col items-center gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto text-center'>
        {/* Main Heading */}
        <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-8xl font-semibold text-white leading-tight'>
          <span className="block sm:inline">Accountability,</span>{" "}
          <span className="block sm:inline">onChain.</span>
        </h1>
        
        {/* Subtitle */}
        <p className='text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl px-2'>
          A user-friendly smart wallet system that makes commitments auditable and automated.
        </p>
        
        {/* CTA Buttons - Optional, uncomment if needed */}
        {/* 
        <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 sm:mt-6 lg:mt-8'>
          <Link href={"/dashboard"}>
            <Button 
              size="lg" 
              className="w-full sm:w-auto px-8 py-3 text-base sm:text-lg rounded-2xl"
            >
              Get Started
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full sm:w-auto px-8 py-3 text-base sm:text-lg rounded-2xl"
          >
            Learn More
          </Button>
        </div>
        */}
      </div>
    </div>
  );
}

export default Hero;