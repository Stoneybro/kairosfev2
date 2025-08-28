"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { PenaltyType } from "@/types";
import { ChevronDownIcon } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import DatePicker from "@/components/dashboard/tasks/datePicker";
export default function CreateTaskForm() {
  const [taskDescription, setTaskDescription] = useState("");
  const [rewardAmount, setRewardAmount] = useState("");
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);
  const [delayDuration, setDelayDuration] = useState("");
  const [buddyAddress, setBuddyAddress] = useState("");
  const [penaltyType, setPenaltyType] = useState(PenaltyType.DELAY_PAYMENT);
  const [delayDays, setDelayDays] = useState("");
  const [delayHours, setDelayHours] = useState("");
  const deadlineJsx = "";
  return (
    <div className='max-w-xl'>
      <div className='  flex flex-col gap-4 w-full '>
        <div className='text-3xl'>Create Task</div>
        {/* Task description */}
        <div className=''>
          <label
            htmlFor='TaskDescription'
            className='text-sm text-muted-foreground'
          >
            {" "}
            Task Description
          </label>
          <Input
            id='TaskDescription'
            name='Task Description'
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            placeholder='Make a new task'
            required
            className='text-sm'
          />
        </div>

        {/* Reward Amount */}
        <div className=' '>
          <label
            htmlFor='RewardAmount'
            className='text-sm text-muted-foreground'
          >
            Reward Amount (ETH)
          </label>
          <Input
            id='RewardAmount'
            name='Reward Amount'
            step='0.01'
            value={rewardAmount}
            onChange={(e) => setRewardAmount(e.target.value)}
            required
            className='w-full'
          />
          <div className='text-muted-foreground text-xs text-end mt-1'>
            balance: 0.001 ETH
          </div>
        </div>
        {/* Deadline */}
        <div className=''>
          <DatePicker />
        </div>

        {/* Penalty */}
        <div className='max-w-md'>
          <div className='grid gap-2'>
            <label
              htmlFor='penaltyType'
              className='text-muted-foreground text-sm'
            >
              Penalty Type
            </label>
            <RadioGroup
              className='flex items-center justify-between'
              value={penaltyType}
              onValueChange={(value) => {
                setPenaltyType(value as PenaltyType);
              }}
            >
              {/* Delay Payment */}
              <label
                htmlFor='DELAY_PAYMENT'
                className={`flex lg:p-3 p-2 w-[48%] gap-3  border-1 rounded-2xl items-center cursor-pointer transition ${
                  penaltyType === PenaltyType.DELAY_PAYMENT
                    ? "bg-muted border-muted-foreground/50"
                    : ""
                }`}
              >
                <RadioGroupItem
                  value='DELAY_PAYMENT'
                  id='DELAY_PAYMENT'
                  className='mt-[2px] bg-muted-foreground/20'
                />
                <div className='flex flex-col'>
                  <span className=' '>Delay Payment</span>
                  <span className='text-sm text-muted-foreground'>
                    Delay payment by specified time.
                  </span>
                </div>
              </label>

              {/* Send Buddy */}
              <label
                htmlFor='SEND_BUDDY'
                className={`flex lg:p-3 p-2 w-[48%] gap-3 border transition rounded-2xl items-center cursor-pointer  ${
                  penaltyType === PenaltyType.SEND_BUDDY
                    ? "bg-muted border-muted-foreground/50"
                    : ""
                }`}
              >
                <RadioGroupItem
                  value='SEND_BUDDY'
                  id='SEND_BUDDY'
                  className='mt-[2px] bg-muted-foreground/20'
                />
                <div className='flex flex-col'>
                  <span className=''>Send Buddy</span>
                  <span className='text-sm text-muted-foreground'>
                    Sent to specified address.
                  </span>
                </div>
              </label>
            </RadioGroup>
          </div>
        </div>
        {/** Penalty Inputs */}

        {/* Delay Duration and Buddy Address */}
        <div className=''>
          {penaltyType === PenaltyType.DELAY_PAYMENT && (
            <div>
              <div className='text-muted-foreground text-sm mb-1'>
                Delay Duration
              </div>
              <div className='flex gap-3'>
                <div className='flex-1'>
                  <Input
                    type='number'
                    value={delayDays}
                    onChange={() => {}}
                    placeholder='days'
                    min='0'
                    max='30'
                    className='w-full text-sm'
                  />
                </div>
                <div className='flex-1'>
                  <Input
                    type='number'
                    value={delayHours}
                    placeholder='hours'
                    onChange={() => {}}
                    min='0'
                    max='23'
                    className='w-full text-sm'
                  />
                </div>
              </div>
            </div>
          )}

          {penaltyType === PenaltyType.SEND_BUDDY && (
            <div>
              <div className='text-muted-foreground text-sm mb-1'>
                Buddy's Address
              </div>
              <Input
                type='text'
                value={buddyAddress}
                onChange={(e) => setBuddyAddress(e.target.value)}
                placeholder='0x...'
                className='w-full text-sm'
              />
            </div>
          )}
        </div>
        <Button className='w-full'> Create Task</Button>
      </div>
    </div>
  );
}
