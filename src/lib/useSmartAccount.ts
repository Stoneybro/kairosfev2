import { useEffect, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { getSmartAccountClient } from "./smartAccountClient";
import { SmartAccountClient } from "permissionless";
import { useWallets } from "@privy-io/react-auth";
import useCustomSmartAccount from "./customSmartAccount";
import { init } from "next/dist/compiled/webpack/webpack";

export function useSmartAccount() {
  const [smartAccountClient, setSmartAccountClient] =
    useState<SmartAccountClient | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { ready, authenticated, user } = usePrivy();
  const { wallets } = useWallets();
  const embeddedWallet = wallets[0];
  const {initCustomAccount,isLoading:isClientReady,error:clientError} = useCustomSmartAccount();

  
  const initClient=async ()=>{
    if (!ready || !authenticated || !embeddedWallet){
      throw new Error("Privy is not ready or user is not authenticated");
    };
    if (clientError) {
      throw new Error("Error initializing Smart Account Client");
    }
    if (smartAccountClient) {
      console.log("Smart Account Client already initialized", smartAccountClient.account?.address);
      return smartAccountClient; // Already initialized
    }
    if (isClientReady) {
      throw new Error("Smart Account Client is still loading");
    }
    console.log("Initializing Smart Account Client...");
    try {
      const customSmartAccount = await initCustomAccount();
      if (!customSmartAccount) {
        throw new Error("Custom Smart Account is undefined");
      }
      const client = await getSmartAccountClient(customSmartAccount);
      setSmartAccountClient(client);
      return client;
    } catch (error) {
      setError(error as Error);
      console.log("Error initializing Smart Account Client", error);
    } finally {
      setIsLoading(false);
    }
  }



  return {
   initClient,
    isLoading,
    error,
  };
}
