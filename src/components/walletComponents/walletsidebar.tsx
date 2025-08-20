"use client"
import { useState } from "react"
import { Sidebar } from "@/components/ui/sidebar"
import WalletHeader from "./walletheader"
import WalletHome from "./wallethome"
import WalletFooter from "./walletfooter"
import { activeTabType } from "@/lib/types"
import WalletRecieve from "./walletreceive"
import WalletSend from "./walletsend"
import WalletActivity from "./walletactivity"
import WalletSettings from "./walletsettings"
import WalletDeposit from "./walletdeposit"



export function WalletSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [activeTab,setActiveTab]=useState<activeTabType>("home");
  return <Sidebar collapsible="offcanvas" {...props}>
    <div className="bg-background mx-auto my-auto h-[95vh] w-[95%] max-w-3xl rounded-xl  shadow">
    <div className="w-full h-[10%]  "><WalletHeader setActiveTab={setActiveTab}  /></div>
    <div className="w-full h-[80%] flex flex-col relative">
    <div className="w-full h-full flex justify-center items-center">


    {activeTab==="home"&&<WalletHome setActiveTab={setActiveTab} />}
    {activeTab==="receive"&&<WalletRecieve />}
    {activeTab==="send"&&<WalletSend />}
    {activeTab==="activity"&&<WalletActivity />}
    {activeTab==="settings"&&<WalletSettings />}
    {activeTab==="deposit"&&<WalletDeposit />}

      
    </div>
    <div className="text-sm text-gray-400 self-center absolute bottom-10">Deposit to get started</div>
    </div>
    
    <div className="w-full h-[10%] "><WalletFooter setActiveTab={setActiveTab} activeTab={activeTab} /></div>
    </div>
  </Sidebar>
}