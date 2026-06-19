"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Card } from "@/components/ui/Card";
import { Loading } from "@/components/ui/Loading";

const COLUMNS = [
  { header: "Selector", key: "selector" },
  { header: "Domain", key: "domain" },
  { header: "Key File", key: "key_file" },
];

interface Selector {
  selector: string;
  domain?: string;
  key_file?: string;
}

interface SelectorsTableProps {
  selectors: Selector[];
  loading: boolean;
  error: string | null;
}

export function SelectorsTable({
  selectors,
  loading,
  error,
}: SelectorsTableProps) {
  if (loading) {
    return (
      <Card>
        <Loading fullScreen text="Loading selectors..." />
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <div className="card-content">
          <p className="text-red-600">{error}</p>
        </div>
      </Card>
    );
  }

  if (selectors.length === 0) {
    return (
      <Card>
        <div className="py-16 text-center">
          <p className="text-gray-500">No selectors found.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            {COLUMNS.map((col) => (
              <TableHead key={col.key}>{col.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {selectors.map((sel) => (
            <TableRow key={`${sel.domain}-${sel.selector}`}>
              {COLUMNS.map((col) => {
                const value = (sel as Record<string, unknown>)[col.key];
                return (
                  <TableCell key={`${sel.domain}-${sel.selector}-${col.key}`}>
                    {Array.isArray(value)
                      ? value.join(", ")
                      : typeof value === "object"
                        ? JSON.stringify(value)
                        : String(value ?? "")}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
