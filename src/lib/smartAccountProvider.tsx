"use client";

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useWallets } from "@privy-io/react-auth";
import { getSmartAccountClient } from "@/lib/smartAccountClient";
import useCustomSmartAccount from "@/lib/customSmartAccount";
import type { SmartAccountClient } from "permissionless";

type ContextValue = {
  client: SmartAccountClient | null;
  isInitializing: boolean;
  error: Error | null;
  getClient: () => Promise<SmartAccountClient>;
};

const SmartAccountContext = createContext<ContextValue | undefined>(undefined);

export function SmartAccountProvider({ children }: { children: React.ReactNode }) {
  const { ready, authenticated } = usePrivy();
  const { wallets } = useWallets();
  const embeddedWallet = wallets?.find((w) => w.walletClientType === "privy");

  const { initCustomAccount, isLoading: isCustomLoading, error: customError } =
    useCustomSmartAccount();

  const [client, setClient] = useState<SmartAccountClient | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const initPromiseRef = useRef<Promise<SmartAccountClient | null> | null>(null);
  const retryTimerRef = useRef<number | null>(null);
  const backoffRef = useRef<number>(1000); // start 1s, double on fail

  const clearRetry = () => {
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
    backoffRef.current = 1000;
  };

  const initialize = useCallback(
    async (force = false): Promise<SmartAccountClient | null> => {
      // avoid duplicate inits
      if (initPromiseRef.current && !force) return initPromiseRef.current;

      const promise = (async () => {
        setError(null);

        if (!ready || !authenticated || !embeddedWallet) {
          setError(new Error("User not authenticated or Privy not ready"));
          return null;
        }

        if (customError) {
          setError(new Error("Custom account initialization error"));
          return null;
        }

        // If a valid client exists, return it (light validation)
        if (client && !force) {
          try {
            if (client.account && typeof client.sendUserOperation === "function") {
              return client;
            }
          } catch {
            // fall through to re-init
            setClient(null);
          }
        }

        setIsInitializing(true);
        try {
          const custom = await initCustomAccount();
          if (!custom) throw new Error("Custom smart account unavailable");
          const c = await getSmartAccountClient(custom);
          setClient(c);
          clearRetry();
          return c;
        } catch (err) {
          const thrown = err instanceof Error ? err : new Error(String(err));
          setError(thrown);
          // schedule retry with backoff
          clearRetry();
          const delay = backoffRef.current;
          retryTimerRef.current = window.setTimeout(() => {
            initialize(true).catch(() => {});
          }, delay);
          backoffRef.current = Math.min(backoffRef.current * 2, 60_000);
          return null;
        } finally {
          setIsInitializing(false);
          initPromiseRef.current = null;
        }
      })();

      initPromiseRef.current = promise;
      return promise;
    },
    [ready, authenticated, embeddedWallet, customError, client, initCustomAccount]
  );

  // public getter that throws if client is unavailable
  const getClient = useCallback(async (): Promise<SmartAccountClient> => {
    const c = await initialize();
    if (!c) throw new Error("Smart account client not available. Reconnect or try again.");
    return c;
  }, [initialize]);

  // initialize on mount when auth ready
  useEffect(() => {
    // only attempt if auth/wallet ready
    if (ready && authenticated && embeddedWallet) {
      initialize().catch(() => {});
    } else {
      // clear client if user logged out or wallet changed
      setClient(null);
      setError(null);
      clearRetry();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, authenticated, embeddedWallet?.address]);

  // re-attempt init on window focus (handles idle sessions)
  useEffect(() => {
    const onFocus = () => {
      if (!client && ready && authenticated && embeddedWallet) {
        initialize().catch(() => {});
      }
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, ready, authenticated, embeddedWallet?.address]);

  // cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
      }
    };
  }, []);

  return (
    <SmartAccountContext.Provider
      value={{
        client,
        isInitializing,
        error,
        getClient,
      }}
    >
      {children}
    </SmartAccountContext.Provider>
  );
}

export function useSmartAccountContext() {
  const ctx = useContext(SmartAccountContext);
  if (!ctx) throw new Error("useSmartAccountContext must be used inside SmartAccountProvider");
  return ctx;
}
