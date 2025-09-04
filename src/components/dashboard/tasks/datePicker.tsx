"use client";
import React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function DatePicker({
  value,
  onChange,
}: {
  value?: Date | null;
  onChange: (d: Date | null) => void;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <div>
      <div className='text-muted-foreground text-sm mb-1'>Deadline</div>
      <div className='flex gap-3'>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              className='justify-between font-normal text-muted-foreground'
            >
              {value ? value.toLocaleDateString() : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>

          <PopoverContent className='w-auto overflow-hidden p-0' align='start'>
            <Calendar
              mode='single'
              selected={value ?? undefined}
              captionLayout='dropdown'
              onSelect={(d: Date | undefined) => onChange(d ?? null)}
            />
          </PopoverContent>
        </Popover>
        <div className='flex flex-col gap-3 w-32'>
          <Input
            type='time'
            value={
              value
                ? `${String(new Date(value).getHours()).padStart(
                    2,
                    "0"
                  )}:${String(new Date(value).getMinutes()).padStart(2, "0")}`
                : "10:30"
            }
            onChange={(e) => {
              const t = e.target.value; // "" or "HH:MM"
              if (!t) {
                onChange(null); // clear the value if user deletes
                return;
              }

              const [hh, mm] = t.split(":").map(Number);
              const d = value ? new Date(value) : new Date();
              d.setHours(hh, mm, 0, 0);
              onChange(d);
            }}
            className='bg-background text-muted-foreground appearance-none 
             [&::-webkit-calendar-picker-indicator]:hidden 
             [&::-webkit-calendar-picker-indicator]:appearance-none'
          />
        </div>
      </div>
    </div>
  );
}
