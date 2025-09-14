"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";
import { startTour } from "../driver.js/tour";
import Image from "next/image";
import Link from "next/link";
import { IoWalletOutline } from "react-icons/io5";
import { BiQuestionMark } from "react-icons/bi";

export function DashboardHeader() {
  const { setOpen, setOpenMobile, openMobile, open } = useSidebar();
  return (
    <div className='flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) '>
      <div className='flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6'>
        <Link href={"/"}>
          <Image
            src={"/kairoslogo-light.svg"}
            alt='kairos logo'
            width={100}
            height={100}
            className='dark:hidden'
          />
          <Image
            src={"/kairoslogo-light.svg"}
            alt='kairos logo'
            width={120}
            height={120}
            className='dark:block hidden'
          />
        </Link>

        <div className='flex items-center gap-2 lg:gap-4 ml-auto'>
          <Button onClick={()=>startTour()} variant={"outline"} className='rounded-full h-8 w-8 flex bg-muted justify-center items-center'>
            <BiQuestionMark />
          </Button>
          <Separator
            orientation='vertical'
            className='ml-2 data-[orientation=vertical]:h-4 '
          />

          <Button
            variant='ghost'
            onClick={() => {
              setOpen(!open);
              setOpenMobile(!openMobile);
            }}
            className='px-2 lg:px-3'
          >
            <IoWalletOutline className='w-6! h-6!' />
          </Button>
        </div>
      </div>
    </div>
  );
}
