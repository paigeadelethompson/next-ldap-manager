'use client';

import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface TableProps extends HTMLAttributes<HTMLTableElement> {
  children: ReactNode;
}

const Table = ({ className, children, ...props }: TableProps) => (
  <div className="w-full overflow-auto">
    <table
      ref={undefined}
      className={cn('w-full caption-bottom text-sm', className)}
      {...props}
    >
      {children}
    </table>
  </div>
);
Table.displayName = 'Table';

export const TableHeader = ({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) => (
  <thead className={cn('[&_tr]:border-b [&_tr]:border-gray-200', className)} {...props} />
);

export const TableBody = ({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody
    className={cn('[&_tr:last-child]:border-0', className)}
    {...props}
  />
);

export const TableRow = ({
  className,
  ...props
}: HTMLAttributes<HTMLTableRowElement> & { selectable?: boolean }) => (
  <tr
    className={cn(
      'transition-colors hover:bg-gray-50 data-[state=selected]:bg-gray-50',
      className
    )}
    {...props}
  />
);

export const TableHead = ({
  className,
  ...props
}: HTMLAttributes<HTMLTableCellElement>) => (
  <th
    className={cn(
      'h-12 px-4 text-left align-middle font-medium text-gray-700 [&:has([role=checkbox])]:pr-0',
      className
    )}
    {...props}
  />
);

export const TableCell = ({
  className,
  ...props
}: HTMLAttributes<HTMLTableCellElement>) => (
  <td
    className={cn('p-4 align-middle text-gray-600 [&:has([role=checkbox])]:pr-0', className)}
    {...props}
  />
);

export const TableCaption = ({
  className,
  ...props
}: HTMLAttributes<HTMLTableCaptionElement>) => (
  <caption
    className={cn('mt-4 text-sm text-gray-500', className)}
    {...props}
  />
);

export { Table };
