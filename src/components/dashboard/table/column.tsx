"use client";
import { ColumnDef } from "@tanstack/react-table";
import { TaskStatus, TaskTableData } from "@/types";
import { Badge } from "../../ui/badge";

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
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return (
        <Badge variant={"outline"} className='flex items-center'>
          {TaskStatus[value]}
        </Badge>
      );
    },
  },
  {
    accessorKey: "deadline",
    header: "Deadline",
  },
];
