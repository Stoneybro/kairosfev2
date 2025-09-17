"use client";
import React, { useState } from "react";
import { Toaster } from "sonner";
import { PrivyProvider } from "@privy-io/react-auth";
import { privyConfig } from "@/lib/privyConfig";
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SmartAccountProvider } from "@/lib/smartAccountProvider";
import { AppProgressProvider as ProgressProvider } from "@bprogress/next";
function provider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <PrivyProvider appId='cmd8m1w3p0031jy0mmmon7ytw' config={privyConfig}>
      <QueryClientProvider client={queryClient}>
        <SmartAccountProvider>
        <Toaster position='top-center' />
        <ProgressProvider
          height='4px'
          color='#ffffff'
          options={{ showSpinner: false }}
          shallowRouting
        >
          {children}
        </ProgressProvider>
        </SmartAccountProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}

export default provider;
