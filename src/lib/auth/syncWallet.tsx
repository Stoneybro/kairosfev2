// src/components/syncWallet.ts
"use client";
import { useEffect } from "react";
import { getAccessToken, usePrivy } from "@privy-io/react-auth";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import SvgLoading from "../../components/ui/svg-loading";
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
  const { ready, user, authenticated, login } = usePrivy();
  useEffect(() => {
    if (ready && authenticated) {
      login(); // or login() silently if supported
    }
  }, [ready, authenticated]);
  const router = useRouter();
  const wallet = user?.wallet?.address;

  const query = useQuery({
    queryKey: ["sync-session", wallet],
    queryFn: ({ signal }) => syncWalletOnServer(wallet as string, signal),
    enabled: Boolean(ready && authenticated && wallet),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
    retry: false,
  });

  useEffect(() => {
    if (!query.isFetched) return;
    (async () => {
      if (query.isError) {
        try {
          const newToken = await getAccessToken?.();
          if (newToken) {
            await query.refetch();
            return;
          }
        } catch (e) {}
        router.replace("/login");
        return;
      }

      const data = query.data as any;
      if (data?.activated) router.push("/dashboard");
      else if (data?.ok && !data?.activated) router.push("/activateWallet");
      else router.replace("/login");
    })();
  }, [query.isFetched, query.isError, query.data, router]);

  if (query.isFetching) {
    return (
      <div className=' absolute top-0 left-0 w-full h-full flex items-center justify-center bg-white/80 z-50 inset-0'>
        <div className='max-w-sm'>
          <SvgLoading />
        </div>
      </div>
    );
  }

  return null;
}
