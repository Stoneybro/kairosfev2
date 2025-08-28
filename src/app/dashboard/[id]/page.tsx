//dashboard/[id]/page.tsx
import React from "react";
import Tasks from "@/components/dashboard/tasks/tasks";


 function page({ params }: { params: { id: string } }) {

return(
  <Tasks id={params.id} />
)
}

export default page;
