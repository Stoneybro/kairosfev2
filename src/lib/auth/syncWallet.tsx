// lib/auth/syncWallet.ts
"use client";
import { useEffect } from "react";
import { getAccessToken, usePrivy } from "@privy-io/react-auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import SvgLoading from "../../components/ui/spinner";

async function doFetch(
  body: { walletAddress: string },
  token: string,
  signal?: AbortSignal
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  return fetch("/api/session/sync", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
    signal,
    credentials: "same-origin",
  });
}

async function syncWalletOnServer(walletAddr: string, signal?: AbortSignal) {
  const token = (await getAccessToken?.()) ?? "";
  let res = await doFetch({ walletAddress: walletAddr }, token, signal);
  if (res.headers.get("x-auth-grace") === "1") {
    try {
      await getAccessToken?.(); // force refresh
    } catch {}
    const refreshedToken = (await getAccessToken?.()) ?? "";
    res = await doFetch({ walletAddress: walletAddr }, refreshedToken, signal);
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error("Failed to sync wallet: " + res.status + " " + text);
  }
  return res.json();
}

interface SyncWalletAfterLoginProps {
  isActivating?: boolean;
}

export default function SyncWalletAfterLogin({ isActivating = false }: SyncWalletAfterLoginProps) {
  const { ready, user, authenticated, login } = usePrivy();
  const router = useRouter();
  const queryClient = useQueryClient();
  const wallet = user?.wallet?.address;

  const query = useQuery({
    queryKey: ["sync-session", wallet],
    queryFn: ({ signal }) => syncWalletOnServer(wallet as string, signal),
    enabled: Boolean(ready && authenticated && wallet && !isActivating), // Disable query during activation
    refetchOnWindowFocus: false,
    refetchInterval: 4 * 60 * 1000,
    refetchOnReconnect: false,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  useEffect(() => {
    const onVisibility = async () => {
      if (document.visibilityState !== "visible") return;
      try {
        await getAccessToken?.();
        await queryClient.refetchQueries({
          queryKey: ["sync-session", wallet],
        });
      } catch {}
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [queryClient, wallet]);

  // Network reconnect handler
  useEffect(() => {
    const onOnline = async () => {
      try {
        await getAccessToken?.();
        await queryClient.refetchQueries({
          queryKey: ["sync-session", wallet],
        });
      } catch {}
    };
    window.addEventListener("online", onOnline);
    return () => window.removeEventListener("online", onOnline);
  }, [queryClient, wallet]);

  useEffect(() => {
    // Skip navigation logic if currently activating wallet
    if (!query.isFetched || isActivating) {
      return;
    }
    

    
    (async () => {
      if (query.isError) {
        try {
          const newToken = await getAccessToken?.();
          if (newToken) {
            await query.refetch();
            return;
          }
        } catch (e) {}
        // Only redirect to login if we're not in the middle of activation
        if (!isActivating) {
          router.replace("/login");
        }
        return;
      }

      const data = query.data as any;
      if (data?.activated) {
        router.push("/dashboard");
      } else if (data?.ok && !data?.activated) {
        // Only redirect to activate wallet if we're not already there
        if (window.location.pathname !== "/activatewallet") {
          router.push("/activatewallet");
        }
      } else {
        // Only redirect to login if we're not in the middle of activation
        if (!isActivating) {
          router.replace("/login");
        }
      }
    })();
  }, [query.isFetched, query.isError, query.data, router, isActivating]);

  return null;
}