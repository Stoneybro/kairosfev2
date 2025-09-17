"use client";
import React, { useState } from "react";
import Image from "next/image";
import { activateWallet } from "@/hooks/useActivateWallet";
import { Label } from "@radix-ui/react-label";
import { Checkbox } from "@/components/ui/checkbox";
import LoadingButton from "@/components/ui/loaderButton";
import SyncWalletAfterLogin from "@/lib/auth/syncWallet";
import { usePrivy } from "@privy-io/react-auth";
import Spinner from "@/components/ui/spinner";
function page() {
  const [checked, setChecked] = useState(false);
  const [activated,setActivated]=useState<string>("");
  const handleActivateWallet = activateWallet();
  const { ready, authenticated, user } = usePrivy();
  if (!ready || !authenticated || !user) {
    return (
      <div className='w-full h-screen flex justify-center items-center'>
        <div className='w-32 h-32'>
          <Spinner h={175} w={175} rotate={true} />
        </div>
      </div>
    );
  }
  return (
    <div>
      <div className='bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10'>
        <div className='w-full max-w-md flex flex-col gap-6 justify-center items-center text-center'>
          <Image
            src={"/kairossymbol-light.svg"}
            width={100}
            height={100}
            alt='kairos symbol'
            className='dark:hidden'
          />
          <Image
            src={"/kairossymbol-light.svg"}
            width={100}
            height={100}
            alt='kairos symbol'
            className='dark:block hidden'
          />

          <div className=' text-3xl font-semibold text-center'>
            Activate Your Kairos Wallet
          </div>
          <div className=''>
            This is a secure smart wallet, unique to you, where your locked
            funds are held safely while you work on your tasks.
          </div>
          <Label className='hover:bg-muted/50 dark:hover:bg-muted/30 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-black has-[[aria-checked=true]]:bg-muted dark:has-[[aria-checked=true]]:border-accent dark:has-[[aria-checked=true]]:bg-muted/50'>
            <Checkbox
              checked={checked}
              onCheckedChange={() => {
                setChecked(!checked);
              }}
              id='toggle-2'
              className='data-[state=checked]:border-black data-[state=checked]:bg-black data-[state=checked]:text-white dark:data-[state=checked]:border-accent dark:data-[state=checked]:bg-muted'
            />
            <div className='flex flex-col items-start justify-center gap-1.5 font-normal'>
              <p className='text-sm leading-none font-medium'>
                Accept terms and conditions.
              </p>
              <p className='text-muted-foreground text-left text-sm'>
                By clicking this checkbox, you agree to the terms and
                conditions.
              </p>
            </div>
          </Label>
          <LoadingButton
            executeAction={async () => {
              const result = await handleActivateWallet();
              if(result)setActivated("Routing you to the dashboard...")
              return result ?? false;
            }}
            idleText='activate wallet'
            loadingText='activating wallet'
            successText='wallet activated'
            className='w-full'
            disabled={!checked}
          />
          <div className="text-sm mt-4 text-accent-foreground text-center">{activated}</div>
        </div>
        <SyncWalletAfterLogin />
      </div>
    </div>
  );
}

export default page;
