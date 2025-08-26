// src/components/syncWallet.ts
"use client";
import { useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import SvgLoading from "./svg-loading";
async function syncWalletOnServer(walletAddr: string, signal?: AbortSignal) {
  const res = await fetch("/api/session/sync", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ walletAddress: walletAddr }),
    signal,
  });
  if (!res.ok) throw new Error("Failed to sync wallet");
  return res.json();
}

export default function SyncWalletAfterLogin() {
  const { ready,user, authenticated } = usePrivy();
  const router = useRouter();
  const wallet = user?.wallet?.address;

  const query = useQuery({
    queryKey: ["sync-session", wallet],
    queryFn: ({ signal }) => syncWalletOnServer(wallet as string, signal),
    enabled: Boolean(ready && authenticated && wallet),
    retry: 0,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!query.isFetched) return;
    if (query.isError) {
      router.push("/login");
      return;
    }
    const data = query.data as any;
    if (data?.activated) router.push("/dashboard");
    else if (data?.ok && !data?.activated) router.push("/activateWallet");
    else router.push("/login");
  }, [query.isFetched, query.isError, query.data, router]);

  if (query.isFetching) {
    return <div className=" absolute top-0 left-0 w-full h-full flex items-center justify-center bg-white/80 z-50 inset-0">
      <div className="max-w-sm"><SvgLoading /></div>
    </div>;
  }
  
return null;
}
