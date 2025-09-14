"use client";
import { Loader2, LogOut } from "lucide-react";
import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";

export default function WalletSettings() {
  function HandleLogout() {
    
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
            <SelectTrigger  >
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
        <Button variant={"destructive"} className=" w-[135px]">
          Log out
          <LogOut className='h-3 w-3' />
        </Button>
      </div>
    </div>
  );
}
