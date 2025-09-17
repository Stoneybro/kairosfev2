"use client";
import { useEffect } from "react";
import { getAccessToken, usePrivy } from "@privy-io/react-auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";


// Send wallet address + auth token to server for session sync
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

// Sync wallet with server, retry if token is stale
async function syncWalletOnServer(walletAddr: string, signal?: AbortSignal) {
  const token = (await getAccessToken?.()) ?? "";
  let res = await doFetch({ walletAddress: walletAddr }, token, signal);

  // Refresh token if backend signals grace period
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

// Handles wallet sync after login and redirects based on activation state
export default function SyncWalletAfterLogin({ isActivating = false }: SyncWalletAfterLoginProps) {
  const { ready, user, authenticated } = usePrivy();
  const router = useRouter();
  const queryClient = useQueryClient();
  const wallet = user?.wallet?.address;

  // Query to sync wallet session with server
  const query = useQuery({
    queryKey: ["sync-session", wallet],
    queryFn: ({ signal }) => syncWalletOnServer(wallet as string, signal),
    enabled: Boolean(ready && authenticated && wallet && !isActivating), // disable during activation
    refetchOnWindowFocus: false,
    refetchInterval: 4 * 60 * 1000,
    refetchOnReconnect: false,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  // Refetch session when tab becomes visible
  useEffect(() => {
    const onVisibility = async () => {
      if (document.visibilityState !== "visible") return;
      try {
        await getAccessToken?.();
        await queryClient.refetchQueries({ queryKey: ["sync-session", wallet] });
      } catch {}
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [queryClient, wallet]);

  // Refetch session on network reconnect
  useEffect(() => {
    const onOnline = async () => {
      try {
        await getAccessToken?.();
        await queryClient.refetchQueries({ queryKey: ["sync-session", wallet] });
      } catch {}
    };
    window.addEventListener("online", onOnline);
    return () => window.removeEventListener("online", onOnline);
  }, [queryClient, wallet]);

  // Redirect user based on sync result
  useEffect(() => {
    if (!query.isFetched || isActivating) return;

    (async () => {
      if (query.isError) {
        try {
          const newToken = await getAccessToken?.();
          if (newToken) {
            await query.refetch();
            return;
          }
        } catch {}
        if (!isActivating) router.replace("/login");
        return;
      }

      const data = query.data as any;
      if (data?.activated) {
        router.push("/dashboard");
      } else if (data?.ok && !data?.activated) {
        if (window.location.pathname !== "/activatewallet") {
          router.push("/activatewallet");
        }
      } else {
        if (!isActivating) router.replace("/login");
      }
    })();
  }, [query.isFetched, query.isError, query.data, router, isActivating]);

  return null;
}
