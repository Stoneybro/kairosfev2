"use client"
import { Loader2, LogOut } from 'lucide-react';
import React, { useState, useEffect } from 'react';


import { Button } from '../ui/button';
import { ThemeToggle } from './themetToggle';

export default function WalletSettings () {
  const [logOut,setLogOut]=useState<"LogOut"|"Logging Out">("LogOut")

  return (
    <div className='flex flex-col  h-full w-full p-4'>
      <div className=' text-2xl font-semibold flex justify-start'>
        <div className=''> Settings</div>
      </div>

    

    {/* theme toggle */}
    <ThemeToggle />
    {/* log out */}
      <button  className="flex gap-2  px-3 mt-8 py-2 rounded-lg bg-muted/40 hover:bg-muted/70 border   text-destructive items-center cursor-pointer">
       {logOut==="Logging Out" && <Loader2 className='animate-spin' />}
        {logOut}
        <LogOut className='h-3 w-3' />
      </button >

    </div>
  );
};

