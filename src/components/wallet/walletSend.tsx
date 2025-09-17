"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSend } from "@/hooks/useSend";
import LoaderButton from "../ui/loaderButton";
import { toast } from "sonner";
import { formatEther, parseEther } from "viem";
import { useQuery } from "@tanstack/react-query";
import { fetchDashboardBalance } from "@/utils/helpers";
import { useMemo } from "react";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";

/**
 * Builds Zod schema for validation.
 * - address: optional, must match ETH format if provided
 * - amount: numeric > 0 and <= availableBalance
 */
function createSchema(availableBalance?: string) {
  return z
    .object({
      address: z
        .string()
        .optional()
        .refine((v) => {
          if (!v) return true;
          return /^0x[a-fA-F0-9]{40}$/.test(v);
        }, "Invalid Ethereum address"),
      amount: z
        .string()
        .regex(/^\d+(\.\d+)?$/, "Enter a valid number")
        .refine((v) => Number(v) > 0, "amount must be > 0"),
    })
    .superRefine((vals, ctx) => {
      // ensure user cannot send more than available balance
      if (vals.amount) {
        try {
          const amountWei = parseEther(vals.amount);
          const availWei = availableBalance
            ? parseEther(String(availableBalance))
            : 0n;
          if (amountWei > availWei) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["amount"],
              message: "amount is greater than available balance",
            });
          }
        } catch {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["amount"],
            message: "Invalid amount value",
          });
        }
      }
    });
}

type SendValues = z.infer<ReturnType<typeof createSchema>>;

/**
 * WalletSend
 *
 * Send ETH from the connected smart account.
 * - Validates inputs with Zod + react-hook-form
 * - Prevents overspending
 * - Shows balance and transaction status
 */
export default function WalletSend({
  smartAccount,
}: {
  smartAccount: `0x${string}`;
}) {
  // query current balance
  const { data: cardData, isLoading: cardDataIsLoading } = useQuery({
    queryKey: ["dashboardBalance", smartAccount],
    queryFn: () => fetchDashboardBalance(smartAccount as `0x${string}`),
    enabled: Boolean(smartAccount),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
  });

  // schema bound to live availableBalance
  const schema = useMemo(
    () => createSchema(cardData?.availableBalance),
    [cardData?.availableBalance]
  );

  const send = useSend(smartAccount);

  // react-hook-form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm<SendValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      address: "",
      amount: "0",
    },
  });

  // submit handler
  async function handleSend(values: SendValues) {
    if (!isValid) return false;
    const payload = {
      address: values.address as `0x${string}`,
      amount: parseEther(values.amount),
    };
    try {
      await send.mutateAsync(payload);
      toast.success(`${formatEther(payload.amount)} ETH sent successfully`);
      reset();
      return true;
    } catch (error) {
      console.log("sending failed", error);
      toast.error("sending failed");
      return false;
    }
  }

  return (
    <div className="px-4 flex flex-col w-full h-full gap-4 pt-8">
      {/* recipient address */}
      <div>
        <label className="text-sm text-muted-foreground">Address</label>
        <Input {...register("address")} placeholder="" required />
        {errors.address && (
          <div className="text-sm mt-1 text-red-500">
            {errors.address.message}
          </div>
        )}
      </div>

      {/* send amount */}
      <div>
        <label className="text-sm text-muted-foreground">Amount (ETH)</label>
        <Input {...register("amount")} placeholder="0.00" inputMode="decimal" />
        <div className="text-muted-foreground text-xs text-end mt-1">
          balance:
          {cardDataIsLoading ? (
            <Skeleton className="h-2 w-4" />
          ) : (
            cardData?.availableBalance
          )}
          ETH
        </div>
        {errors.amount && (
          <div className="text-sm text-red-500">{errors.amount.message}</div>
        )}
      </div>

      {/* submit button */}
      <LoaderButton
        className="w-full"
        idleText="send"
        loadingText="sending..."
        successText="sent!"
        disabled={isSubmitting}
        timeoutMs={60000}
        executeAction={async () => {
          let success = false;
          await handleSubmit(async (values) => {
            success = await handleSend(values);
          })();
          return success;
        }}
      />
    </div>
  );
}
