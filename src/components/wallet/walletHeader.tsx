"use client";
import React from "react";
import { HiChevronLeft } from "react-icons/hi2";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import CopyText from "../ui/copy";
import { useSidebar } from "../ui/sidebar";
import { activeTabType } from "@/types";
import { truncateAddress } from "@/utils/format";

type WalletHeaderProps = {
  setActiveTab: (tab: activeTabType) => void; // function to update active tab
  smartAccount: `0x${string}`; 
};

export default function WalletHeader({
  setActiveTab,
  smartAccount,
}: WalletHeaderProps) {
  const { setOpenMobile, setOpen } = useSidebar(); // sidebar context actions

  return (
    <div className="flex justify-center items-center h-full w-full">
      {/* Back button section */}
      <div className="flex-2 flex items-center justify-center">
        <Button
          onClick={() => setActiveTab("home")}
          variant="secondary"
          className="h-10 w-10 rounded-full bg-muted flex items-center justify-center border"
        >
          <HiChevronLeft />
        </Button>
      </div>

      {/* Wallet address section */}
      <div className="flex-6 flex justify-center">
        <div className="flex justify-center items-center gap-2">
          {truncateAddress(smartAccount)}
          <CopyText text={smartAccount} />
        </div>
      </div>

      {/* Close sidebar button */}
      <div className="flex-2 flex items-center justify-center">
        <Button
          onClick={() => {
            setOpen(false); // close desktop sidebar
            setOpenMobile(false); // close mobile sidebar
          }}
          variant="secondary"
          className="rounded-full bg-muted flex items-center h-10 w-10 justify-center border"
        >
          <X />
        </Button>
      </div>
    </div>
  );
}
