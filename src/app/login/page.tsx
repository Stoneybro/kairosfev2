//login/page.tsx
import Image from "next/image";
import Link from "next/link";
import LoginForm from "@/components/login/LoginForm";
import SyncWalletAfterLogin from "@/lib/auth/syncWallet";

export default async function LoginPage() {
  return (
    <div className='grid min-h-svh lg:grid-cols-2 relative'>
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
            <LoginForm />
          </div>
        </div>
        <SyncWalletAfterLogin />
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
