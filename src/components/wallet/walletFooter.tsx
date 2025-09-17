"use client"
import { RiHome6Line } from "react-icons/ri"
import { FiClock } from "react-icons/fi"
import { IoSettingsOutline } from "react-icons/io5"
import { activeTabType } from "@/types"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

type WalletFooterProps = {
  setActiveTab: (tab: activeTabType) => void
  activeTab: activeTabType
}

export default function WalletFooter({
  setActiveTab,
  activeTab,
}: WalletFooterProps) {
  return (
    <div className="w-full h-full flex items-start justify-center">
      {/* Toggle footer tabs */}
      <ToggleGroup
        type="single"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-[60%]"
      >
        <ToggleGroupItem value="home" aria-label="home">
          <RiHome6Line className="!h-6 !w-6" />
        </ToggleGroupItem>

        <ToggleGroupItem
          value="activity"
          aria-label="activity"
          id="tour-wallet-activity"
        >
          <FiClock className="!h-6 !w-6" />
        </ToggleGroupItem>

        <ToggleGroupItem
          value="settings"
          aria-label="settings"
          id="tour-settings"
        >
          <IoSettingsOutline className="!h-6 !w-6" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}
