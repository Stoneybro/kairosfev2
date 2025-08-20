"use client"
import {QRCodeCanvas} from "qrcode.react"
import { Copy } from 'lucide-react';
import CopyText from '../ui/copy';

export default function WalletRecieve () {

  const qrValue = `ethereum`

  return (
    <div className='flex flex-col p-4 w-full justify-center items-center'>
          <QRCodeCanvas value={qrValue} size={250} className=' dark:border-accent border-2 rounded-xl' />
             <div className='bg-muted   rounded-lg mt-5 p-3 flex justify-between items-center w-full cursor-pointer'>
                 <span className=' '>0x1Edeb...B5b7d7</span>
                <CopyText text={"0x1Edeb...B5b7d7"} />
               </div>
       </div>
  );
};
