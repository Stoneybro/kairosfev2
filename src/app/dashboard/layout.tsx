"use client";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { WalletSidebar } from "@/components/wallet/walletSidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import SvgLoading from "@/components/ui/svg-loading";
import { useEffect } from "react";
export default function Dashboard({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { ready, authenticated } = usePrivy();
  const router = useRouter();
  useEffect(() => {
    if (!ready) return;
    if (!authenticated) router.push("/login");
  }, [ready, authenticated, router]);
  if (!ready) {
    return (
      <div className='w-full h-[100vh] flex justify-center items-center'>
        <div className=' h-[20vh] w-[20vw]'>
          <SvgLoading />
        </div>
      </div>
    );
  }
  if (!authenticated) return null;
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 95)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <SidebarInset>
        <div className='flex flex-1 flex-col  shadow '>
          <DashboardHeader />
          <div className='@container/main flex flex-1 flex-col gap-2'>
            <div className='flex flex-col gap-4 px-6 lg:px-8   py-4 md:gap-6 md:py-6'>
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
      <WalletSidebar variant='inset' side='right' />
    </SidebarProvider>
  );
}
