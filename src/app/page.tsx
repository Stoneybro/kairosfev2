"use client";
import React from "react";
import Nav from "@/components/Home/nav";
import Hero from "@/components/Home/hero";
import ShaderBackground from "@/components/Home/shader-background";
import Features from "@/components/Home/Features";
import Footer from "@/components/Home/footer";
import Cta from "@/components/Home/cta";
import { Faq } from "@/components/Home/Faq";
function Homepage() {
  return (
    <div className='relative'>
      <Nav />
      <ShaderBackground>
        <Hero />
      </ShaderBackground>
      <Features />
      <Cta />
      <Faq />
      <div className='h-[50vh]'>
        <Footer />
      </div>
    </div>
  );
}

export default Homepage;
