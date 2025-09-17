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
import { ServerPagination } from "./pagination";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TabKey, TaskTableData } from "@/types";

/**
 * Props for DataTable component.
 * 
 * - `columns`: Table column definitions (TanStack Table).
 * - `data`: Task data to display.
 * - `page`: Keeps track of current page number for each tab.
 * - `setPage`: Updates pagination state for the active tab.
 * - `activeTab`: Currently selected tab (Active, Completed, etc.).
 * - `statusCount`: Total number of items for the current tab.
 * - `itemsPerPage`: Items displayed per page.
 */
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
  statusCount: number;
  itemsPerPage: number;
}

export function DataTable<TValue>({
  columns,
  data,
  page,
  setPage,
  activeTab,
  statusCount,
  itemsPerPage,
}: DataTableProps<TValue>) {
  const router = useRouter();

  // Maps each tab label to its corresponding pagination key.
  const tabToPageKey: Record<TabKey, keyof typeof page> = {
    "Active tasks": "active",
    "Completed tasks": "completed",
    "Canceled tasks": "canceled",
    "Expired tasks": "expired",
  };

  // Initialize TanStack table instance.
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true, // external pagination handled separately
  });

  // Derive current status slug and pagination state.
  const statusSlug = activeTab.toLowerCase().replace(/\s+/g, "-");
  const pageKey = tabToPageKey[activeTab];
  const currentPage = page[pageKey] ?? 1;

  const totalPages =
    statusCount && itemsPerPage > 0
      ? Math.max(1, Math.ceil(statusCount / itemsPerPage))
      : 1;

  // Update active tab's page state.
  const handlePageChange = (newPage: number) => {
    setPage((prev) => ({
      ...prev,
      [pageKey]: newPage,
    }));
  };

  return (
    <>
      <div className="w-full border rounded">
        <Table>
          {/* Table Header */}
          <TableHeader className="bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="pl-4 py-2 text-[16px]"
                  >
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

          {/* Table Body */}
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer"
                  onClick={() =>
                    router.push(
                      `/dashboard/${statusSlug}/${row.original.slug.toString()}`
                    )
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="pl-4 py-4">
                      <Link
                        href={`/dashboard/${statusSlug}/${row.original.slug.toString()}`}
                        className="block w-full h-full"
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
              // Empty state
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <ServerPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        totalItems={statusCount}
        itemsPerPage={itemsPerPage}
      />
    </>
  );
}
