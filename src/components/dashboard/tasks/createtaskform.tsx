"use client";

import React, { useMemo } from "react";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PenaltyType } from "@/utils/constants";
import { parseEther } from "viem";
import { fetchDashboardBalance } from "@/utils/helpers";
import { useQuery } from "@tanstack/react-query";
import DatePicker from "@/components/dashboard/tasks/datePicker";
import { Skeleton } from "@/components/ui/skeleton";
import { useCreateTask } from "@/hooks/useCreateTask";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import LoaderButton from "@/components/ui/loaderButton";

/* ---------------- Schema ---------------- */
// Schema is dynamic because it validates against wallet balance.
// Also enforces cross-field rules (future deadline, valid penalty inputs).
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
      verificationMethod: z.number().refine((v) => /^[0-2]$/.test(String(v)), {
        message: "Verification method must be Manual, Partner or AI",
      }),
      penaltyType: z.nativeEnum(PenaltyType),
      delayDays: z.string().optional(),
      delayHours: z.string().optional(),
      buddyAddress: z
        .string()
        .optional()
        .refine(
          (v) => !v || /^0x[a-fA-F0-9]{40}$/.test(v),
          "Invalid Ethereum address"
        ),
    })
    .superRefine((vals, ctx) => {
      // Reward cannot exceed wallet balance
      if (vals.rewardEth) {
        try {
          const rewardWei = parseEther(vals.rewardEth);
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

      // Deadline must be in the future
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

      // Penalty-specific validation
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
        if (!vals.buddyAddress) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["buddyAddress"],
            message: "Buddy address is required.",
          });
        }
      }
    });
}

type FormValues = z.infer<ReturnType<typeof createSchema>>;

/* ---------------- Form ---------------- */

export default function CreateTaskForm({
  smartAccount,
}: {
  smartAccount?: `0x${string}`;
}) {
  const router = useRouter();

  // Query wallet balance for reward validation
  const { data: cardData, isLoading: cardDataIsLoading } = useQuery({
    queryKey: ["dashboardBalance", smartAccount],
    queryFn: () => fetchDashboardBalance(smartAccount as `0x${string}`),
    enabled: Boolean(smartAccount),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
  });

  // Rebuild schema whenever balance changes
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
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      rewardEth: "",
      deadline: null,
      verificationMethod: 0,
      penaltyType: PenaltyType.DELAY_PAYMENT,
      delayDays: "",
      delayHours: "",
      buddyAddress: "",
    },
  });

  const penaltyType = watch("penaltyType");

  // Transform + submit payload
  async function handleCreate(values: FormValues) {
    if (!isValid) return false;

    const delaySeconds =
      values.delayDays || values.delayHours
        ? Number(values.delayDays || 0) * 24 * 3600 +
          Number(values.delayHours || 0) * 3600
        : 0;

    const nowSec = Math.floor(Date.now() / 1000);

    const payload = {
      taskTitle: values.title,
      taskDescription: values.description,
      rewardAmount: parseEther(values.rewardEth),
      deadlineInSeconds: values.deadline
        ? BigInt(Math.floor(values.deadline.getTime() / 1000) - nowSec)
        : 3600n, // fallback deadline = 1h
      penaltyChoice: values.penaltyType === PenaltyType.DELAY_PAYMENT ? 1 : 2,
      verificationMethod: values.verificationMethod,
      delayPayment: BigInt(delaySeconds),
      sendBuddy:
        (values.buddyAddress as `0x${string}`) ||
        "0x0000000000000000000000000000000000000000",
    };

    try {
      await createTask.mutateAsync(payload);
      toast.success("Task Created Successfully");
      reset();
      router.push("/dashboard");
      return true;
    } catch (err) {
      console.error("create task failed", err);
      toast.error("Task Creation Failed");
      return false;
    }
  }

  /* ---------------- UI ---------------- */

  return (
    <form className='max-w-xl'>
      <div className='flex flex-col gap-4 w-full'>
        <div className='text-3xl'>Create Task</div>

        {/* Title */}
        <div>
          <label className='text-sm text-muted-foreground'>Task title</label>
          <Input {...register("title")} required />
          {errors.title && (
            <div className='text-sm mt-1 text-red-500'>
              {errors.title.message}
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <label className='text-sm text-muted-foreground'>
            Task Description
          </label>
          <Input {...register("description")} required />
          {errors.description && (
            <div className='text-sm mt-1 text-red-500'>
              {errors.description.message}
            </div>
          )}
        </div>

        {/* Reward */}
        <div>
          <label className='text-sm text-muted-foreground'>
            Reward Amount (ETH)
          </label>
          <Input
            {...register("rewardEth")}
            placeholder='0.00'
            inputMode='decimal'
          />
          <div className='text-muted-foreground bg-background text-xs text-end mt-1'>
            balance:
            {cardDataIsLoading ? (
              <Skeleton className='h-2 w-4' />
            ) : (
              cardData?.availableBalance
            )}
            ETH
          </div>
          {errors.rewardEth && (
            <div className='text-sm text-red-500'>
              {errors.rewardEth.message}
            </div>
          )}
        </div>

        {/* Deadline */}
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
          <div className='text-sm text-red-500'>{errors.deadline.message}</div>
        )}

        {/* Verification Method */}
        <Controller
          control={control}
          name='verificationMethod'
          render={({ field: { value, onChange } }) => (
            <RadioGroup
              value={String(value)}
              onValueChange={(vm) => onChange(vm)}
            >
              <div className='text-muted-foreground text-sm'>
                Verification Method
              </div>
              <label
                htmlFor='r1'
                className='flex items-center gap-1 text-muted-foreground text-sm'
              >
                <RadioGroupItem value='0' id='r1' /> Manual
              </label>
              <label
                htmlFor='r2'
                className='flex items-center gap-1 text-muted-foreground/50 text-sm'
              >
                <RadioGroupItem value='1' id='r2' disabled /> Accountability
                partner
              </label>
              <label
                htmlFor='r3'
                className='flex items-center gap-1 text-muted-foreground/50 text-sm'
              >
                <RadioGroupItem value='2' id='r3' disabled /> A.I. Verification
              </label>
            </RadioGroup>
          )}
        />

        {/* Penalty Type */}
        <Controller
          control={control}
          name='penaltyType'
          render={({ field: { value, onChange } }) => (
            <RadioGroup
              value={value}
              onValueChange={(v) => onChange(v as PenaltyType)}
              className='flex gap-3 w-full'
            >
              <label
                className={`flex p-2 w-[48%] gap-3 border rounded-2xl items-center cursor-pointer ${
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
          )}
        />

        {/* Penalty Inputs */}
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

        {/* Submit */}
        <LoaderButton
          className='w-full'
          idleText='Create Task'
          loadingText='Creating...'
          successText='Task Created!'
          disabled={isSubmitting}
          timeoutMs={60000}
          executeAction={async () => {
            let success = false;
            await handleSubmit(async (values) => {
              success = await handleCreate(values);
            })();
            return success;
          }}
        />
      </div>
    </form>
  );
}
