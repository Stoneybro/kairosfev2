"use client";
import { ArrowUpDown, QrCode } from "lucide-react";
import { CiMoneyCheck1 } from "react-icons/ci";
import React from "react";
import { Button } from "../ui/button";
import { activeTabType } from "@/lib/types";
type WalletHomeProps = {
  setActiveTab: (tab: activeTabType) => void;
};
export default function WalletHome({ setActiveTab }: WalletHomeProps) {
  return (
    <div className='flex-1 flex flex-col items-center justify-center px-6'>
      <div className='text-center mb-8'>
        <div className='text-4xl font-light mb-2'>
          <span className=''>0.1</span>
          <span className=' text-muted-foreground text-lg ml-1'>ETH</span>
        </div>
        <div className='text-sm  text-muted-foreground'>Available Balance</div>
      </div>

      {/* Additional Balance Info */}
      <div className='w-full max-w-sm mb-8 space-y-3'>
        <div className='bg-muted/50 rounded-lg p-3 flex justify-between items-center'>
          <span className=' text-muted-foreground text-sm'>Total Balance</span>
          <span className=' text-sm'>0.01ETH</span>
        </div>
        <div className='bg-muted/50 rounded-lg p-3 flex justify-between items-center'>
          <span className=' text-muted-foreground text-sm'>Committed</span>
          <span className='  text-sm'>0.01ETH</span>
        </div>
      </div>

      {/* Action Buttons Grid */}
      <div className='w-full max-w-sm space-y-4'>
        {/* Top Row */}
        <Button variant={"outline"} onClick={() => setActiveTab("receive")} className='w-full '>
          <QrCode  />
          <span className=' font-medium'>receive</span>
        </Button>
        <div className='grid grid-cols-2 gap-4'>
          <Button onClick={() =>setActiveTab("deposit")} variant={"outline"} className='w-full'>
           <CiMoneyCheck1  />
            <span className=' font-medium'>Deposit</span>
          </Button>

          <Button onClick={() => setActiveTab("send")} variant={"outline"} className='w-full'>
            <ArrowUpDown  />
            <span className=' font-medium'>Send</span>
          </Button>
        </div>
      </div>

      {/* Bottom Text */}
    </div>
  );
}
