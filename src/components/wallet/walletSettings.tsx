"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import LoaderButton from "../ui/loaderButton";
import { toast } from "sonner";

export default function WalletSettings() {
  const { ready, authenticated, logout } = usePrivy();
  const router = useRouter();
  const disabled = !ready || (ready && !authenticated);
  async function handleLogout() {
    try {
      await logout();
       await fetch("/api/session/logout", { method: "POST" });
      localStorage.clear();
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
      });
      router.push("/");
      return true;
    } catch (error) {
      console.log("logout error", error);
      toast.error("failed to logout");
      return false;
    }
  }
  return (
    <div className='flex flex-col  h-full w-full p-4'>
      <div className=' text-2xl font-semibold flex justify-start'>
        <div className=''> Settings</div>
      </div>
      <div className='flex flex-col gap-4'>
        <div className='flex flex-col gap-2 mt-4 '>
          <div className=''>Chain</div>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder='Base sepolia' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Chains</SelectLabel>
                <SelectItem value='baseSepolia'>Base sepolia</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <LoaderButton
        executeAction={handleLogout}
        idleText="LogOut"
        loadingText="Logging Out"
        successText="Logged Out"
        disabled={disabled}
        variant="destructive"
        className=' w-[135px]'
        />
      </div>
    </div>
  );
}
