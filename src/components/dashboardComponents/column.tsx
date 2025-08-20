"use client"
import { ColumnDef } from "@tanstack/react-table";
import { TaskTableData } from "@/lib/types";
import { Badge } from "../ui/badge";
import { Dot } from "lucide-react";
import { GoDotFill } from "react-icons/go";
import { statusMap } from "@/lib/types";


export const columns: ColumnDef<TaskTableData>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "rewardAmount",
    header: "Reward",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({getValue})=>{
      const value=getValue<number>()
      const status=statusMap[value]??{label:"unknown",color:""}
      return(
        <Badge variant={"outline"} className="flex items-center">
          {/* <GoDotFill  className={`${status.color} !w-4 !h-4 `} /> */}
          {status.label}
        </Badge>
      )
    }

  },
  {
    accessorKey: "deadline",
    header: "Deadline",
  },
];
