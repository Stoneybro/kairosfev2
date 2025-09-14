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
import WalletFaucet from "./walletFaucet";

type WalletSidebarProps = React.ComponentProps<typeof Sidebar> & {
  smartAccount: `0x${string}`;
};

export function WalletSidebar({ smartAccount, ...props }: WalletSidebarProps) {
  const [activeTab, setActiveTab] = useState<activeTabType>("home");

  return (
    <Sidebar collapsible='offcanvas' {...props} id="tour-wallet-sidebar">
      <div className='bg-background mx-auto my-auto h-[95vh] w-[95%] max-w-3xl rounded-xl  shadow'>
        <div className='w-full h-[10%]  '>
          <WalletHeader
            setActiveTab={setActiveTab}
            smartAccount={smartAccount}
          />
        </div>
        <div className='w-full h-[80%] flex flex-col relative'>
          <div className='w-full h-full flex justify-center items-center'>
            {activeTab === "home" && (
              <WalletHome
                setActiveTab={setActiveTab}
                smartAccount={smartAccount}
              />
            )}
            {activeTab === "receive" && <WalletRecieve />}
            {activeTab === "send" && <WalletSend smartAccount={smartAccount} />}
            {activeTab === "activity" && <WalletActivity />}
            {activeTab === "settings" && <WalletSettings />}
          </div>
          <div className='text-sm text-gray-400 self-center absolute bottom-10' id="tour-claim-faucet">
            <WalletFaucet smartAccount={smartAccount} />
          </div>
        </div>

        <div className='w-full h-[10%] '>
          <WalletFooter setActiveTab={setActiveTab} activeTab={activeTab} />
        </div>
      </div>
    </Sidebar>
  );
}
