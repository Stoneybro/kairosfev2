import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
function Hero() {
  return (
    <div className='w-full h-[80vh] flex items-center justify-center'>
      <div className='flex flex-col items-center gap-8'>
        <div className='text-6xl font-semibold'>Accountability, onChain.</div>
        <div className='text-lg'>wallets programmed for you</div>
        <div className=''>
          <Link href={"/login"}>
            <Button className=' text-lg px-12 py-6'>Join Kairos</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Hero;
