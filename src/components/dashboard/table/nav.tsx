"use client";
import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { fetchTasksCount } from "@/utils/helpers";
type TableNavType = {
  activeTab: "Active tasks" | "Completed tasks" | "Canceled tasks" | "Expired tasks";
  setActiveTab: (tab:  "Active tasks" | "Completed tasks" | "Canceled tasks" | "Expired tasks") => void;
  smartAccount:`0x${string}`
};

export default function TableNav({activeTab,setActiveTab,smartAccount}: TableNavType) {
const{data,isLoading,error}=useQuery({
  queryKey:["taskCount",smartAccount],
  queryFn:()=>fetchTasksCount(smartAccount),
  refetchOnWindowFocus:false,
  staleTime:Infinity
})
  const activeTaskCount = isLoading?0:data[0]
  const completedTaskCount =  isLoading?0:data[1]
  const canceledTaskCount =  isLoading?0:data[2]
  const expiredTaskCount = isLoading?0:data[3]
  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => setActiveTab(value as TableNavType["activeTab"])}
      className='w-full flex flex-col gap-8 '

    >
      <div className='flex items-center justify-between  bg-muted/20'  id="tour-task-tabs">
        <label htmlFor='view-selector' className='sr-only'>
          View
        </label>
        <Select value={activeTab}  onValueChange={setActiveTab}>
          <SelectTrigger
            className='flex w-fit @4xl/main:hidden'
            size='sm'
            id='view-selector'
          >
            <SelectValue placeholder='Select a view' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='Active tasks'>Active tasks</SelectItem>
            <SelectItem value='Completed tasks'>Completed tasks</SelectItem>
            <SelectItem value='Canceled tasks'>Canceled tasks</SelectItem>
            <SelectItem value='Expired tasks'>Expired Tasks</SelectItem>
          </SelectContent>
        </Select>
        <TabsList className='**:data-[slot=badge]:bg-muted-foreground/30 bg-muted  hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex'>
          <TabsTrigger value='Active tasks'>
            Active tasks
            {activeTaskCount != 0 && (
              <Badge variant='secondary'>{activeTaskCount}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value='Completed tasks'>
            Completed tasks
            {completedTaskCount != 0 && (
              <Badge variant='secondary'>{completedTaskCount}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value='Canceled tasks'>
            Canceled tasks
            {canceledTaskCount != 0 && (
              <Badge variant='secondary'>{canceledTaskCount}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value='Expired tasks'>
            Expired Tasks
            {expiredTaskCount != 0 && (
              <Badge variant='secondary'>{expiredTaskCount}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

      </div>

    </Tabs>
  );
}
