import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import { BiCoinStack } from "react-icons/bi";
import { BsSignpostSplit } from "react-icons/bs";
import { IoCalendarOutline } from "react-icons/io5";
import { LuScanQrCode } from "react-icons/lu";
import { PiSpinner } from "react-icons/pi";

function Taskskeleton() {
  return (
    <div className='flex flex-col gap-6'>
      <div className='text-2xl'>
        <Skeleton className='w-20 h-8' />
      </div>
      <div className='flex flex-col justify-start items-start max-w-sm gap-4'>
        <div className='flex justify-between items-center w-full'>
          <span className='text-muted-foreground flex items-center gap-1'>
            <PiSpinner /> status
          </span>
          <Skeleton className='w-12 h-4' />{" "}
        </div>
        <div className='flex justify-between items-center w-full'>
          <span className='text-muted-foreground flex items-center gap-1'>
            <BiCoinStack /> reward
          </span>
          <span>
            <Skeleton className='w-12 h-4' />
          </span>
        </div>
        <div className='flex justify-between items-center w-full'>
          <span className='text-muted-foreground flex items-center gap-1'>
            <IoCalendarOutline /> deadline
          </span>
          <span>
            <Skeleton className='w-12 h-4' />
          </span>
        </div>
        <div className='flex justify-between items-center w-full'>
          <span className='text-muted-foreground flex items-center gap-1'>
            <BsSignpostSplit /> penalty choice
          </span>
          <span>
            <Skeleton className='w-12 h-4' />
          </span>
        </div>

        <div className='flex justify-between items-center w-full'>
          <span className='text-muted-foreground flex items-center gap-1'>
            <LuScanQrCode /> verification method
          </span>
          <span>
            <Skeleton className='w-12 h-4' />
          </span>
        </div>
      </div>

      <div className='flex justify-start gap-4 items-center max-w-sm'>
        <Skeleton className='w-12 h-8' />
        <Skeleton className='w-12 h-8' />
      </div>
    </div>
  );
}

export default Taskskeleton;
