"use client";

import {
  flexRender,
  useReactTable,
  getCoreRowModel,
} from "@tanstack/react-table";
import { columns } from "./column";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import Createtaskbutton from "../tasks/create-task-button";

type TableSkeletonProps = {
  error?: boolean;
  noData?: boolean;
};

export function TableSkeleton({ error, noData }: TableSkeletonProps) {
  // create a table instance only with columns, no data
  const table = useReactTable({
    columns,
    data: [], // no data here
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>

      {!noData &&<div className="flex justify-between items-center">
        <Skeleton className='h-8 w-32 border' />
        <Skeleton className='h-8 w-32 border' />
      </div>}
      <div className='w-full border rounded'>
        <Table>
          <TableHeader className='bg-muted'>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className='pl-4 py-2 text-[16px]'>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {error || noData ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  {error && `Error Fetching tasks`}
                  {noData && `No tasks available`}
                </TableCell>
              </TableRow>
            ) : (
              Array.from({ length: 7 }).map((_, rowIdx) => (
                <TableRow key={rowIdx}>
                  {columns.map((col, colIdx) => (
                    <TableCell key={colIdx} className='pl-4 py-4'>
                      <Skeleton className='h-4 w-full' />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
