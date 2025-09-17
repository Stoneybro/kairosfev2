"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";
import { startTour } from "../driver.js/tour";
import Image from "next/image";
import Link from "next/link";
import { IoWalletOutline } from "react-icons/io5";
import { BiQuestionMark } from "react-icons/bi";

/**
 * Dashboard top navigation bar.
 * - Shows logo
 * - Provides "Help/Tour" button
 * - Toggles sidebar (desktop + mobile)
 */
export function DashboardHeader() {
  const { setOpen, setOpenMobile, openMobile, open } = useSidebar();

  return (
    <div
      className='flex h-(--header-height) shrink-0 items-center gap-2 border-b 
                 transition-[width,height] ease-linear 
                 group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)'
    >
      <div className='flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6'>
        {/* Logo with dark/light mode variations */}
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
            className='hidden dark:block'
          />
        </Link>

        <div className='ml-auto flex items-center gap-2 lg:gap-4'>
          {/* Help / Start Tour */}
          <Button
            onClick={() => startTour()}
            variant='outline'
            className='flex h-8 w-8 items-center justify-center rounded-full bg-muted'
          >
            <BiQuestionMark />
          </Button>

          <Separator
            orientation='vertical'
            className='ml-2 data-[orientation=vertical]:h-4'
          />

          {/* Sidebar toggle */}
          <Button
            variant='ghost'
            onClick={() => {
              setOpen(!open);
              setOpenMobile(!openMobile);
            }}
            className='px-2 lg:px-3'
          >
            <IoWalletOutline className='!h-6 !w-6' />
          </Button>
        </div>
      </div>
    </div>
  );
}
