'use client';

import { Button } from './Button';
import { cn } from '@/lib/utils';

export interface PaginationProps {
  page: number;
  totalCount: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
}

const getPageCount = (totalCount: number, pageSize: number) =>
  Math.ceil(totalCount / pageSize);

export function Pagination({
  page,
  totalCount,
  pageSize = 10,
  onPageChange,
}: PaginationProps) {
  const totalPages = getPageCount(totalCount, pageSize);

  if (totalPages <= 1) {
    return null;
  }

  const handlePrevious = () => onPageChange(Math.max(1, page - 1));
  const handleNext = () => onPageChange(Math.min(totalPages, page + 1));

  // Show first, last, current, and adjacent pages
  const pages: (number | string)[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    if (page > 3) {
      pages.push(1, 'ellipsis');
    }
    for (
      let i = Math.max(1, page - 1);
      i <= Math.min(totalPages, page + 1);
      i++
    ) {
      pages.push(i);
    }
    if (page < totalPages - 2) {
      pages.push('ellipsis', totalPages);
    } else if (page === totalPages - 2) {
      pages.push(page + 1, totalPages);
    } else if (page === totalPages - 1) {
      pages.push(totalPages);
    }
  }

  return (
    <div className="flex items-center justify-between space-x-6 lg:space-x-8">
      <div className="hidden md:flex items-center space-x-2">
        <p className="text-sm text-gray-700">
          Page {page} of {totalPages}
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevious}
          disabled={page === 1}
        >
          &larr; Previous
        </Button>

        <div className="flex items-center space-x-1">
          {pages.map((p, i) => (
            <Button
              key={i}
              variant={typeof p === 'number' && p === page ? 'default' : 'ghost'}
              size="sm"
              onClick={() => typeof p === 'number' && onPageChange(p)}
              className="w-9 h-9 p-0"
              disabled={p === 'ellipsis'}
            >
              {p === 'ellipsis' ? (
                <span className="text-sm">...</span>
              ) : (
                p
              )}
            </Button>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          disabled={page === totalPages}
        >
          Next &rarr;
        </Button>
      </div>
    </div>
  );
}
