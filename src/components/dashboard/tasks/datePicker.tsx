"use client"
import React from "react";
import { Button } from "../../ui/button";
import { Popover,PopoverTrigger,PopoverContent } from "../../ui/popover";
import {Calendar} from "../../ui/calendar";
import { ChevronDownIcon } from "lucide-react";
import { Input } from "../../ui/input";
export default function DatePicker() {
  const [isDateOpen, setIsDateOpen] = React.useState(false);
  const [deadline, setDeadline] = React.useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = React.useState<string>("10:30");
  function handleDateSelect() {
    
  }
  return (
    <div className=''>
      <div className="text-muted-foreground text-sm mb-1">Deadline</div>
      <div className='flex gap-3  '>
        <Popover open={isDateOpen} onOpenChange={setIsDateOpen} >
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              id='date-picker'
              className='justify-between font-normal text-muted-foreground'
            >
              {deadline ? deadline.toLocaleDateString() : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto overflow-hidden p-0' align='start'>
            <Calendar
              mode='single'
              selected={deadline}
              captionLayout='dropdown'
              onSelect={handleDateSelect}
            />
          </PopoverContent>
        </Popover>

        <div className='flex flex-col gap-3 w-32 '>
          <Input
            type='time'
            id='time-picker'
            value={selectedTime}
            
            className='bg-background text-muted-foreground appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none'
          />
        </div>
      </div>
    </div>
  );
}
