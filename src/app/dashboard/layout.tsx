
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { WalletSidebar } from "@/components/wallet/walletSidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { getSmartAccountAddress } from "./page";

export default async function Dashboard({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

const smartAccount= await getSmartAccountAddress()
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
      <WalletSidebar variant='inset' side='right' smartAccount={smartAccount}  />
    </SidebarProvider>
  );
}
