"use client";
import React from "react";
import { useState } from "react";
import {
  HiChevronLeft,
  HiOutlineChevronDown,
} from "react-icons/hi2";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { X } from "lucide-react";
import CopyText from "../ui/copy";
import { useSidebar } from "../ui/sidebar";
import { activeTabType } from "@/lib/types";
type WalletHeaderProps = {
  setActiveTab: (tab: activeTabType) => void;
};

export default function WalletHeader({setActiveTab}:WalletHeaderProps) {
    const [isOpen, setIsOpen] = useState(false);
    const {setOpenMobile,setOpen}=useSidebar()
  return (
    <div className='flex justify-center items-center h-full w-full'>
      <div className='flex-2 flex items-center justify-center'>
        {
          <Button
           onClick={()=>setActiveTab("home")}
            variant='secondary'
            className='h-10 w-10 rounded-full bg-muted flex items-center justify-center border'
          >
            <HiChevronLeft />
          </Button>
        }
      </div>
      <div className='flex-6 flex justify-center '>
        <DropdownMenu onOpenChange={setIsOpen}>
          <DropdownMenuTrigger
            asChild
            className='w-[90%]   rounded-2xl bg-card '
          >
            <Button variant='outline' className=' tracking-wide relative '>
              0x1Edeb...B5b7d7
              <HiOutlineChevronDown
                size={10}
                className={`absolute right-2 top-2.5 ml-2 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='lg:w-72 p-2' align='center'>
            <div className='flex flex-col gap-1 p-2'>
              <div className='text-muted-foreground text-sm'>
                Personal Wallet
              </div>
              <div className='flex justify-between '>
                <div className='flex gap-3  items-center '>
                  0x1Edeb...B5b7d7
                <CopyText text={"0x1Edeb...B5b7d7"} />
                </div>
                <div className=''>
                  1 ETH
                </div>
              </div>
            </div>

            <div className='flex flex-col gap-1 p-2'>
              <div className='text-muted-foreground text-sm'>Smart Wallet</div>
              <div className='flex justify-between'>
                <div className='flex gap-3 items-center'>
                   0x1Edeb...B5b7d7
                 <CopyText text={"0x1Edeb...B5b7d7"} />
                </div>
                <div className=''>0.01 ETH</div>
              </div>
            </div>
            <div className=''></div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className='flex-2  flex items-center justify-center '>
        <Button
          onClick={() => {
            setOpen(false);
            setOpenMobile(false);
          }}
          variant='secondary'
          className=' rounded-full bg-muted flex items-center h-10 w-10 justify-center border'
        >
          <X />
        </Button>
      </div>
    </div>
  );
}
