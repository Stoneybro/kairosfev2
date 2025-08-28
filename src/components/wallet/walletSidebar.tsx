"use client";
import { useState } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import WalletHeader from "./walletHeader";
import WalletHome from "./walletHome";
import WalletFooter from "./walletFooter";
import { activeTabType } from "@/types";
import WalletRecieve from "./walletReceive";
import WalletSend from "./walletSend";
import WalletActivity from "./walletActivity";
import WalletSettings from "./walletSettings";
import WalletDeposit from "./walletDeposit";

export function WalletSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const [activeTab, setActiveTab] = useState<activeTabType>("home");
  return (
    <Sidebar collapsible='offcanvas' {...props}>
      <div className='bg-background mx-auto my-auto h-[95vh] w-[95%] max-w-3xl rounded-xl  shadow'>
        <div className='w-full h-[10%]  '>
          <WalletHeader setActiveTab={setActiveTab} />
        </div>
        <div className='w-full h-[80%] flex flex-col relative'>
          <div className='w-full h-full flex justify-center items-center'>
            {activeTab === "home" && <WalletHome setActiveTab={setActiveTab} />}
            {activeTab === "receive" && <WalletRecieve />}
            {activeTab === "send" && <WalletSend />}
            {activeTab === "activity" && <WalletActivity />}
            {activeTab === "settings" && <WalletSettings />}
            {activeTab === "deposit" && <WalletDeposit />}
          </div>
          <div className='text-sm text-gray-400 self-center absolute bottom-10'>
            Deposit to get started
          </div>
        </div>

        <div className='w-full h-[10%] '>
          <WalletFooter setActiveTab={setActiveTab} activeTab={activeTab} />
        </div>
      </div>
    </Sidebar>
  );
}
