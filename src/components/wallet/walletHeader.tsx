"use client";
import React from "react";
import { useState } from "react";
import { HiChevronLeft, HiOutlineChevronDown } from "react-icons/hi2";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { X } from "lucide-react";
import CopyText from "../ui/copy";
import { useSidebar } from "../ui/sidebar";
import { activeTabType } from "@/types";
import { usePrivy } from "@privy-io/react-auth";
import { getBalance } from "@/hooks/web3/server";
import { useQuery } from "@tanstack/react-query";
import { formatNumber, truncateAddress } from "@/utils/helpers";
import { Skeleton } from "../ui/skeleton";
import { fetchUserBalance } from "@/utils/helpers";
type WalletHeaderProps = {
  setActiveTab: (tab: activeTabType) => void;
  smartAccount: `0x${string}`;
};
export default function WalletHeader({
  setActiveTab,
  smartAccount,
}: WalletHeaderProps) {
  const { user } = usePrivy();
  const userAddress = user?.wallet?.address;
  const { data: balance, isLoading: balanceIsLoading } = useQuery({
    queryKey: ["userBalance", smartAccount],
    queryFn: () => fetchUserBalance(smartAccount, userAddress as `0x${string}`),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
  });
  const [isOpen, setIsOpen] = useState(false);
  const { setOpenMobile, setOpen } = useSidebar();
  return (
    <div className='flex justify-center items-center h-full w-full'>
      <div className='flex-2 flex items-center justify-center'>
        {
          <Button
            onClick={() => setActiveTab("home")}
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
              {truncateAddress(smartAccount)}
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
                  {truncateAddress(userAddress!)}
                  <CopyText text={userAddress!} />
                </div>
                <div className=''>
                  {balanceIsLoading ? (
                    <Skeleton className='w-16 h-4' />
                  ) : (
                    balance?.userAddressBalance
                  )}{" "}
                  ETH
                </div>
              </div>
            </div>

            <div className='flex flex-col gap-1 p-2'>
              <div className='text-muted-foreground text-sm'>Smart Wallet</div>
              <div className='flex justify-between'>
                <div className='flex gap-3 items-center'>
                  {truncateAddress(smartAccount)}
                  <CopyText text={smartAccount} />
                </div>
                <div className=''>
                  {balanceIsLoading ? (
                    <Skeleton className='w-16 h-4' />
                  ) : (
                    balance?.smartAccountbalance
                  )}{" "}
                  ETH
                </div>
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
