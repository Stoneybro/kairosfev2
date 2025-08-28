"use client";
import { ColumnDef } from "@tanstack/react-table";
import { TaskTableData } from "@/types";
import { Badge } from "../../ui/badge";
import { statusMap } from "@/types";

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
      const status = statusMap[value] ?? { label: "unknown", color: "" };
      return (
        <Badge variant={"outline"} className='flex items-center'>
          {status.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "deadline",
    header: "Deadline",
  },
];
