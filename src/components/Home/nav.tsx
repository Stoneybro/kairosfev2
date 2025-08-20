import React from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
function Nav() {
  return (
    <div className='flex justify-between items-center p-4'>
      <div className=''>
        <Image
          src={"/kairoslogo.svg"}
          width={120}
          height={120}
          alt='kairos logo'
        />
      </div>
      <div className='flex gap-4'>
        <Link href={"/dashboard"}>
          <Button variant={"outline"}>Launch App</Button>
        </Link>
        <Link href={"/login"}>
          <Button variant={"default"}>Join Kairos</Button>
        </Link>
      </div>
    </div>
  );
}

export default Nav;
