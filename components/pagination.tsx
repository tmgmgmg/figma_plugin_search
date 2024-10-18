import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  searchParams: {
    search?: string;
    category?: string;
    tag?: string;
  };
}

export function Pagination({
  currentPage,
  totalPages,
  searchParams,
}: PaginationProps) {
  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams as Record<string, string>);
    params.set("page", page.toString());
    return `/?${params.toString()}`;
  };

  return (
    <div className="flex items-center justify-center space-x-2 mt-6">
      <Button
        variant="outline"
        size="icon"
        asChild
        disabled={currentPage === 1}
      >
        <Link href={createPageUrl(Math.max(1, currentPage - 1))}>
          <ChevronLeft className="h-4 w-4" />
        </Link>
      </Button>
      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
        const pageNumber = i + 1;
        return (
          <Button
            key={pageNumber}
            variant={pageNumber === currentPage ? "default" : "outline"}
            asChild
          >
            <Link href={createPageUrl(pageNumber)}>{pageNumber}</Link>
          </Button>
        );
      })}
      {totalPages > 5 && <span>...</span>}
      {totalPages > 5 && (
        <Button
          variant={totalPages === currentPage ? "default" : "outline"}
          asChild
        >
          <Link href={createPageUrl(totalPages)}>{totalPages}</Link>
        </Button>
      )}
      <Button
        variant="outline"
        size="icon"
        asChild
        disabled={currentPage >= totalPages}
      >
        <Link href={createPageUrl(Math.min(totalPages, currentPage + 1))}>
          <ChevronRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
