import React, { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchWalletActivity} from "@/utils/helpers";
import { formatNumber } from "@/utils/format";
import { Tx } from "@/types";
import { getTransactionType } from "@/utils/helpers";
import { BsSendCheck } from "react-icons/bs";
import { CgFileDocument } from "react-icons/cg";
import { GrCycle } from "react-icons/gr";
import ActivitySkeleton from "./activitySkeleton";

export default function Activity({ smartAccount }: { smartAccount: `0x${string}` }) {
  // Infinite query to fetch paginated wallet activity
  const { data, isLoading, error } = useInfiniteQuery({
    queryKey: ["wallet-activity", smartAccount],
    queryFn: ({ pageParam = 1 }) => fetchWalletActivity({ pageParam, smartAccount }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: Tx[], allPages) =>
      lastPage.length < 10 ? undefined : allPages.length + 1,
    staleTime: 60_000,
    retry: 2,
  })

  const allTxs = data ? data.pages.flat() : []

  // Deduplicate by tx hash, keep incoming version if duplicates exist
  const dedupedTxs = useMemo(() => {
    const txMap = new Map<string, Tx>()
    allTxs.forEach(tx => {
      const hash = tx.transactionHash
      const { isIncoming } = getTransactionType(tx, smartAccount)
      if (!txMap.has(hash)) txMap.set(hash, tx)
      else {
        const existing = txMap.get(hash)!
        const { isIncoming: existingIncoming } = getTransactionType(existing, smartAccount)
        if (isIncoming && !existingIncoming) txMap.set(hash, tx)
      }
    })
    return Array.from(txMap.values())
  }, [allTxs, smartAccount])

  if (isLoading) return <ActivitySkeleton />
  if (error) return <div className="w-full text-center">Failed to load activity.</div>
  if (!isLoading && dedupedTxs.length === 0) return <div className="w-full text-center">No activity yet.</div>

  return (
    <div className="flex flex-col gap-2 px-4 mb-auto w-full">
      <div className="text-2xl font-medium">Activity</div>
      <div className="bg-muted rounded-xl py-2 px-4 w-full text-xs">Task transactions are not available</div>
      <div className="w-full">
        {dedupedTxs.map((tx, i) => {
          const { type } = getTransactionType(tx, smartAccount)
          return (
            <a
              key={`${tx.transactionHash}-${i}`}
              href={`https://base-sepolia.blockscout.com/tx/${tx.transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex justify-between hover:bg-muted px-2 w-full border-b items-center py-3"
            >
              <div className="flex items-center gap-2">
                {type === "Received" && <BsSendCheck className="rotate-90" />}
                {type === "Sent" && <BsSendCheck />}
                {type === "Deploy Contract" && <CgFileDocument />}
                {type === "Recurring Buy" && <GrCycle />}
                <div>{type}</div>
              </div>
              <div className="flex flex-col items-center">
                <div>{formatNumber(BigInt(tx.value))} ETH</div>
              </div>
            </a>
          )
        })}
      </div>
    </div>
  )
}
