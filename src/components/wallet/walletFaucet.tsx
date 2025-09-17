import { useEffect, useState } from "react";
import { checkFaucetStatus } from "@/utils/helpers";
import useFaucetClaim from "@/hooks/useFaucetClaim";
import LoadingButton from "../ui/loaderButton";
import { usePrivy } from "@privy-io/react-auth";

function WalletFaucet({ smartAccount }: { smartAccount: `0x${string}` }) {
  const [funded, setFunded] = useState(false);
  const { authenticated } = usePrivy();
  const faucetClaim = useFaucetClaim(smartAccount);

  // Trigger faucet claim
  async function handleFaucetClaim() {
    try {
      const success = await faucetClaim();
      if (success) {
        setFunded(true);
        localStorage.setItem("faucetStatus", "true");
      }
      return true;
    } catch (e) {
      console.error("Faucet claim failed", e);
      return false;
    }
  }

  useEffect(() => {
    // Check if faucet already claimed (localStorage first, then on-chain)
    const claimCheck = localStorage.getItem("faucetStatus");
    if (claimCheck === "true") {
      setFunded(true);
      return;
    }

    const checkStatus = async () => {
      try {
        const result = await checkFaucetStatus(smartAccount);
        if (result) {
          localStorage.setItem("faucetStatus", "true");
          setFunded(true);
        }
      } catch (err) {
        console.error("Error checking faucet status:", err);
      }
    };

    if (authenticated && smartAccount) checkStatus();
  }, [smartAccount, authenticated]);

  if (!authenticated) return null;

  return (
    <div id='tour-claim-faucet-btn'>
      {!funded && (
        <LoadingButton
          executeAction={handleFaucetClaim}
          idleText='click here to claim from faucet'
          loadingText='claiming'
          successText='claimed'
          variant='ghost'
          className='text-sm'
        />
      )}
    </div>
  );
}

export default WalletFaucet;
