"use client";
import Image from "next/image";
import Link from "next/link";
import LoginForm from "../../components/LoginForm";
import { usePrivy } from "@privy-io/react-auth";
import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import SvgLoading from "@/components/svg-loading";
export default function LoginPage() {
  const { ready,authenticated } = usePrivy();
  const router=useRouter();

  useEffect(()=>{
  if(authenticated){
    router.push("/activatewallet")
  }
  },[authenticated,router])
  return (
    <div className='grid min-h-svh lg:grid-cols-2'>
      <div className='flex flex-col gap-4 p-4 md:p-8'>
        <div className='flex justify-center gap-2 md:justify-start'>
          <Link href='/' className='flex items-center gap-2 font-medium'>
            <Image
              src={"/kairoslogo.svg"}
              width={120}
              height={100}
              alt='kairos logo'
            />
          </Link>
        </div>
        <div className='flex flex-1 items-center justify-center'>
          <div className='w-full max-w-xs'>
            {ready ? <LoginForm /> : <SvgLoading />}
          </div>
        </div>
      </div>
      <div className='bg-muted relative hidden lg:block'>
        <video
          autoPlay
          loop
          muted
          playsInline
          preload='auto'
          className='w-full h-full object-cover'
        >
          <source src='/loginvideo1.mp4' type='video/mp4' />
        </video>
      </div>
    </div>
  );
}
