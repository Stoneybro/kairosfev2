"use client";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TablePagination } from "./pagination";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TabKey, TaskTableData } from "@/types";

interface DataTableProps<TValue> {
  columns: ColumnDef<TaskTableData, TValue>[];
  data: TaskTableData[];
  page: {
    active: number;
    completed: number;
    canceled: number;
    expired: number;
  };
  setPage: React.Dispatch<
    React.SetStateAction<{
      active: number;
      completed: number;
      canceled: number;
      expired: number;
    }>
  >;
  activeTab: TabKey;
}

export function DataTable<TValue>({
  columns,
  data,
  page,
  setPage,
  activeTab,
}: DataTableProps<TValue>) {
  const router = useRouter();
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const statusSlug = activeTab.toLowerCase().replace(/\s+/g, "-");
  return (
    <>
      <div className={`w-full  border rounded`}>
        <Table>
          <TableHeader className='bg-muted'>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className='pl-4 py-2 text-[16px]'
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className='cursor-pointer'
                  onClick={() =>
                    router.push(
                      `/dashboard/${statusSlug}/${row.original.slug.toString()}`
                    )
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className='pl-4 py-4'>
                      <Link
                        href={`/dashboard/${statusSlug}/${row.original.slug.toString()}`}
                        className='block w-full h-full'
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </Link>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <TablePagination table={table} />
    </>
  );
}
