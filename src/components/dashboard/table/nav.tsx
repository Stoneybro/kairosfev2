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
type TableNavType = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

export default function TableNav({activeTab,setActiveTab}: TableNavType) {


  const activeTaskCount = 0;
  const completedTaskCount = 0;
  const canceledTaskCount = 0;
  const expiredTaskCount = 0;

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className='w-full flex flex-col gap-8 '
    >
      <div className='flex items-center justify-between  bg-muted/20'>
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
