import React from 'react'
import CreateTaskForm from '@/components/dashboard/tasks/createtaskform'
import { getSmartAccountAddress } from '../page';
async function page() {
    const smartAccount = await getSmartAccountAddress();
  return (
    <div>
        <CreateTaskForm smartAccount={smartAccount} />
      
    </div>
  )
}

export default page