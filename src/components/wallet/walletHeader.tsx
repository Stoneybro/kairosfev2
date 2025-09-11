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
import { getBalance } from "@/hooks/native/server";
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
            <div  className=' flex justify-center items-center gap-2 '>
              {truncateAddress(smartAccount)}
              <CopyText text={smartAccount} />
            </div>
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
