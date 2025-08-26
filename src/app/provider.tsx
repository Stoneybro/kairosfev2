"use client"
import React from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { PrivyProvider } from "@privy-io/react-auth";
import { privyConfig } from "@/lib/privyConfig";
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
function provider({ children }: { children: ReactNode }) {
  return (
    <PrivyProvider appId='cmd8m1w3p0031jy0mmmon7ytw' config={privyConfig}>
      <QueryClientProvider client={new QueryClient()}>
      <Toaster position='top-center' />
      {/* <ThemeProvider
        attribute={"class"}
        defaultTheme='light'
        enableSystem={true}
      > */}
        {children}
      {/* </ThemeProvider> */}
      </QueryClientProvider>
    </PrivyProvider>
  );
}

export default provider;
