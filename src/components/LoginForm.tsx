"use client"
import { Button } from "@/components/ui/button";
import { useLogin } from "@privy-io/react-auth";
import { FcGoogle } from "react-icons/fc";
import { SiGmail } from "react-icons/si";
import { IoWallet } from "react-icons/io5";
import { FaGithub } from "react-icons/fa";
export default function LoginForm() {
  const {login}=useLogin()
  return (
    <div className={"flex flex-col gap-6"} >
      <div className='flex flex-col items-center gap-2 text-center'>
        <h1 className='text-4xl font-bold'>Welcome Back!</h1>
        <p className='text-muted-foreground text-sm text-balance'>
          Choose your preferred method to continue.
        </p>
      </div>
      <div className='grid gap-6'>
        <Button onClick={() => login({loginMethods:["google"]})}  variant='outline' className='w-full'>
          <FcGoogle />
          Login with Google
        </Button>
        <Button onClick={() => login({loginMethods:["email"]})}  variant='outline' className='w-full'>
          <SiGmail />
          Login with Email
        </Button>
        <Button onClick={() => login({loginMethods:["github"]})}  variant='outline' className='w-full'>
          <FaGithub />
          Login with GitHub
        </Button>
        <div className='after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t'>
          <span className='bg-background text-muted-foreground relative z-10 px-2'>
            Or continue with
          </span>
        </div>
        <Button onClick={() => login({loginMethods:["wallet"]})}  variant='outline' className='w-full'>
          <IoWallet />
          Connect Wallet
        </Button>
      </div>
    </div>
  );
}
