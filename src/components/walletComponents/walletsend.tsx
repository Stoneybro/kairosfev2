"use client"
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

type SendType = "Send" | "Sending" | "Sent";
export default function WalletSend () {
  const [sendButton, setsendButton] = useState<SendType>("Send");

  return (
    <div className='px-4 flex flex-col w-full h-full gap-4 pt-8'>
      <div className='flex flex-col gap-2 w-full'>
        <div className='flex items-center justify-between'>
          <label htmlFor='Addressto' className='text-muted-foreground text-sm'>
            Send to
          </label>
          <Button variant={"outline"} className='text-xs px-2 py-1'>
            YOUR WALLET
          </Button>
        </div>
        <input
          type='text'
          name='Addressto'
          className='border w-full p-2 rounded  '
        />
      </div>
      <div className='flex flex-col gap-2 w-full'>
        <label htmlFor='amount' className='text-muted-foreground text-sm'>
          Amount
        </label>
        <input
          type='text'
          placeholder='0'
          name='amount'
          className='border w-full p-2 rounded  '
        />

        <div className='text-muted-foreground self-end text-xs'>
          Balance: 0.1 ETH
        </div>
      </div>
      <Button
        variant={"outline"}
        disabled
        className={`
         `}
      >

          <Loader2 className='mr-2 h-4 w-4 animate-spin' />

        {sendButton}
      </Button>
    </div>
  );
};


