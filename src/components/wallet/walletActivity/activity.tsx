import React, { useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchWalletActivity, formatNumber } from "@/utils/helpers";
import { Tx } from "@/types";
import { getTransactionType } from "@/utils/helpers";
import { BsSendCheck } from "react-icons/bs";
import { CgFileDocument } from "react-icons/cg";
import { GrCycle } from "react-icons/gr";
import ActivitySkeleton from "./activitySkeleton";

function Activity({ smartAccount }: { smartAccount: `0x${string}` }) {
  const { data, isLoading, error } = useInfiniteQuery({
    queryKey: ["wallet-activity", smartAccount],
    queryFn: ({ pageParam = 1 }) =>
      fetchWalletActivity({ pageParam, smartAccount }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: Tx[], allPages) =>
      lastPage.length < 10 ? undefined : allPages.length + 1,
    staleTime: 1000 * 60,
    retry: 2,
  });

  const allTxs = data ? data.pages.flat() : [];
  
  // Deduplicate transactions by hash, preferring incoming/received transactions
  const deduplicatedTxs = React.useMemo(() => {
    if (allTxs.length === 0) return [];
    
    const txMap = new Map<string, Tx>();
    
    allTxs.forEach(tx => {
      const hash = tx.transactionHash;
      const { isIncoming } = getTransactionType(tx, smartAccount);
      
      if (!txMap.has(hash)) {
        // First occurrence of this hash
        txMap.set(hash, tx);
      } else {
        // Duplicate found - keep the incoming one if current tx is incoming
        // and existing one is not, otherwise keep the existing one
        const existingTx = txMap.get(hash)!;
        const { isIncoming: existingIsIncoming } = getTransactionType(existingTx, smartAccount);
        
        if (isIncoming && !existingIsIncoming) {
          txMap.set(hash, tx);
        }
      }
    });
    
    return Array.from(txMap.values());
  }, [allTxs, smartAccount]);

  if (isLoading) return <ActivitySkeleton />;
  if (error) {
    return <div className='w-full text-center'>Failed to load activity.</div>;
  }

  if (!isLoading && deduplicatedTxs.length === 0) {
    return <div className='w-full text-center'>No activity yet.</div>;
  }

  console.log('Original transactions:', allTxs.length);
  console.log('Deduplicated transactions:', deduplicatedTxs.length);

  return (
    <div className='flex flex-col gap-2 justify-start items-start px-4 mb-auto w-full'>
      <div className='text-2xl font-medium'>Activity</div>
      <div className='bg-muted rounded-xl py-2 px-4 w-full text-xs'>
        Task transactions are not available
      </div>
      <div className='w-full'>
        {deduplicatedTxs.map((tx, index) => {
          const { type, isIncoming } = getTransactionType(tx, smartAccount);
          return (
            <a
              href={`https://base-sepolia.blockscout.com/tx/${tx.transactionHash}`}
              target='_blank'
              rel='noopener noreferrer'
              key={`${tx.transactionHash}-${index}`}
              className='flex justify-between hover:bg-muted px-2 w-full border-b items-center py-3'
            >
              <div className='flex items-center gap-2'>
                <div className=''>
                  {type == "Received" && <BsSendCheck className='rotate-90' />}
                  {type == "Sent" && <BsSendCheck className=' ' />}
                  {type == "Deploy Contract" && <CgFileDocument />}
                  {type == "Recurring Buy" && <GrCycle />}
                </div>
                <div className=''>{type}</div>
              </div>
              <div className='flex flex-col items-center justify-center gap-1'>
                <div className=''>{formatNumber(BigInt(tx.value))} ETH</div>
                <div className='text-[10px]'></div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}

export default Activity;