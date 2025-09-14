import React from 'react'
import Spinner from '@/components/ui/spinner'
function Page() {
  return (
    <div className='h-full w-full flex justify-center items-center'>
        <Spinner h={175} w={175} rotate={true} />
    </div>
  )
}

export default Page