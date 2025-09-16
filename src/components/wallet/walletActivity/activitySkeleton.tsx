import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

function ActivitySkeleton() {
  return (
    <div className="flex flex-col gap-2 justify-start items-start px-4 mb-auto w-full">
      <div className="text-2xl font-medium">Activity</div>
      <div className="bg-muted rounded-xl py-2 px-4 w-full text-xs">AA transactions are not available</div>
      <div className="w-full">
        {
          Array.from({ length: 7 }).map((tx,index)=>{
            return(
              <div key={index}  className="flex justify-between hover:bg-muted px-2 w-full border-b items-center py-4">
              <Skeleton className='w-full h-10'  />
                         </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default ActivitySkeleton