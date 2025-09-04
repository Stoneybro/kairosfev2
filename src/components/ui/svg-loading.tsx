"use client";
import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function SvgLoading() {
  return (
    <div className=''>
      <video autoPlay loop muted playsInline width={64} height={64}>
        <source src='/kairossymbol.webm' type='video/webm' />
        <img src='/kairossymbol.gif' alt='Loading...' width={64} height={64} />
      </video>
    </div>
  );
}
