"use client";
import React from "react";
import Image from "next/image";

export default function SvgLoading() {
  return (
    <div className=''>
      <Image src={"/kairossymbol.svg"} width={150} height={150} alt="Kairos Loader" />
    </div>
  );
}
