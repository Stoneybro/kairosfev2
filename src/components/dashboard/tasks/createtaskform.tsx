"use client";

import React, { useMemo } from "react";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PenaltyType } from "@/types";
import { parseEther } from "viem";
import { fetchDashboardBalance } from "@/utils/helpers";
import { useQuery } from "@tanstack/react-query";
import DatePicker from "@/components/dashboard/tasks/datePicker";
import { Skeleton } from "@/components/ui/skeleton";
import { useCreateTask } from "@/hooks/web3/useCreateTask";
function createSchema(availableBalance?: string) {
  return z
    .object({
      title: z.string().min(4, "title must be at least 4 characters"),
      description: z
        .string()
        .min(10, "Description must be at least 10 characters"),
      rewardEth: z
        .string()
        .regex(/^\d+(\.\d+)?$/, "Enter a valid number")
        .refine((v) => Number(v) > 0, "Reward must be > 0"),
      deadline: z.instanceof(Date).nullable(),

      penaltyType: z.nativeEnum(PenaltyType),
      delayDays: z
        .string()
        .optional()
        .refine(
          (v) =>
            v === undefined ||
            v === "" ||
            (!isNaN(Number(v)) && Number(v) >= 0),
          {
            message: "Invalid days",
          }
        ),
      delayHours: z
        .string()
        .optional()
        .refine(
          (v) =>
            v === undefined ||
            v === "" ||
            (!isNaN(Number(v)) && Number(v) >= 0 && Number(v) <= 23),
          {
            message: "Invalid hours",
          }
        ),
      buddyAddress: z
        .string()
        .optional()
        .refine((v) => {
          if (!v) return true;
          return /^0x[a-fA-F0-9]{40}$/.test(v);
        }, "Invalid Ethereum address"),
    })
    .superRefine((vals, ctx) => {
      // 1) reward <= available balance
      if (vals.rewardEth) {
        try {
          const rewardWei = parseEther(vals.rewardEth); // bigint
          const availWei = availableBalance
            ? parseEther(String(availableBalance))
            : 0n;
          if (rewardWei > availWei) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["rewardEth"],
              message: "Reward is greater than available balance",
            });
          }
        } catch {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["rewardEth"],
            message: "Invalid reward value",
          });
        }
      }

      // 2) deadline must be in future (if provided)
      if (vals.deadline) {
        const nowSec = Math.floor(Date.now() / 1000);
        const deadlineSec = Math.floor(vals.deadline.getTime() / 1000);
        if (deadlineSec <= nowSec) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["deadline"],
            message: "Deadline must be in the future",
          });
        }
      }

      // 3) chosen penalty input must be filled
      if (vals.penaltyType === PenaltyType.DELAY_PAYMENT) {
        const days = vals.delayDays?.trim() ?? "";
        const hours = vals.delayHours?.trim() ?? "";
        const daysNum = days === "" ? 0 : Number(days);
        const hoursNum = hours === "" ? 0 : Number(hours);

        if (
          (days === "" || Number.isNaN(daysNum)) &&
          (hours === "" || Number.isNaN(hoursNum))
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["delayDays"],
            message: "Specify delay in days or hours.",
          });
        } else if (daysNum < 0 || hoursNum < 0 || hoursNum > 23) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["delayDays"],
            message: "Invalid delay duration.",
          });
        }
      }

      if (vals.penaltyType === PenaltyType.SEND_BUDDY) {
        const addr = vals.buddyAddress ?? "";
        if (!addr || !/^0x[a-fA-F0-9]{40}$/.test(addr)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["buddyAddress"],
            message: "Buddy address is required and must be a valid address.",
          });
        }
      }
    });
}

/* ---------- Form component ---------- */

type FormValues = z.infer<ReturnType<typeof createSchema>>;

