import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Pagination } from "@/types";

interface DataTablePaginationProps {
 pagination: Pagination | null;
 onPageChange: (page: number) => void;
}

export default function DataTablePagination({
 pagination,
 onPageChange,
}: DataTablePaginationProps) {
 if (!pagination || pagination.total_pages <= 1) {
 return null;
 }

 const { current_page, total_pages, total_records, limit } = pagination;

 const from = (current_page - 1) * limit + 1;
 const to = Math.min(current_page * limit, total_records);

  return (
    <div className="flex items-center justify-between px-4 py-2.5 border-t border-border/60">
      <div className="text-xs text-muted-foreground">
        Menampilkan {from}-{to} dari {total_records} data
      </div>
      <div className="flex items-center space-x-3">
        <span className="text-xs text-muted-foreground">
          Halaman <span className="font-semibold text-foreground">{current_page}</span> dari {total_pages}
        </span>
        <div className="flex items-center space-x-1.5">
          <Button
            variant="outline"
            size="sm"
            className="h-7 w-7 p-0 rounded-md"
            onClick={() => onPageChange(current_page - 1)}
            disabled={current_page === 1}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 w-7 p-0 rounded-md"
            onClick={() => onPageChange(current_page + 1)}
            disabled={current_page === total_pages}
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
