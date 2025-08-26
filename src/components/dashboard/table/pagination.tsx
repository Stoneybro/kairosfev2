import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import type { Table } from "@tanstack/react-table";

type MyPaginationProps<TData> = {
  table: Table<TData>;
};

export function TablePagination<Tdata>({table}:MyPaginationProps<Tdata>) {
  const currentPage = table.getState().pagination.pageIndex;
  const totalPages = table.getPageCount();

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              table.previousPage();
            }}
            className={!table.getCanPreviousPage() ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {Array.from({ length: totalPages }).map((_, index) => (
          <PaginationItem key={index}>
            <PaginationLink
              href="#"
              isActive={index === currentPage}
              onClick={(e) => {
                e.preventDefault();
                table.setPageIndex(index);
              }}
            >
              {index + 1}
            </PaginationLink>
          </PaginationItem>
        ))}

        {totalPages > 5 && <PaginationEllipsis />}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              table.nextPage();
            }}
            className={!table.getCanNextPage() ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