export default function CreateTaskForm({
  onSubmit,
  smartAccount,
}: {
  onSubmit?: (payload: any) => Promise<any> | void;
  smartAccount?: `0x${string}`;
}) {
  const { data: cardData, isLoading: cardDataIsLoading } = useQuery({
    queryKey: ["dashboardBalance", smartAccount],
    queryFn: () => fetchDashboardBalance(smartAccount as `0x${string}`),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
  });

  // build schema with the latest availableBalance
  const schema = useMemo(
    () => createSchema(cardData?.availableBalance),
    [cardData?.availableBalance]
  );
  const createTask = useCreateTask(smartAccount as `0x${string}`);
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      rewardEth: "",
      deadline: null,
      penaltyType: PenaltyType.DELAY_PAYMENT,
      delayDays: "",
      delayHours: "",
      buddyAddress: "",
    },
  });

  const penaltyType = watch("penaltyType");

  async function handleCreate(values: FormValues) {
    const delaySeconds =
      values.delayDays || values.delayHours
        ? Number(values.delayDays || 0) * 24 * 3600 +
          Number(values.delayHours || 0) * 3600
        : 0;
    const now = new Date();
    const defaultDeadline = Math.floor(now.getTime() / 1000) + 3600;
    const payload = {
      taskDescription: values.description,
      rewardAmount: parseEther(values.rewardEth), // bigint
      deadlineInSeconds: values.deadline
        ? BigInt(Math.floor(values.deadline.getTime() / 1000))
        : BigInt(defaultDeadline),
      penaltyChoice: values.penaltyType === PenaltyType.DELAY_PAYMENT ? 1 : 2,
      sendBuddy:
        values.buddyAddress as `0x${string}` || "0x0000000000000000000000000000000000000000",
      delayPayment:BigInt(delaySeconds),
    };

    try {
      console.log(payload)
      createTask.mutate(payload);
    } catch (err) {
      console.error("create task failed", err);
      throw err;
    }
  }

  return (
    <form onSubmit={handleSubmit(handleCreate)} className='max-w-xl'>
      <div className='flex flex-col gap-4 w-full'>
        <div className='text-3xl'>Create Task</div>

        {/* title */}
        <div>
          <label className='text-sm text-muted-foreground'>Task title</label>
          <Input {...register("title")} placeholder='' required />
          {errors.title && (
            <div className='text-sm mt-1 text-red-500'>
              {errors.title.message}
            </div>
          )}
        </div>

        {/* description */}
        <div>
          <label className='text-sm text-muted-foreground'>
            Task Description
          </label>
          <Input {...register("description")} placeholder='' required />
          {errors.description && (
            <div className='text-sm mt-1 text-red-500'>
              {errors.description.message}
            </div>
          )}
        </div>

        {/* reward */}
        <div>
          <label className='text-sm text-muted-foreground'>
            Reward Amount (ETH)
          </label>
          <Input
            {...register("rewardEth")}
            placeholder='0.00'
            inputMode='decimal'
          />
          <div className='text-muted-foreground text-xs text-end mt-1'>
            balance:
            {cardDataIsLoading ? (
              <Skeleton className='h-2 w-4' />
            ) : (
              cardData?.availableBalance
            )}{" "}
            ETH
          </div>
          {errors.rewardEth && (
            <div className='text-sm text-red-500'>
              {errors.rewardEth.message}
            </div>
          )}
        </div>

        {/* Controlled DatePicker (single Date value) */}
        <div>
          <Controller
            control={control}
            name='deadline'
            render={({ field: { value, onChange } }) => (
              <DatePicker
                value={value ?? null}
                onChange={(d) => onChange(d ?? null)}
              />
            )}
          />
          {errors.deadline && (
            <div className='text-sm text-red-500'>
              {errors.deadline.message}
            </div>
          )}
        </div>

        {/* Penalty */}
        <div className='max-w-md'>
          <div className='grid gap-2'>
            <label className='text-muted-foreground text-sm'>
              Penalty Type
            </label>

            <Controller
              control={control}
              name='penaltyType'
              render={({ field: { value, onChange } }) => (
                <div className='flex items-center justify-between'>
                  <RadioGroup
                    value={value}
                    onValueChange={(v) => onChange(v as PenaltyType)}
                    className='flex gap-3 w-full'
                  >
                    <label
                      className={`flex p-2 w-[48%] gap-3 border rounded-2xl items-center cursor-pointer transition ${
                        value === PenaltyType.DELAY_PAYMENT
                          ? "bg-muted border-muted-foreground/50"
                          : ""
                      }`}
                    >
                      <RadioGroupItem
                        value={PenaltyType.DELAY_PAYMENT}
                        id='DELAY_PAYMENT'
                      />
                      <div className='flex flex-col'>
                        <span>Delay Payment</span>
                        <span className='text-sm text-muted-foreground'>
                          Delay payment by specified time.
                        </span>
                      </div>
                    </label>

                    <label
                      className={`flex p-2 w-[48%] gap-3 border rounded-2xl items-center cursor-pointer ${
                        value === PenaltyType.SEND_BUDDY
                          ? "bg-muted border-muted-foreground/50"
                          : ""
                      }`}
                    >
                      <RadioGroupItem
                        value={PenaltyType.SEND_BUDDY}
                        id='SEND_BUDDY'
                      />
                      <div className='flex flex-col'>
                        <span>Send Buddy</span>
                        <span className='text-sm text-muted-foreground'>
                          Send to specified address.
                        </span>
                      </div>
                    </label>
                  </RadioGroup>
                </div>
              )}
            />
          </div>
        </div>

        {/* Penalty inputs */}
        <div>
          {penaltyType === PenaltyType.DELAY_PAYMENT && (
            <div>
              <div className='text-muted-foreground text-sm mb-1'>
                Delay Duration
              </div>
              <div className='flex gap-3'>
                <Input
                  type='number'
                  {...register("delayDays")}
                  placeholder='days'
                  min={0}
                  max={365}
                  className='flex-1'
                />
                <Input
                  type='number'
                  {...register("delayHours")}
                  placeholder='hours'
                  min={0}
                  max={23}
                  className='flex-1'
                />
              </div>
              {(errors.delayDays || errors.delayHours) && (
                <div className='text-sm text-red-500'>
                  {errors.delayDays?.message ?? errors.delayHours?.message}
                </div>
              )}
            </div>
          )}

          {penaltyType === PenaltyType.SEND_BUDDY && (
            <div>
              <div className='text-muted-foreground text-sm mb-1'>
                Buddy's Address
              </div>
              <Input {...register("buddyAddress")} placeholder='0x...' />
              {errors.buddyAddress && (
                <div className='text-sm text-red-500'>
                  {errors.buddyAddress.message}
                </div>
              )}
            </div>
          )}
        </div>

        <Button type='submit' className='w-full' disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Task"}
        </Button>
      </div>
    </form>
  );
}
